import { useCallback, useEffect, useRef, useState } from "react";
import { loadImageDimensions, validateDimensions, validateFile } from "../lib/imageValidation";
import { preloadBackgroundRemovalModel, removeBackground } from "../lib/backgroundRemoval";
import { IMAGE_CONFIG } from "../config/imageConfig";
import type { ProcessedResult, SelectedImage, ToolStatus } from "../types/image";

export function useBackgroundRemoval() {
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("Preparing image...");

  const imageRef = useRef<SelectedImage | null>(null);
  const resultRef = useRef<ProcessedResult | null>(null);
  imageRef.current = image;
  resultRef.current = result;

  // Eagerly preload model on page load in the background
  useEffect(() => {
    if (IMAGE_CONFIG.preloadOnMount && typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          preloadBackgroundRemovalModel().catch(() => {});
        });
      } else {
        setTimeout(() => {
          preloadBackgroundRemovalModel().catch(() => {});
        }, 100);
      }
    }
  }, []);

  // Cleanup object URLs on unmount.
  useEffect(() => {
    return () => {
      if (imageRef.current) URL.revokeObjectURL(imageRef.current.url);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    };
  }, []);

  const reset = useCallback(() => {
    if (image) URL.revokeObjectURL(image.url);
    if (result) URL.revokeObjectURL(result.url);
    setImage(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setProgressMessage("Preparing image...");
    setStatus("idle");
  }, [image, result]);

  const selectFile = useCallback(
    async (file: File) => {
      const err = validateFile(file);
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      // Clean up any prior state.
      if (image) URL.revokeObjectURL(image.url);
      if (result) URL.revokeObjectURL(result.url);
      setResult(null);
      setError(null);
      setProgress(0);
      setProgressMessage("Preparing image...");

      const url = URL.createObjectURL(file);
      try {
        const dims = await loadImageDimensions(url);

        const dimErr = validateDimensions(dims.width, dims.height);
        if (dimErr) {
          URL.revokeObjectURL(url);
          setError(dimErr.message);
          setStatus("error");
          return;
        }

        setImage({
          file,
          url,
          meta: {
            name: file.name,
            size: file.size,
            width: dims.width,
            height: dims.height,
            type: file.type,
          },
        });
        setStatus("selected");
      } catch {
        URL.revokeObjectURL(url);
        setError("We couldn't read that image. Try another file.");
        setStatus("error");
      }
    },
    [image, result],
  );

  const process = useCallback(async () => {
    if (!image) return;
    setStatus("processing");
    setError(null);
    setProgress(0);
    setProgressMessage("Starting background removal...");
    try {
      const blob = await removeBackground(image.file, {
        onProgress: (fraction, msg) => {
          setProgress(fraction);
          setProgressMessage(msg);
        },
      });
      const url = URL.createObjectURL(blob);
      setResult({ blob, url });
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went sideways. Give it another go.");
      setStatus("error");
    }
  }, [image]);

  return { status, image, result, error, progress, progressMessage, selectFile, process, reset };
}
