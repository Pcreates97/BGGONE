/**
 * Central configuration for client-side background removal and image handling.
 * Easily tune inference dimensions, memory safety bounds, and model defaults.
 */
export const IMAGE_CONFIG = {
  /**
   * Maximum dimension (width or height) for image inference.
   * Scaled down intelligently before inference to match the ISNet 1024x1024 receptive field,
   * cutting pure-JS tensor resizing and canvas encoding time by over 75%
   * while keeping crisp HD visual quality.
   */
  maxInferenceDimension: 1280,

  /**
   * Hard limits to protect browser memory and prevent crashes on mobile or low-RAM devices.
   */
  maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB
  maxDimensionPixels: 8192, // 8K maximum dimension
  maxTotalPixels: 64_000_000, // 64 Megapixels

  /**
   * Model architecture:
   * - 'small': isnet_quint8 (~22 MB) - 8-bit quantized integer weights; 3x-4x faster on CPU/WASM SIMD, 50% smaller download.
   * - 'medium': isnet_fp16 (~44 MB) - 16-bit float.
   * - 'large': isnet (~176 MB) - 32-bit float.
   */
  model: "small" as const,

  /**
   * Target output format and quality.
   */
  outputFormat: "image/png" as const,
  outputQuality: 1.0,

  /**
   * Hardware execution mode for local fallback:
   * CPU WASM SIMD multi-threading is extremely stable and avoids ONNX execution provider warnings.
   */
  preferWebGPU: false,

  /**
   * Preload toggle for fallback model. Disabled by default since the cloud API is the primary engine.
   */
  preloadOnMount: false,
};
