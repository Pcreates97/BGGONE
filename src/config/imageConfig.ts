/**
 * Central configuration for client-side background removal and image handling.
 * Optimized for high quality edge matting, sub-second execution, and zero memory leaks.
 */
export const IMAGE_CONFIG = {
  /**
   * Maximum dimension (width or height) for neural segmentation inference.
   * 2048px preserves crisp fine details like hair strands, glasses, fur, and intricate edges.
   */
  maxInferenceDimension: 2048,

  /**
   * Hard limits to protect browser memory and prevent crashes on mobile or low-RAM devices.
   */
  maxFileSizeBytes: 35 * 1024 * 1024, // 35 MB
  maxDimensionPixels: 8192, // 8K maximum dimension
  maxTotalPixels: 64_000_000, // 64 Megapixels

  /**
   * Model architecture:
   * - 'medium': isnet_fp16 (~44 MB) - High precision 16-bit float weights for clean edge matting & hair detail.
   * - 'small': isnet_quint8 (~22 MB) - 8-bit quantized integer weights (lower precision).
   * - 'large': isnet (~176 MB) - 32-bit float.
   */
  model: "medium" as const,

  /**
   * Target output format and quality.
   */
  outputFormat: "image/png" as const,
  outputQuality: 1.0,

  /**
   * Hardware execution mode for local fallback:
   * Try WebGPU if available for ultra-fast GPU inference, with smooth fallback to multi-threaded CPU WASM SIMD.
   */
  preferWebGPU: true,

  /**
   * Preload AI model in the background on initial page mount so processing is instant when user drops an image.
   */
  preloadOnMount: true,
};
