// FILE: src/utils/imageWorkerClient.js

/**
 * Offloads heavy 4K image operations off the browser main thread via an OffscreenCanvas Web Worker.
 * Preserves the 60 FPS Three.js particle animation loop during batch operations.
 * @param {File|Blob} file - Target image
 * @param {Object} options - Quality, maxWidth, maxHeight, format
 * @returns {Promise<Object>} Processed result containing blob, dimensions, and compression ratio
 */
export function processImageInWorker(file, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') {
      const worker = new Worker(
        new URL('../workers/imageProcessor.worker.js', import.meta.url),
        { type: 'module' }
      );
      worker.onmessage = (event) => {
        worker.terminate();
        if (event.data.status === 'success') {
          resolve(event.data);
        } else {
          reject(new Error(event.data.message || 'Worker image processing failed'));
        }
      };
      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      };
      worker.postMessage({ file, ...options });
    } else {
      reject(new Error('OffscreenCanvas not supported in this browser; use main-thread canvas fallback.'));
    }
  });
}
