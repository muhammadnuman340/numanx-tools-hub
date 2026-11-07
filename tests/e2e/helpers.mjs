// Shared helpers for the browser (e2e) tests. Uses Puppeteer, which is already a devDependency.
import fs from 'node:fs';
import path from 'node:path';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Opens a page with cookie consent set to "essential" (no banner, no analytics) and collects console errors. */
export async function openPage(ctx, route, { width = 1280, height = 900 } = {}) {
  const page = await ctx.browser.newPage();
  await page.setViewport({ width, height });
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('nx_cookie_consent', 'essential');
    } catch {
      /* storage blocked */
    }
  });
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(String(e.message)));
  page.on('console', (m) => {
    if (m.type() === 'error') page.errors.push(m.text());
  });
  await page.goto(ctx.base + route, { waitUntil: 'networkidle2' });
  return page;
}

/** Sets a field's value and fires input + change, like a user typing. */
export async function setValue(page, selector, value) {
  await page.$eval(
    selector,
    (el, v) => {
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    value,
  );
}

/** Runs `action` and waits for the browser download it triggers. Returns { name, state, bytes } or null. */
export async function captureDownload(ctx, action, timeout = 10000) {
  const before = new Set(ctx.downloads.keys());
  await action();
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const [guid, d] of ctx.downloads) {
      if (before.has(guid)) continue;
      if (d.state === 'completed') return { name: d.name, state: d.state, bytes: fs.readFileSync(path.join(ctx.downloadDir, guid)) };
      if (d.state === 'canceled') return { name: d.name, state: d.state, bytes: null };
    }
    await sleep(150);
  }
  return null;
}

/** Writes a generated fixture into the run's temp folder and returns its path. */
export function writeFixture(ctx, name, bytes) {
  const file = path.join(ctx.downloadDir, 'fixture-' + name);
  fs.writeFileSync(file, bytes);
  return file;
}
