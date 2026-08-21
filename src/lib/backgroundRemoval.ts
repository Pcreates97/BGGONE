import {
  removeBackground as imglyRemoveBackground,
  preload as imglyPreload,
  type Config,
} from "@imgly/background-removal";
import { IMAGE_CONFIG } from "../config/imageConfig";
import { removeBackgroundServerFn } from "./serverRemoveBg";
import { recombineWithOriginalResolution } from "./imageEnhancer";

export interface RemoveBackgroundOptions {
  onProgress?: (fraction: number, message: string) => void;
  signal?: AbortSignal;
}

export type EngineStatus = "uninitialized" | "preloading" | "ready" | "error";

// Singleton engine state tracking across calls
let engineStatus: EngineStatus = "uninitialized";
let activeDevice: "gpu" | "cpu" = "cpu";
let preloadPromise: Promise<void> | null = null;
let webGpuCheckPromise: Promise<boolean> | null = null;

function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Perform ultra-fast background removal using the configured Cloud API service.
 */
async function removeBackgroundViaCloudApi(
  file: File,
  opts?: RemoveBackgroundOptions,
): Promise<Blob> {
  opts?.onProgress?.(0.2, "Sending image to high-speed AI engine...");

  let cutoutBlob: Blob | null = null;

  // 1. Try server function RPC with full resolution
  try {
    const base64 = await fileToBase64(file);
    opts?.onProgress?.(0.5, "Processing background removal...");

    const res = await removeBackgroundServerFn({
      data: { imageBase64: base64, size: "full" },
    });

    if (res && res.dataUrl) {
      opts?.onProgress?.(0.8, "Restoring full native resolution...");
      const fetchRes = await fetch(res.dataUrl);
      cutoutBlob = await fetchRes.blob();
    }
  } catch (rpcErr) {
    console.warn("ServerFn returned error, attempting direct REST endpoint:", rpcErr);
  }

  // 2. Fallback to direct REST endpoint
  if (!cutoutBlob) {
    const formData = new FormData();
    formData.append("image_file", file, file.name || "image.png");
    formData.append("size", "full");

    opts?.onProgress?.(0.6, "Processing transparent cutout...");

    const response = await fetch("/api/removebg", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const errorMsg =
        errorJson?.error || `Background removal API returned status ${response.status}`;
      throw new Error(errorMsg);
    }

    cutoutBlob = await response.blob();
  }

  opts?.onProgress?.(0.95, "Preserving 100% full original resolution & quality...");
  const fullResBlob = await recombineWithOriginalResolution(file, cutoutBlob);

  return fullResBlob;
}

/**
 * Check if WebGPU is available and supported on the current device.
 */
export async function isWebGPUSupported(): Promise<boolean> {
  if (!IMAGE_CONFIG.preferWebGPU) return false;
  if (typeof navigator === "undefined" || !navigator.gpu) return false;

  if (webGpuCheckPromise) return webGpuCheckPromise;

  webGpuCheckPromise = (async () => {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return adapter !== null;
    } catch {
      return false;
    }
  })();

  return webGpuCheckPromise;
}

/**
 * Build a stable configuration object for @imgly/background-removal fallback.
 */
async function getEngineConfig(opts?: RemoveBackgroundOptions, forceCpu = false): Promise<Config> {
  let device: "gpu" | "cpu" = "cpu";

  if (!forceCpu) {
    const gpuSupported = await isWebGPUSupported();
    if (gpuSupported) {
      device = "gpu";
    }
  }

  activeDevice = device;

  const config: Config = {
    model: IMAGE_CONFIG.model,
    device,
    output: {
      format: IMAGE_CONFIG.outputFormat,
      quality: IMAGE_CONFIG.outputQuality,
    },
    progress: (status: string, current: number, total: number) => {
      if (!opts?.onProgress) return;

      let message = "Processing...";
      let fraction = 0;
      if (total && total > 0) {
        fraction = Math.min(Math.max(current / total, 0), 1);
      }

      if (status.startsWith("fetch")) {
        const pct = total ? ` (${Math.round(fraction * 100)}%)` : "";
        message = `Downloading AI model${pct}...`;
      } else if (status.startsWith("onnx") || status.includes("init")) {
        message = "Initializing AI engine...";
      } else if (status === "compute:decode") {
        message = "Preparing image...";
      } else if (status === "compute:inference") {
        message = "Finding subject with AI...";
      } else if (status === "compute:mask") {
        message = "Extracting clean edges...";
      } else if (status.startsWith("compute:encode")) {
        message = "Finalizing transparent image...";
      } else {
        message = status.charAt(0).toUpperCase() + status.slice(1).replace(/[:_]/g, " ");
      }

      opts.onProgress(fraction, message);
    },
  };

  return config;
}

