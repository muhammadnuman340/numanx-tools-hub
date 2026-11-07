import assert from 'node:assert/strict';
import { openPage, sleep } from './helpers.mjs';

export const tests = [
  {
    name: 'Preview allows only web/mail links and images, never javascript:',
    async run(ctx) {
      const page = await openPage(ctx, '/tools/markdown-editor/', { beforeLoad: () => localStorage.removeItem('nt_md_content') });
      const md = '[bad](javascript:window.__y=1) ![pic](javascript:window.__z=1) [good](https://example.com/) [mail](mailto:hi@example.com)';
      await page.$eval(
        '#md-input',
        (el, v) => {
          el.value = v;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        },
        md,
      );
      await sleep(600);
      const r = await page.evaluate(() => {
        const p = document.getElementById('md-preview');
        return {
          jsHrefs: p.querySelectorAll('a[href^="javascript:" i]').length,
          jsImgs: p.querySelectorAll('img[src^="javascript:" i]').length,
          hrefs: [...p.querySelectorAll('a')].map((a) => a.getAttribute('href')),
        };
      });
      assert.equal(r.jsHrefs, 0, 'no javascript: links');
      assert.equal(r.jsImgs, 0, 'no javascript: images');
      assert.ok(r.hrefs.includes('https://example.com/'), 'https link kept');
      assert.ok(r.hrefs.includes('mailto:hi@example.com'), 'mailto link kept');
      await page.close();
    },
  },
];
