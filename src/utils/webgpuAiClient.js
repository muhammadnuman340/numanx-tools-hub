// FILE: src/utils/webgpuAiClient.js

/**
 * Probes the client browser and hardware for WebGPU acceleration capabilities.
 * @returns {Promise<{ supported: boolean, label: string }>}
 */
export async function probeWebGPUCapability() {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
    return { supported: false, label: 'Fast Statistical NLP (WebGPU Unavailable)' };
  }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return { supported: false, label: 'Fast Statistical NLP (No GPU Adapter)' };
    }
    return {
      supported: true,
      label: 'WebGPU Hardware Acceleration Ready (4-Bit Quantized Neural Mode)'
    };
  } catch {
    return { supported: false, label: 'Fast Statistical NLP Fallback' };
  }
}

/**
 * Executes on-device quantized neural inference inside a Web Worker.
 * @param {Object} params - task, model, text, onProgress
 * @returns {Promise<any>}
 */
export function runLocalNeuralTask({ task = 'summarization', model = 'Xenova/distilbart-cnn-6-6', text, onProgress }) {
  return new Promise((resolve, reject) => {
    if (typeof Worker === 'undefined') {
      return reject(new Error('Web Workers not supported in this environment'));
    }
    const worker = new Worker(new URL('../workers/ai-worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      if (e.data.status === 'loading' && onProgress) {
        onProgress(e.data.progress);
      } else if (e.data.status === 'complete') {
        worker.terminate();
        resolve(e.data.result);
      } else if (e.data.status === 'error') {
        worker.terminate();
        reject(new Error(e.data.message));
      }
    };
    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };
    worker.postMessage({ task, model, text });
  });
}
