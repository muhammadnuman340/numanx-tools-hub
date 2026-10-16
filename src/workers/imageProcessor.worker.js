// FILE: src/workers/imageProcessor.worker.js
// Zero-Freeze 60 FPS OffscreenCanvas Worker + 'Compress JPG Extreme' (Pos 7.0 GSC Query) Support
self.addEventListener('message', async (event) => {
  const { file, mode = 'balanced', targetMime = 'image/webp', customQuality = 0.8, maxWidth = 0 } = event.data;
  try {
    const bitmap = await createImageBitmap(file);
    let width = bitmap.width;
    let height = bitmap.height;

    // Preset logic: 'extreme' targets GSC query 'compress jpg extreme' (Pos 7.0)
    const quality = mode === 'extreme' ? 0.52 : mode === 'lossless' ? 1.0 : customQuality;
    const effectiveMaxW = mode === 'extreme' && maxWidth === 0 ? Math.min(width, 1920) : maxWidth;

    if (effectiveMaxW > 0 && width > effectiveMaxW) {
      height = Math.round(height * (effectiveMaxW / width));
      width = effectiveMaxW;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d', { alpha: targetMime !== 'image/jpeg' });
    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const compressedBlob = await canvas.convertToBlob({ type: targetMime, quality });
    const savingsPct = (((file.size - compressedBlob.size) / file.size) * 100).toFixed(1);

    self.postMessage({
      status: 'success',
      blob: compressedBlob,
      originalBytes: file.size,
      compressedBytes: compressedBlob.size,
      savingsPct,
      dimensions: `${width}×${height}`
    });
  } catch (err) {
    self.postMessage({ status: 'error', message: err.message });
  }
});
