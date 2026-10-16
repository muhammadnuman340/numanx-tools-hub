// FILE: src/workers/ai-worker.js — Dual-Engine Statistical NLP + On-Demand WebGPU Neural Engine

let pipeline = null;
let env = null;
const pipelines = {};

async function loadTransformers() {
  if (pipeline) return { pipeline, env };
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3');
    pipeline = mod.pipeline;
    env = mod.env;
    if (env) env.allowLocalModels = false;
    return { pipeline, env };
  } catch (err) {
    return { pipeline: null, env: null };
  }
}

self.addEventListener('message', async (event) => {
  const { task = 'summarization', model = 'Xenova/distilbart-cnn-6-6', text = '', maxLen = 120 } = event.data;

  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    self.postMessage({ status: 'loading', progress: 20 });

    // Try loading on-demand WebGPU pipeline
    const { pipeline: hfPipeline } = await loadTransformers();

    if (hfPipeline && typeof navigator !== 'undefined' && navigator.gpu) {
      if (!pipelines[task]) {
        self.postMessage({ status: 'loading', progress: 40 });
        pipelines[task] = await hfPipeline(task, model, {
          device: 'webgpu',
          dtype: 'q4',
          progress_callback: (p) => self.postMessage({ status: 'loading', progress: Math.round(40 + (p?.progress || 0) * 0.5) })
        });
      }

      const runner = pipelines[task];
      const result = await runner(text, { max_new_tokens: maxLen });
      self.postMessage({ status: 'complete', engine: 'webgpu', result });
      return;
    }

    // High-Speed Statistical NLP Fallback (0.1s Extractive TF-IDF + Sentence Scoring)
    self.postMessage({ status: 'loading', progress: 70 });

    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const freq = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

    const scored = sentences.map((sent) => {
      const sw = sent.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      const score = sw.reduce((acc, w) => acc + (freq[w] || 0), 0);
      return { sent, score: score / (sw.length || 1) };
    });

    scored.sort((a, b) => b.score - a.score);
    const topCount = Math.max(2, Math.ceil(sentences.length * 0.35));
    const topSentences = scored.slice(0, topCount);
    const summary = topSentences.map((s) => s.sent).join(' ');

    self.postMessage({
      status: 'complete',
      engine: 'statistical-nlp',
      result: [{ summary_text: summary || text.slice(0, 300) + '...' }],
      metrics: {
        originalWords: words.length,
        summaryWords: (summary.match(/\b\w+\b/g) || []).length,
        compressionRatio: (((text.length - summary.length) / Math.max(1, text.length)) * 100).toFixed(1) + '%'
      }
    });
  } catch (err) {
    self.postMessage({ status: 'error', message: err.message || 'Worker processing error' });
  }
});
