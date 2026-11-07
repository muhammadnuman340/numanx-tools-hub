// Browser tests against the production build.
// Usage: npm run build && npm run test:e2e            (all *.e2e.mjs files)
//        npm run test:e2e -- password                 (only files whose name contains "password")
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const port = Number(process.env.E2E_PORT || 4399);
const base = `http://127.0.0.1:${port}`;
const filter = process.argv[2] || '';

if (!fs.existsSync(path.join(root, 'dist', 'index.html'))) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

const files = fs
  .readdirSync(here)
  .filter((f) => f.endsWith('.e2e.mjs') && f.includes(filter))
  .sort();

// Start `astro preview` and wait until it answers.
const preview = spawn(process.execPath, [path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'preview', '--port', String(port), '--host', '127.0.0.1'], {
  cwd: root,
  stdio: 'ignore',
});
const stopPreview = () => {
  if (!preview.killed) preview.kill();
};
process.on('exit', stopPreview);

let ready = false;
for (let i = 0; i < 60 && !ready; i++) {
  try {
    ready = (await fetch(base + '/')).ok;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}
if (!ready) {
  console.error(`Preview server did not start on ${base}`);
  process.exit(1);
}

const browser = await puppeteer.launch({ headless: true });
const downloadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nx-e2e-'));
const cdp = await browser.target().createCDPSession();
await cdp.send('Browser.setDownloadBehavior', { behavior: 'allowAndName', downloadPath: downloadDir, eventsEnabled: true });
const downloads = new Map();
cdp.on('Browser.downloadWillBegin', (e) => downloads.set(e.guid, { name: e.suggestedFilename, state: 'started' }));
cdp.on('Browser.downloadProgress', (e) => {
  const d = downloads.get(e.guid);
  if (d) d.state = e.state;
});
await cdp.send('Browser.grantPermissions', { origin: base, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] });
const ctx = { browser, base, downloads, downloadDir };

let passed = 0;
let failed = 0;
try {
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(here, file)).href);
    for (const t of mod.tests) {
      try {
        await t.run(ctx);
        passed++;
        console.log(`  PASS  ${file} › ${t.name}`);
      } catch (err) {
        failed++;
        console.log(`  FAIL  ${file} › ${t.name}\n        ${String(err.message).split('\n').join('\n        ')}`);
      }
    }
  }
} finally {
  await browser.close();
  stopPreview();
  fs.rmSync(downloadDir, { recursive: true, force: true });
}
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
