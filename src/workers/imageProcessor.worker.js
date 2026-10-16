// FILE: src/workers/imageProcessor.worker.js

self.onmessage = async (e) => {
  try {
    const {
      file,
      format = 'image/webp',
      quality = 0.85,
      maxWidth,
      maxHeight,
    } = e.data;

    if (!file) {
      throw new Error('No image file provided to worker');
    }

    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    if (maxWidth && width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (maxHeight && height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await canvas.convertToBlob({
      type: format,
      quality: Number(quality),
    });

    self.postMessage({
      status: 'success',
      blob,
      width,
      height,
      originalSize: file.size || 0,
      newSize: blob.size,
      format,
    });
  } catch (err) {
    self.postMessage({
      status: 'error',
      message: err.message || 'Worker processing error',
    });
  }
};
