import assert from 'node:assert/strict';
import { openPage, sleep } from './helpers.mjs';

const shown = (page) => page.$eval('#password-display', (el) => el.textContent.trim());

export const tests = [
  {
    name: 'Generate button creates a new password on every click',
    async run(ctx) {
      const page = await openPage(ctx, '/tools/password-generator/');
      const seen = new Set([await shown(page)]);
      for (let i = 0; i < 3; i++) {
        await page.click('#generate-btn');
        await sleep(100);
        seen.add(await shown(page));
      }
      assert.equal(seen.size, 4, `expected 4 different passwords, got ${seen.size}`);
      assert.deepEqual(page.errors, []);
      await page.close();
    },
  },
];
