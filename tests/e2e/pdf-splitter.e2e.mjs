import assert from 'node:assert/strict';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { captureDownload, openPage, sleep, writeFixture } from './helpers.mjs';

// A realistic document: several pages of text with an embedded font.
async function twoPagePdf() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let p = 1; p <= 2; p++) {
    const page = doc.addPage([595, 842]);
    for (let line = 0; line < 50; line++) page.drawText(`Page ${p}, line ${line + 1}: the quick brown fox jumps over the lazy dog`, { x: 40, y: 800 - line * 15, size: 10, font });
  }
  return doc.save();
}

export const tests = [
  {
    name: 'Split a page range downloads a PDF with those pages',
    async run(ctx) {
      const file = writeFixture(ctx, 'two-pages.pdf', await twoPagePdf());
      // Record when blob links are clicked and when their URLs are revoked.
      // Revoking right after click() can cancel the download (seen in 2.3), so it must wait.
      const page = await openPage(ctx, '/tools/pdf-splitter/', {
        beforeLoad: () => {
          window.__blobLog = [];
          const click = HTMLAnchorElement.prototype.click;
          HTMLAnchorElement.prototype.click = function () {
            if (this.href.startsWith('blob:')) window.__blobLog.push({ type: 'click', url: this.href, t: performance.now() });
            return click.call(this);
          };
          const revoke = URL.revokeObjectURL;
          URL.revokeObjectURL = (url) => {
            window.__blobLog.push({ type: 'revoke', url, t: performance.now() });
            return revoke(url);
          };
        },
      });
      await (await page.$('#file-input')).uploadFile(file);
      await sleep(1200);
      await page.type('#page-ranges', '2');
      const dl = await captureDownload(ctx, () =>
        page.evaluate(() => [...document.querySelectorAll('main button')].find((b) => b.textContent.trim().startsWith('Split PDF'))?.click()),
      );
      assert.ok(dl, 'a download started');
      assert.equal(dl.state, 'completed', `download state was ${dl.state}`);
      assert.match(dl.name, /\.pdf$/);
      assert.equal((await PDFDocument.load(dl.bytes)).getPageCount(), 1);
      await sleep(1500);
      const log = await page.evaluate(() => window.__blobLog);
      const clicked = log.find((e) => e.type === 'click');
      const revoked = log.find((e) => e.type === 'revoke' && e.url === clicked?.url);
      assert.ok(clicked, 'download link clicked');
      if (revoked) assert.ok(revoked.t - clicked.t >= 500, `blob URL revoked ${Math.round(revoked.t - clicked.t)} ms after click (needs >= 500 ms)`);
      await page.close();
    },
  },
];
