// Shared helpers for the browser (e2e) tests. Uses Puppeteer, which is already a devDependency.
import fs from 'node:fs';
import path from 'node:path';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Opens a page with cookie consent set to "essential" (no banner, no analytics) and collects console errors. */
export async function openPage(ctx, route, { width = 1280, height = 900, beforeLoad } = {}) {
  const page = await ctx.browser.newPage();
  await page.setViewport({ width, height });
  if (beforeLoad) await page.evaluateOnNewDocument(beforeLoad);
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

/** The Content-Security-Policy that public/_headers sends for every page (/*). */
export function productionCsp() {
  const file = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '..', 'public', '_headers');
  const match = fs.readFileSync(file, 'utf8').match(/^\s*Content-Security-Policy:\s*(.+)$/m);
  if (!match) throw new Error('No Content-Security-Policy in public/_headers');
  return match[1].trim();
}

/**
 * Opens a page with the production CSP added to HTML responses (astro preview ignores _headers).
 * `stubs` maps external URL prefixes to local responses, so no request leaves the machine.
 * Collected CSP violations are in page.cspViolations.
 */
export async function openPageWithCsp(ctx, route, stubs = {}) {
  const csp = productionCsp();
  const page = await ctx.browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('nx_cookie_consent', 'essential');
    } catch {
      /* storage blocked */
    }
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.effectiveDirective} ${e.blockedURI}`));
  });
  // A document from the cache or the site's service worker would skip the interception below
  // and arrive without the CSP
  await page.setCacheEnabled(false);
  await page.setBypassServiceWorker(true);
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    const url = req.url();
    const stub = Object.keys(stubs).find((prefix) => url.startsWith(prefix));
    if (stub) return req.respond(stubs[stub]);
    if (req.resourceType() === 'document' && url.startsWith(ctx.base)) {
      const res = await fetch(url);
      const headers = Object.fromEntries(res.headers);
      headers['content-security-policy'] = csp;
      return req.respond({ status: res.status, headers, body: Buffer.from(await res.arrayBuffer()) });
    }
    return req.continue();
  });
  await page.goto(ctx.base + route, { waitUntil: 'networkidle2' });
  page.cspViolations = () => page.evaluate(() => window.__csp);
  return page;
}

/** Writes a generated fixture into the run's temp folder and returns its path. */
export function writeFixture(ctx, name, bytes) {
  const file = path.join(ctx.downloadDir, 'fixture-' + name);
  fs.writeFileSync(file, bytes);
  return file;
}
