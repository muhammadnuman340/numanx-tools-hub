import assert from 'node:assert/strict';
import sharp from 'sharp';
import { captureDownload, openPage, sleep, writeFixture } from './helpers.mjs';

const dims = (page) => page.evaluate(() => [document.getElementById('resize-width').value, document.getElementById('resize-height').value].join('x'));

export const tests = [
  {
    name: 'Keeps the image aspect ratio (64x48 → 640x480)',
    async run(ctx) {
      const png = await sharp({ create: { width: 64, height: 48, channels: 3, background: { r: 200, g: 80, b: 40 } } }).png().toBuffer();
      const file = writeFixture(ctx, 'landscape.png', png);
      const page = await openPage(ctx, '/tools/image-resizer/');
      await (await page.$('#file-input')).uploadFile(file);
      await sleep(800);
      assert.equal(await dims(page), '64x48', 'fields show the uploaded size');

      await page.$eval('#resize-width', (el) => {
        el.value = '640';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      assert.equal(await dims(page), '640x480', 'height follows width with the lock on');

      const dl = await captureDownload(ctx, async () => {
        await page.evaluate(() => [...document.querySelectorAll('main button')].find((b) => b.offsetParent && /^resize/i.test(b.textContent.trim()))?.click());
        await sleep(1500);
        await page.evaluate(() => [...document.querySelectorAll('main a, main button')].find((e) => e.offsetParent && /download/i.test(e.textContent))?.click());
      });
      assert.ok(dl && dl.state === 'completed', 'download completed');
      const meta = await sharp(dl.bytes).metadata();
      assert.equal(`${meta.width}x${meta.height}`, '640x480');
      await page.close();
    },
  },
];
