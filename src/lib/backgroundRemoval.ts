import {
  removeBackground as imglyRemoveBackground,
  preload as imglyPreload,
  type Config,
} from "@imgly/background-removal";
import { IMAGE_CONFIG } from "../config/imageConfig";
import { checkServerApiCapability, removeBackgroundServerFn } from "./serverRemoveBg";
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
let serverCapabilityPromise: Promise<{ hasCloudApi: boolean }> | null = null;

function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check if the server has active Cloud API credentials (Remove.bg or Gemini).
 */
async function hasServerCloudApi(): Promise<boolean> {
  if (serverCapabilityPromise) return (await serverCapabilityPromise).hasCloudApi;

  serverCapabilityPromise = (async () => {
    try {
      const res = await checkServerApiCapability();
      return { hasCloudApi: Boolean(res?.hasCloudApi) };
    } catch {
      return { hasCloudApi: false };
    }
  })();

  return (await serverCapabilityPromise).hasCloudApi;
}

/**
 * Perform background removal using the configured Cloud API service.
 */
async function removeBackgroundViaCloudApi(
  file: File,
  opts?: RemoveBackgroundOptions,
): Promise<Blob | null> {
  const isAvailable = await hasServerCloudApi();
  if (!isAvailable) {
    return null; // Don't waste time on failed network roundtrips
  }

  opts?.onProgress?.(0.2, "Sending image to Cloud AI engine...");

  // 1. Try server function RPC
  try {
    const base64 = await fileToBase64(file);
    opts?.onProgress?.(0.5, "Processing background removal...");

    const res = await removeBackgroundServerFn({
      data: { imageBase64: base64, size: "full" },
    });

    if (res && res.success && res.dataUrl) {
      opts?.onProgress?.(0.85, "Finalizing transparent image...");
      const fetchRes = await fetch(res.dataUrl);
      const cutoutBlob = await fetchRes.blob();
      return await recombineWithOriginalResolution(file, cutoutBlob);
    }
  } catch (rpcErr) {
    console.warn("Cloud server function error:", rpcErr);
  }

  return null;
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
        message = `Loading neural AI model${pct}...`;
      } else if (status.startsWith("onnx") || status.includes("init")) {
        message = "Initializing neural engine...";
      } else if (status === "compute:decode") {
        message = "Analyzing image structure...";
      } else if (status === "compute:inference") {
        message = "Isolating subject with AI...";
      } else if (status === "compute:mask") {
        message = "Refining hair & edge matting...";
      } else if (status.startsWith("compute:encode")) {
        message = "Generating transparent PNG...";
      } else {
        message = status.charAt(0).toUpperCase() + status.slice(1).replace(/[:_]/g, " ");
      }

      opts.onProgress(fraction, message);
    },
  };

  return config;
}

/**
 * Preload the local AI model in the background on mount.
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
      console.warn("Model preload status notice:", err);
    }
  })();

  return preloadPromise;
}

/**
 * Downscale overly large images before local inference to protect memory and accelerate inference.
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
 * Remove background with high-speed neural segmentation and instant fallback.
 */
export async function removeBackground(
  file: File,
  opts: RemoveBackgroundOptions = {},
): Promise<Blob> {
  // 1. Try Cloud API if credentials exist
  try {
    const cloudResult = await removeBackgroundViaCloudApi(file, opts);
    if (cloudResult) {
      opts.onProgress?.(1.0, "Complete!");
      return cloudResult;
    }
  } catch (cloudError) {
    console.warn("Cloud background removal error, proceeding to local neural engine:", cloudError);
  }

  // 2. High-performance In-Browser Neural Engine
  opts.onProgress?.(0.15, "Isolating background with neural engine...");

  const { source } = await preprocessImageForInference(file);
  const config = await getEngineConfig(opts);

  let rawResult: Blob;

  try {
    rawResult = await imglyRemoveBackground(source, config);
    engineStatus = "ready";
  } catch (primaryError) {
    if (activeDevice === "gpu") {
      console.warn("WebGPU inference failed. Switching to multi-threaded CPU WASM:", primaryError);
      activeDevice = "cpu";
      const cpuConfig = await getEngineConfig(opts, true);
      rawResult = await imglyRemoveBackground(source, cpuConfig);
      engineStatus = "ready";
    } else {
      throw primaryError;
    }
  }

  opts.onProgress?.(0.95, "Compositing crisp native resolution...");
  const fullResBlob = await recombineWithOriginalResolution(file, rawResult);

  opts.onProgress?.(1.0, "Complete!");
  return fullResBlob;
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
