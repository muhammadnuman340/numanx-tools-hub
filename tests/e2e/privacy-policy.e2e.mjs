import assert from 'node:assert/strict';
import { openPage } from './helpers.mjs';

export const tests = [
  {
    name: 'Privacy policy discloses Cloudflare Web Analytics and has no stale claims',
    async run(ctx) {
      const page = await openPage(ctx, '/privacy-policy/');
      const text = await page.$eval('main', (el) => el.innerText.replace(/\s+/g, ' '));
      assert.ok(
        text.includes(
          'We also use Cloudflare Web Analytics to count page views. It doesn’t use cookies or track you across other websites, and we only see aggregate statistics, not individual visitors.',
        ),
        'Cloudflare Web Analytics sentence is shown',
      );
      assert.ok(!text.includes('currently block its script'), 'no "blocked" claim');
      assert.ok(!text.includes('light/dark theme'), 'no theme in saved data (site is dark-only)');
      assert.ok(text.includes('Google Analytics Opt-In'), 'opt-in badge names Google Analytics');
      assert.ok(!/\bAnalytics Opt-In/.test(text.replaceAll('Google Analytics Opt-In', '')), 'no generic opt-in badge');
      await page.close();
    },
  },
];
