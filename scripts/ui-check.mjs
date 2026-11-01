#!/usr/bin/env node
/**
 * UI check — measures the DESIGN.md / UI-plan targets on every page.
 *
 * Usage:
 *   npm run build && npm run preview          # in one terminal (http://localhost:4321)
 *   npm run ui:check                          # all sitemap pages against localhost
 *   npm run ui:check -- --base https://toolshub.numanxstudio.com
 *   npm run ui:check -- --only /tools/ --limit 10
 *   npm run ui:check -- --baseline audit-reports/ui-check/baseline.json
 *
 * Writes audit-reports/ui-check/report-<timestamp>.json and .md (git-ignored),
 * plus screenshots of the key pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = arg('base', 'http://localhost:4321').replace(/\/$/, '');
const ONLY = arg('only', '');
const LIMIT = Number(arg('limit', '0'));
const OUT = arg('out', 'audit-reports/ui-check');
const BASELINE = arg('baseline', '');
const CONCURRENCY = Number(arg('concurrency', '3'));
const KEY_PAGES = [
  '/',
  '/tools/',
  '/category/image-tools/',
  '/tools/image-compressor/',
  '/tools/net-run-rate-calculator/',
];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: 'mobile', width: 375, height: 812, isMobile: true, hasTouch: true },
];

// Targets from docs/NUMANX-UI-IMPLEMENTATION-PLAN-2026.md (Tracking table)
const TARGETS = {
  overflowPx: { max: 0, label: 'Extra layout width on phone (px)' },
  firstInputTopDesktop: { max: 300, label: 'First input/dropzone top, desktop (px)', toolsOnly: true },
  firstInputTopMobile: { max: 812, label: 'First input/dropzone top, phone (px)', toolsOnly: true },
  pageHeightDesktop: { max: 4500, label: 'Tool page height, desktop (px)', toolsOnly: true },
  cookieBarHeight: { max: 96, label: 'Cookie bar height, desktop (px)' },
  fixedButtons: { max: 1, label: 'Floating buttons visible' },
  blurInView: { max: 2, label: 'Blurred layers in first viewport' },
  smallTargets: { max: 0, label: 'Tap targets under 24px' },
  unnamedButtons: { max: 0, label: 'Buttons without an accessible name' },
  unlabeledFields: { max: 0, label: 'Form fields without a label' },
  liveRegions: { min: 1, label: 'Status regions (aria-live)', toolsOnly: true },
  hiddenBlocks: { max: 0, label: 'Large blocks invisible after load' },
  hiddenBlocksReduced: { max: 0, label: 'Large blocks invisible with reduced motion' },
  lowContrast: { max: 0, label: 'Text elements below WCAG AA contrast' },
  faqMismatch: { max: 0, label: 'FAQ schema questions not visible on page' },
};

async function getUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Could not read ${BASE}/sitemap.xml (${res.status})`);
  const xml = await res.text();
  let paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (ONLY) paths = paths.filter((p) => p.startsWith(ONLY));
  if (LIMIT) paths = paths.slice(0, LIMIT);
  return paths;
}

/** Runs inside the page. Returns raw measurements for one viewport. */
function measure() {
  /**
   * Runs inside the page: content blocks (with real text, in normal flow) left invisible after load,
   * e.g. by scroll-reveal animations. Hover overlays and positioned decorations are ignored.
   */
  function countHiddenContent() {
    return [...document.querySelectorAll('main *')].filter((el) => {
      const s = getComputedStyle(el);
      if (s.position === 'absolute' || s.position === 'fixed') return false;
      if (Number(s.opacity) >= 0.05) return false;
      const r = el.getBoundingClientRect();
      if (r.height < 60 || r.width < 100) return false;
      if ((el.textContent || '').trim().length < 20) return false;
      // count the outermost hidden block only
      const parent = el.parentElement;
      return !(parent && Number(getComputedStyle(parent).opacity) < 0.05);
    }).length;
  }

  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const visible = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05 && r.width > 0 && r.height > 0;
  };
  const nameOf = (el) =>
    (el.getAttribute('aria-label') || '').trim() ||
    (el.getAttribute('aria-labelledby') &&
      document.getElementById(el.getAttribute('aria-labelledby'))?.textContent.trim()) ||
    (el.getAttribute('title') || '').trim() ||
    el.textContent.trim();

  // Width: on phones the layout viewport grows when content overflows
  const overflowPx = Math.max(0, window.innerWidth - vw, document.documentElement.scrollWidth - vw);

  // Highest (smallest top) visible input or dropzone in main — DOM order isn't visual order
  const inputTops = [
    ...document.querySelectorAll(
      'main input:not([type=hidden]), main textarea, main select, main [data-dropzone], main [id*="drop-zone"], main [id*="dropzone"]',
    ),
  ]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.width > 0 && getComputedStyle(el).visibility !== 'hidden';
    })
    .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  const firstInputTop = inputTops.length ? Math.min(...inputTops) : null;

  const all = [...document.querySelectorAll('body *')];
  const blurInView = all.filter((el) => {
    const s = getComputedStyle(el);
    if (!s.backdropFilter || s.backdropFilter === 'none') return false;
    const r = el.getBoundingClientRect();
    return visible(el) && r.top < vh && r.bottom > 0;
  }).length;

  const interactive = [
    ...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea'),
  ].filter(visible);
  // WCAG 2.5.8: links inside running text (incl. table cells) are exempt; visually hidden elements
  // (skip link, sr-only inputs) aren't targets until shown; a checkbox/radio counts its clickable label.
  const smallTargets = interactive.filter((el) => {
    let r = el.getBoundingClientRect();
    if (r.width <= 1 && r.height <= 1) return false;
    const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p, li, td, th');
    if (inline) return false;
    if (el.type === 'checkbox' || el.type === 'radio') {
      const label = el.closest('label') || (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
      if (label) r = label.getBoundingClientRect();
    }
    return r.width < 24 || r.height < 24;
  }).length;

  const unnamedButtons = [...document.querySelectorAll('button, [role=button]')].filter(
    (b) => visible(b) && !nameOf(b),
  ).length;

  const unlabeledFields = [
    ...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea'),
  ].filter((f) => {
    if (!visible(f) && f.type !== 'file') return false;
    if (f.getAttribute('aria-label') || f.getAttribute('aria-labelledby') || f.closest('label')) return false;
    return !(f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`));
  }).length;

  const liveRegions = document.querySelectorAll('[aria-live], [role=status], [role=alert]').length;

  const hiddenBlocks = countHiddenContent();

  const fixedButtons = all.filter((el) => {
    if (!['BUTTON', 'A'].includes(el.tagName)) return false;
    const box = el.closest('[class*="fixed"], [style*="fixed"]') || el;
    if (getComputedStyle(box).position !== 'fixed' && getComputedStyle(el).position !== 'fixed') return false;
    if (el.closest('#cookie-consent-banner, header, [role=dialog], #global-search-modal')) return false;
    return visible(el) && el.getBoundingClientRect().width < 120;
  }).length;

  const banner = document.getElementById('cookie-consent-banner');
  const cookieBarHeight = banner && visible(banner) ? Math.round(banner.getBoundingClientRect().height) : null;

  // Contrast of text against the first opaque background behind it
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1]
      .split(/[ ,/]+/)
      .filter(Boolean)
      .map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const L = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const bgOf = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.9) return c;
    }
    return parse(getComputedStyle(document.body).backgroundColor) || { r: 10, g: 10, b: 11, a: 1 };
  };
  const lowContrastSamples = [];
  let lowContrast = 0;
  for (const el of document.querySelectorAll(
    'main p, main li, main span, main a, main label, main h1, main h2, main h3, main td, footer a, footer p',
  )) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own || !visible(el)) continue;
    const s = getComputedStyle(el);
    if (s.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || s.color === 'rgba(0, 0, 0, 0)') continue; // gradient text: skipped
    const fg = parse(s.color);
    if (!fg) continue;
    const bg = bgOf(el);
    const ratio = (Math.max(L(fg), L(bg)) + 0.05) / (Math.min(L(fg), L(bg)) + 0.05);
    const size = parseFloat(s.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
    if (ratio < (large ? 3 : 4.5)) {
      lowContrast++;
      if (lowContrastSamples.length < 3)
        lowContrastSamples.push(`${el.textContent.trim().slice(0, 30)} (${ratio.toFixed(2)}:1)`);
    }
  }

  // FAQ schema vs visible text
  const text = document.body.innerText.replace(/\s+/g, ' ').toLowerCase();
  let faqMismatch = 0;
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const j = JSON.parse(s.textContent);
      for (const n of j['@graph'] || [j]) {
        if (n['@type'] !== 'FAQPage') continue;
        for (const q of n.mainEntity || []) {
          const name = String(q.name || '')
            .replace(/\s+/g, ' ')
            .toLowerCase();
          if (!name || !text.includes(name)) faqMismatch++;
        }
      }
    } catch {}
  }

  return {
    overflowPx,
    firstInputTop,
    pageHeight: document.documentElement.scrollHeight,
    blurInView,
    smallTargets,
    unnamedButtons,
    unlabeledFields,
    liveRegions,
    hiddenBlocks,
    fixedButtons,
    cookieBarHeight,
    lowContrast,
    lowContrastSamples,
    faqMismatch,
  };
}

async function checkPage(browser, p, shotsDir) {
  const result = { path: p };
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    try {
      await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
      await new Promise((r) => setTimeout(r, 2000));
      result[vp.name] = await page.evaluate(measure);
      if (KEY_PAGES.includes(p)) {
        const name = (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '_')) + `-${vp.name}.png`;
        await page.screenshot({ path: path.join(shotsDir, name) });
      }
    } catch (e) {
      result[vp.name] = { error: e.message };
    }
    await page.close();
  }
  // Reduced motion: do animations leave content invisible?
  const rm = await browser.newPage();
  await rm.setViewport(VIEWPORTS[0]);
  await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  try {
    await rm.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000));
    result.hiddenBlocksReduced = (await rm.evaluate(measure)).hiddenBlocks;
  } catch {
    result.hiddenBlocksReduced = null;
  }
  await rm.close();
  return result;
}

function metricValues(r) {
  const d = r.desktop || {};
  const m = r.mobile || {};
  return {
    overflowPx: m.overflowPx,
    firstInputTopDesktop: d.firstInputTop,
    firstInputTopMobile: m.firstInputTop,
    pageHeightDesktop: d.pageHeight,
    cookieBarHeight: d.cookieBarHeight,
    fixedButtons: Math.max(d.fixedButtons ?? 0, m.fixedButtons ?? 0),
    blurInView: Math.max(d.blurInView ?? 0, m.blurInView ?? 0),
    smallTargets: m.smallTargets,
    unnamedButtons: d.unnamedButtons,
    unlabeledFields: d.unlabeledFields,
    liveRegions: d.liveRegions,
    hiddenBlocks: d.hiddenBlocks,
    hiddenBlocksReduced: r.hiddenBlocksReduced,
    lowContrast: d.lowContrast,
    faqMismatch: d.faqMismatch,
  };
}

function summarise(results) {
  const rows = [];
  for (const [key, t] of Object.entries(TARGETS)) {
    const scoped = results.filter((r) => !t.toolsOnly || /^\/tools\/[^/]+\/$/.test(r.path));
    const vals = scoped
      .map((r) => ({ path: r.path, v: metricValues(r)[key] }))
      .filter((x) => x.v !== null && x.v !== undefined);
    const failing = vals.filter((x) => (t.max !== undefined ? x.v > t.max : x.v < t.min));
    const worst = [...vals].sort((a, b) => (t.max !== undefined ? b.v - a.v : a.v - b.v))[0];
    rows.push({
      key,
      label: t.label,
      target: t.max !== undefined ? `≤ ${t.max}` : `≥ ${t.min}`,
      pages: vals.length,
      failing: failing.length,
      worst: worst ? `${worst.v} (${worst.path})` : '—',
      failingPaths: failing.slice(0, 10).map((x) => x.path),
    });
  }
  return rows;
}

async function main() {
  const urls = await getUrls();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const shotsDir = path.join(OUT, `shots-${stamp}`);
  fs.mkdirSync(shotsDir, { recursive: true });
  console.log(`UI check: ${urls.length} pages on ${BASE}`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < urls.length) {
        const p = urls[next++];
        const r = await checkPage(browser, p, shotsDir);
        results.push(r);
        process.stdout.write(`  ${results.length}/${urls.length} ${p}\n`);
      }
    }),
  );
  await browser.close();
  results.sort((a, b) => a.path.localeCompare(b.path));

  const summary = summarise(results);
  let baseline = null;
  if (BASELINE && fs.existsSync(BASELINE)) baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const before = baseline ? Object.fromEntries(baseline.summary.map((s) => [s.key, s.failing])) : {};

  const md = [
    `# UI check — ${BASE}`,
    '',
    `${new Date().toISOString()} · ${results.length} pages · desktop 1440×900, phone 375×812`,
    '',
    `| Check | Target | Pages failing${baseline ? ' (before → now)' : ''} | Worst |`,
    '|---|---|---|---|',
    ...summary.map(
      (s) =>
        `| ${s.label} | ${s.target} | ${baseline && before[s.key] !== undefined ? `${before[s.key]} → ` : ''}${s.failing} / ${s.pages} | ${s.worst} |`,
    ),
    '',
    '## Failing pages (first 10 per check)',
    '',
    ...summary.filter((s) => s.failing).map((s) => `- **${s.label}:** ${s.failingPaths.join(', ')}`),
    '',
  ].join('\n');

  const jsonPath = path.join(OUT, `report-${stamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify({ base: BASE, date: new Date().toISOString(), summary, results }, null, 1));
  fs.writeFileSync(path.join(OUT, `report-${stamp}.md`), md);
  console.log('\n' + md);
  console.log(`Saved ${jsonPath} and screenshots in ${shotsDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
