/**
 * NumanX Tools Hub — Shared Image Format Engine
 * Canonical browser-native image conversion engine for JPG, PNG, WebP, and SVG.
 */

import type { ConversionOptions, ConversionResult, TargetFormat } from './types';
import { getMimeForTarget, getExtensionForTarget, sanitizeSvg, sanitizeFilename } from './validation';

/**
 * Converts bytes into a clean, human-readable string (B, KB, MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/**
 * Calculates percentage savings between original and converted size.
 */
export function calculateSavings(
  origSize: number,
  newSize: number,
): { percent: number; isReduction: boolean } {
  if (origSize <= 0) return { percent: 0, isReduction: false };
  const percent = Math.round((1 - newSize / origSize) * 100);
  return {
    percent: Math.abs(percent),
    isReduction: percent >= 0,
  };
}

/**
 * Generates the standardized output filename for converted images.
 * Sanitizes input filename to prevent attribute boundary escape or path traversal.
 */
export function getOutputFilename(originalName = 'image', targetFormat: TargetFormat): string {
  const safeName = sanitizeFilename(originalName);
  let base = safeName.replace(/\.[^.]+$/, '') || 'image';
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(base)) {
    base = `${base}_converted`;
  }
  if (base.length > 120) {
    base = base.slice(0, 120);
  }
  const ext = getExtensionForTarget(targetFormat);
  return `${base}${ext}`;
}

/**
 * Triggers a download in the browser for a given Object URL or Blob.
 */
export function downloadFile(source: string | Blob, filename: string): void {
  if (typeof document === 'undefined') return;

  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // If we created a temporary URL for a Blob, revoke it after triggering
  if (typeof source !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Sequentially triggers downloads for a batch of files with a staggered delay
 * to ensure all browser downloads are accepted cleanly without browser blocking.
 */
export async function downloadBatch(
  files: { url: string; filename: string }[],
  delayMs = 400,
): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    downloadFile(file.url, file.filename);
    if (i < files.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Converts an image (File, Blob, or SVG string) into the target format.
 * Utilizes native HTML5 Canvas APIs, enforces proper color fills for non-alpha formats,
 * and handles automatic cleanup of temporary resource handles.
 */
export function convertImage(
  input: File | Blob | string,
  options: ConversionOptions,
  fileName?: string,
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return reject(new Error('Image conversion requires a browser DOM environment.'));
    }

    const { targetFormat, quality = 0.92, backgroundColor = '#FFFFFF' } = options;

    let sourceUrl = '';
    let svgWidth: number | undefined;
    let svgHeight: number | undefined;

    try {
      if (typeof input === 'string') {
        const { safeSvg, width, height } = sanitizeSvg(input);
        svgWidth = width;
        svgHeight = height;
        const blob = new Blob([safeSvg], { type: 'image/svg+xml;charset=utf-8' });
        sourceUrl = URL.createObjectURL(blob);
      } else {
        sourceUrl = URL.createObjectURL(input);
      }
    } catch (err: any) {
      return reject(new Error(`Failed to prepare image source: ${err.message}`));
    }

    const img = new Image();

    img.onload = () => {
      // Immediate cleanup of temporary source object URL
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }

      try {
        const canvas = document.createElement('canvas');
        const targetWidth = options.width || svgWidth || img.naturalWidth || img.width || 500;
        const targetHeight = options.height || svgHeight || img.naturalHeight || img.height || 500;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to acquire 2D canvas rendering context.'));
        }

        // Apply background fill for formats without transparency (e.g. JPEG)
        if (targetFormat === 'jpeg') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        } else {
          ctx.clearRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const mimeType = getMimeForTarget(targetFormat);
        const extension = getExtensionForTarget(targetFormat);
        const resolvedName = getOutputFilename(
          fileName || (typeof input !== 'string' && 'name' in input ? (input as File).name : 'converted'),
          targetFormat,
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas blob generation failed.'));
            }

            const objectUrl = URL.createObjectURL(blob);
            const origSize = input instanceof Blob ? input.size : 0;
            const savings = origSize > 0 ? calculateSavings(origSize, blob.size) : { percent: 0, isReduction: false };
            const savingsPercent = savings.isReduction ? savings.percent : -savings.percent;

            resolve({
              blob,
              objectUrl,
              mimeType,
              extension,
              width: targetWidth,
              height: targetHeight,
              size: blob.size,
              name: resolvedName,
              filename: resolvedName,
              savingsPercent,
              revoke: () => URL.revokeObjectURL(objectUrl),
            });
          },
          mimeType,
          quality,
        );
      } catch (err: any) {
        reject(new Error(`Canvas conversion processing error: ${err.message}`));
      }
    };

    img.onerror = () => {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }
      reject(new Error('Failed to decode image data. The file may be corrupt or an unsupported variant.'));
    };

    img.src = sourceUrl;
  });
}