/**
 * Preload the local fallback AI model in the background.
 */
export async function preloadBackgroundRemovalModel(): Promise<void> {
  if (engineStatus === "ready") return;
  if (preloadPromise) return preloadPromise;

  engineStatus = "preloading";

  preloadPromise = (async () => {
    try {
      const config = await getEngineConfig();
      await imglyPreload(config);
      engineStatus = "ready";
    } catch (err) {
      if (activeDevice === "gpu") {
        try {
          const cpuConfig = await getEngineConfig(undefined, true);
          await imglyPreload(cpuConfig);
          engineStatus = "ready";
          activeDevice = "cpu";
          return;
        } catch {
          // Keep error state
        }
      }
      engineStatus = "error";
      preloadPromise = null;
      console.warn("Local model preload notice:", err);
    }
  })();

  return preloadPromise;
}

/**
 * Downscale overly large images before local inference to protect memory.
 */
export async function preprocessImageForInference(
  file: File,
  maxDimension = IMAGE_CONFIG.maxInferenceDimension,
): Promise<{ source: File | Blob; wasResized: boolean }> {
  let width = 0;
  let height = 0;
  let bitmap: ImageBitmap | null = null;

  if (typeof createImageBitmap !== "undefined") {
    try {
      bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;
    } catch {
      // fallback to Image element below
    }
  }

  if (!bitmap) {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not read image"));
        img.src = url;
      });
      width = img.naturalWidth;
      height = img.naturalHeight;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  if (width <= maxDimension && height <= maxDimension) {
    if (bitmap) {
      bitmap.close();
    }
    return { source: file, wasResized: false };
  }

  const scale = maxDimension / Math.max(width, height);
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  let blob: Blob | null = null;

  if (typeof OffscreenCanvas !== "undefined") {
    const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = offscreen.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (bitmap) {
        ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      } else {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        await img.decode();
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        URL.revokeObjectURL(url);
      }
      blob = await offscreen.convertToBlob({ type: "image/png" });
    }
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (bitmap) {
        ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      } else {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        await img.decode();
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        URL.revokeObjectURL(url);
      }
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
    }
  }

  if (bitmap) {
    bitmap.close();
  }

  if (blob) {
    return { source: blob, wasResized: true };
  }

  return { source: file, wasResized: false };
}

/**
 * Remove background from an image file using the fast cloud API with automatic client fallback.
 */
export async function removeBackground(
  file: File,
  opts: RemoveBackgroundOptions = {},
): Promise<Blob> {
  // 1. Primary: Lightning-fast Cloud API removal (1-2 seconds)
  try {
    const result = await removeBackgroundViaCloudApi(file, opts);
    opts.onProgress?.(1.0, "Complete!");
    return result;
  } catch (cloudError) {
    console.warn("Cloud background removal API error, running local fallback:", cloudError);
    opts.onProgress?.(0.2, "Processing image locally with AI...");

    // 2. Secondary: Fallback to local in-browser neural engine
    const { source } = await preprocessImageForInference(file);
    const config = await getEngineConfig(opts);

    let rawResult: Blob;

    try {
      rawResult = await imglyRemoveBackground(source, config);
      engineStatus = "ready";
    } catch (primaryError) {
      if (activeDevice === "gpu") {
        console.warn("WebGPU fallback failed. Falling back to CPU/WASM:", primaryError);
        activeDevice = "cpu";
        const cpuConfig = await getEngineConfig(opts, true);
        rawResult = await imglyRemoveBackground(source, cpuConfig);
        engineStatus = "ready";
      } else {
        throw primaryError;
      }
    }

    opts.onProgress?.(0.95, "Restoring full native resolution & details...");
    const fullResBlob = await recombineWithOriginalResolution(file, rawResult);

    opts.onProgress?.(1.0, "Complete!");
    return fullResBlob;
  }
}

/**
 * Get current engine diagnostics.
 */
export function getEngineDiagnostics() {
  return {
    status: engineStatus,
    activeDevice,
    maxInferenceDimension: IMAGE_CONFIG.maxInferenceDimension,
    model: IMAGE_CONFIG.model,
  };
}
