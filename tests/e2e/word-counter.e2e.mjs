import assert from 'node:assert/strict';
import { openPage, sleep } from './helpers.mjs';

const stat = (page, id) => page.$eval('#' + id, (el) => el.textContent.trim());

export const tests = [
  {
    name: 'Counts words, characters, sentences and paragraphs',
    async run(ctx) {
      const page = await openPage(ctx, '/tools/word-counter/');
      await page.type('#analyzer-input', 'The quick brown fox. Jumps over!\n\nSecond para here.');
      await sleep(300);
      assert.equal(await stat(page, 'word-count'), '9');
      assert.equal(await stat(page, 'char-count'), '51');
      assert.equal(await stat(page, 'sentence-count'), '3');
      assert.equal(await stat(page, 'paragraph-count'), '2');
      await page.close();
    },
  },
];
