import assert from 'node:assert/strict';
import { openPage, sleep } from './helpers.mjs';

const PAYLOAD = '<img src=x onerror="window.__x=1">';

async function send(page, text) {
  await page.$eval(
    '#chat-input',
    (el, v) => {
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    text,
  );
  await page.focus('#chat-input');
  await page.keyboard.press('Enter');
  await sleep(1000);
}

export const tests = [
  {
    name: 'Command output and links cannot inject HTML or javascript: URLs',
    async run(ctx) {
      const page = await openPage(ctx, '/tools/ai-chat/', { beforeLoad: () => localStorage.setItem('nt_name_asked', '1') });
      await send(page, 'lowercase ' + PAYLOAD);
      await send(page, 'base64 decode ' + Buffer.from(PAYLOAD).toString('base64'));
      await send(page, '[click me](javascript:window.__y=1)');
      const r = await page.evaluate(() => ({
        fired: window.__x || 0,
        imgs: document.querySelectorAll('.chat-msg img[src="x"]').length,
        jsLinks: document.querySelectorAll('.chat-msg a[href^="javascript:" i]').length,
      }));
      assert.deepEqual(r, { fired: 0, imgs: 0, jsLinks: 0 });
      await page.close();
    },
  },
  {
    name: 'Normal links and special characters still display correctly',
    async run(ctx) {
      const page = await openPage(ctx, '/tools/ai-chat/', { beforeLoad: () => localStorage.setItem('nt_name_asked', '1') });
      await send(page, 'Tom & Jerry [NumanX](https://toolshub.numanxstudio.com/)');
      const r = await page.evaluate(() => {
        const msgs = [...document.querySelectorAll('.chat-msg[data-role="user"]')];
        const last = msgs[msgs.length - 1];
        return { text: last?.innerText || '', href: last?.querySelector('a')?.getAttribute('href') || '' };
      });
      assert.match(r.text, /Tom & Jerry/, `user text shown as typed (got "${r.text.slice(0, 80)}")`);
      assert.equal(r.href, 'https://toolshub.numanxstudio.com/');
      await page.close();
    },
  },
];
