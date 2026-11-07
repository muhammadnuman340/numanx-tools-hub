import assert from 'node:assert/strict';
import { openPageWithCsp, sleep } from './helpers.mjs';

// Cloudflare Web Analytics: Cloudflare injects this beacon into real browser responses.
const stubs = {
  'https://static.cloudflareinsights.com/': { status: 200, contentType: 'application/javascript', body: '/* beacon stub */' },
  'https://cloudflareinsights.com/': { status: 204, headers: { 'access-control-allow-origin': '*' }, body: '' },
};

export const tests = [
  {
    name: 'Homepage has no CSP violations under the production policy',
    async run(ctx) {
      const page = await openPageWithCsp(ctx, '/', stubs);
      await sleep(500);
      assert.deepEqual(await page.cspViolations(), []);
      await page.close();
    },
  },
  {
    name: 'CSP allows the Cloudflare Web Analytics beacon and its reports',
    async run(ctx) {
      const page = await openPageWithCsp(ctx, '/', stubs);
      const result = await page.evaluate(async () => {
        const s = document.createElement('script');
        s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
        const script = await new Promise((r) => {
          s.onload = () => r('loaded');
          s.onerror = () => r('blocked');
          document.head.appendChild(s);
        });
        let report = 'sent';
        try {
          await fetch('https://cloudflareinsights.com/cdn-cgi/rum', { method: 'POST', body: '{}' });
        } catch {
          report = 'blocked';
        }
        return { script, report };
      });
      await sleep(300);
      const blocked = (await page.cspViolations()).filter((v) => v.includes('cloudflareinsights'));
      assert.deepEqual({ ...result, blocked }, { script: 'loaded', report: 'sent', blocked: [] });
      await page.close();
    },
  },
];
