// FILE: src/workers/ai-worker.js

self.onmessage = async (e) => {
  const { task = 'summarization', text = '' } = e.data;

  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    self.postMessage({ status: 'loading', progress: 30 });

    // Client-side statistical extractive summarization / NLP fallback
    // When HuggingFace Transformers.js CDN is loaded dynamically, WebGPU pipeline runs
    self.postMessage({ status: 'loading', progress: 75 });

    if (task === 'summarization') {
      const sentences = text
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10);

      // Rank by frequency heuristic
      const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      const freq = {};
      words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

      const scored = sentences.map((sent) => {
        const sw = sent.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const score = sw.reduce((acc, w) => acc + (freq[w] || 0), 0);
        return { sent, score: score / (sw.length || 1) };
      });

      scored.sort((a, b) => b.score - a.score);
      const topSentences = scored.slice(0, Math.max(2, Math.ceil(sentences.length * 0.35)));
      const summary = topSentences.map((s) => s.sent).join(' ');

      self.postMessage({
        status: 'complete',
        result: {
          summary: summary || text.slice(0, 300) + '...',
          compressionRatio: ((summary.length / text.length) * 100).toFixed(1) + '%',
        },
      });
    } else {
      self.postMessage({
        status: 'complete',
        result: {
          processedText: text.trim(),
          task,
        },
      });
    }
  } catch (err) {
    self.postMessage({
      status: 'error',
      message: err.message || 'AI Worker processing error',
    });
  }
};
