import assert from 'node:assert/strict';
import { openPage, sleep } from './helpers.mjs';

async function build(page, url) {
  await page.$eval('#param-url', (el) => (el.value = ''));
  await page.type('#param-url', url);
  await sleep(150);
  return page.evaluate(() => {
    const err = document.getElementById('param-url-error');
    return {
      result: document.getElementById('result-url').value,
      copyDisabled: document.getElementById('copy-btn').disabled,
      error: err && !err.hidden ? err.textContent.trim() : '',
      invalid: document.getElementById('param-url').getAttribute('aria-invalid'),
    };
  });
}

export const tests = [
  {
    name: 'Builds valid URLs and keeps existing query and fragment',
    async run(ctx) {
      const page = await openPage(ctx, '/tools/utm-builder/');
      await page.type('#param-source', 'newsletter');
      await page.type('#param-medium', 'email');

      let r = await build(page, 'https://example.com/page?ref=a#top');
      assert.equal(r.result, 'https://example.com/page?ref=a&utm_source=newsletter&utm_medium=email#top');
      assert.equal(r.error, '');

      r = await build(page, 'example.com');
      assert.equal(r.result, 'https://example.com/?utm_source=newsletter&utm_medium=email', 'adds https:// when no scheme');

      r = await build(page, 'httpbin.org/get');
      assert.equal(r.result, 'https://httpbin.org/get?utm_source=newsletter&utm_medium=email', 'a host starting with "http" still gets https://');
      await page.close();
    },
  },
  {
    name: 'Shows an inline error and no result for invalid URLs',
    async run(ctx) {
      const page = await openPage(ctx, '/tools/utm-builder/');
      await page.type('#param-source', 'newsletter');
      for (const bad of ['not a url', 'ftp://example.com', 'https://nodot']) {
        const r = await build(page, bad);
        assert.equal(r.result, '', `no result for "${bad}" (got "${r.result}")`);
        assert.ok(r.error.length > 0, `inline error for "${bad}"`);
        assert.equal(r.invalid, 'true', `aria-invalid for "${bad}"`);
        assert.equal(r.copyDisabled, true, `copy disabled for "${bad}"`);
      }
      const ok = await build(page, 'https://example.com');
      assert.equal(ok.error, '', 'error clears once the URL is valid');
      assert.equal(ok.invalid, null);
      await page.close();
    },
  },
];
