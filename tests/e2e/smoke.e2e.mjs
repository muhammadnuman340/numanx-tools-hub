import assert from 'node:assert/strict';
import { openPage } from './helpers.mjs';

export const tests = [
  {
    name: 'homepage loads without console errors',
    async run(ctx) {
      const page = await openPage(ctx, '/');
      const h1 = await page.$eval('h1', (el) => el.textContent.trim());
      assert.ok(h1.length > 0, 'homepage has an h1');
      assert.deepEqual(page.errors, [], 'no console errors');
      await page.close();
    },
  },
];
