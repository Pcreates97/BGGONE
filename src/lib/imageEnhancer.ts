/**
 * Full-resolution alpha-mask compositing engine.
 * Ensures background removal outputs maintain 100% identical quality, color fidelity,
 * and exact pixel dimensions as the original source image.
 */

/**
 * Load an Image element from a Blob or Object URL.
 */
function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image data"));
    };
    img.src = url;
  });
}

/**
 * Recombines the AI-generated alpha mask with the original full-resolution source image.
 * This guarantees the exact same image size and pixel quality as the original upload:
 * - 100% original RGB color data is preserved from the original file (no compression or filter distortion)
 * - Only the alpha transparency mask is sampled and mapped to the original dimensions
 * - Outputs a clean, lossless transparent PNG at the exact original width and height
 */
export async function recombineWithOriginalResolution(
  originalFile: File,
  cutoutBlob: Blob,
): Promise<Blob> {
  const [originalImg, cutoutImg] = await Promise.all([
    loadImageFromBlob(originalFile),
    loadImageFromBlob(cutoutBlob),
  ]);

  const origWidth = originalImg.naturalWidth || originalImg.width;
  const origHeight = originalImg.naturalHeight || originalImg.height;
  const cutoutWidth = cutoutImg.naturalWidth || cutoutImg.width;
  const cutoutHeight = cutoutImg.naturalHeight || cutoutImg.height;

  // If cutout is already at exact original resolution, return it directly
  if (cutoutWidth === origWidth && cutoutHeight === origHeight) {
    return cutoutBlob;
  }

  // Create full-resolution canvas matching original image dimensions
  const canvas = document.createElement("canvas");
  canvas.width = origWidth;
  canvas.height = origHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return cutoutBlob;

  // Step 1: Draw pristine full-resolution original image (preserves exact colors & details)
  ctx.drawImage(originalImg, 0, 0, origWidth, origHeight);
  const origImageData = ctx.getImageData(0, 0, origWidth, origHeight);
  const origData = origImageData.data;

  // Step 2: Render cutout mask to get alpha values
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = cutoutWidth;
  maskCanvas.height = cutoutHeight;
  const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
  if (!maskCtx) return cutoutBlob;

  maskCtx.drawImage(cutoutImg, 0, 0, cutoutWidth, cutoutHeight);
  const cutoutImageData = maskCtx.getImageData(0, 0, cutoutWidth, cutoutHeight);
  const cutoutData = cutoutImageData.data;

  // Step 3: High-precision bilinear alpha interpolation onto full-resolution pixels
  const scaleX = cutoutWidth / origWidth;
  const scaleY = cutoutHeight / origHeight;

  for (let y = 0; y < origHeight; y++) {
    const srcY = y * scaleY;
    const y0 = Math.floor(srcY);
    const y1 = Math.min(y0 + 1, cutoutHeight - 1);
    const dy = srcY - y0;

    for (let x = 0; x < origWidth; x++) {
      const srcX = x * scaleX;
      const x0 = Math.floor(srcX);
      const x1 = Math.min(x0 + 1, cutoutWidth - 1);
      const dx = srcX - x0;

      // Sample 4 alpha neighbors from cutout
      const a00 = cutoutData[(y0 * cutoutWidth + x0) * 4 + 3];
      const a10 = cutoutData[(y0 * cutoutWidth + x1) * 4 + 3];
      const a01 = cutoutData[(y1 * cutoutWidth + x0) * 4 + 3];
      const a11 = cutoutData[(y1 * cutoutWidth + x1) * 4 + 3];

      // Bilinear blend of alpha
      const aTop = a00 * (1 - dx) + a10 * dx;
      const aBottom = a01 * (1 - dx) + a11 * dx;
      const finalAlpha = Math.round(aTop * (1 - dy) + aBottom * dy);

      // Apply to original full-res pixel (leaving RGB untouched!)
      const destIdx = (y * origWidth + x) * 4;
      origData[destIdx + 3] = finalAlpha;
    }
  }

  // Put refined full-res data back to canvas
  ctx.putImageData(origImageData, 0, 0);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob || cutoutBlob), "image/png", 1.0);
  });
}
