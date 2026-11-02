// Makes a 1200x630 PNG share card (og:image) for every blog post, guide and comparison,
// drawn from its frontmatter title in the site's colours (DESIGN.md). Social sites don't
// show SVG previews, so the cards are PNG.
// Output: public/images/og/<slug>.png. Run after adding a post: node scripts/make-og-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sections = [
  { dir: 'src/pages/blog', label: 'BLOG' },
  { dir: 'src/pages/guides', label: 'GUIDE' },
  { dir: 'src/pages/comparisons', label: 'COMPARISON' },
];
const outDir = path.join(root, 'public/images/og');
fs.mkdirSync(outDir, { recursive: true });

// DESIGN.md tokens as hex (sRGB approximations of the OKLCH values).
const C = { bg: '#15120d', panel: '#1f1b15', line: '#3a342b', text: '#f3efe8', soft: '#bdb5a8', accent: '#f5ae39' };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(text, maxChars) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function card(title, label) {
  let size = 76;
  let lines = wrap(title, 24);
  if (lines.length > 3) {
    size = 60;
    lines = wrap(title, 30);
  }
  const lead = size * 1.15;
  const top = 315 - ((lines.length - 1) * lead) / 2 + size * 0.1;
  const tspans = lines
    .map((l, i) => `<tspan x="88" y="${Math.round(top + i * lead)}">${esc(l)}</tspan>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect x="0" y="0" width="1200" height="6" fill="${C.accent}"/>
  <text x="88" y="110" font-family="Consolas, 'JetBrains Mono', monospace" font-size="24" letter-spacing="3" fill="${C.accent}">NUMANX TOOLS · ${label}</text>
  <text font-family="'Segoe UI', Inter, Arial, sans-serif" font-weight="700" font-size="${size}" letter-spacing="-1" fill="${C.text}">${tspans}</text>
  <line x1="88" y1="520" x2="1112" y2="520" stroke="${C.line}" stroke-width="2"/>
  <text x="88" y="566" font-family="'Segoe UI', Inter, Arial, sans-serif" font-size="26" fill="${C.soft}">Free tools that run in your browser</text>
  <text x="1112" y="566" text-anchor="end" font-family="Consolas, 'JetBrains Mono', monospace" font-size="24" fill="${C.soft}">toolshub.numanxstudio.com</text>
</svg>`;
}

for (const { dir, label } of sections) {
  for (const file of fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.md'))) {
    const text = fs.readFileSync(path.join(root, dir, file), 'utf8');
    const m = text.match(/^title:\s*(['"])(.+)\1\s*$/m) || text.match(/^title:\s*(.+)$/m);
    if (!m) {
      console.warn(`skip ${file}: no title`);
      continue;
    }
    const title = (m[2] ?? m[1]).trim();
    const out = path.join(outDir, `${file.replace(/\.md$/, '')}.png`);
    await sharp(Buffer.from(card(title, label)))
      .png({ compressionLevel: 9, palette: true })
      .toFile(out);
    console.log(`ok ${path.relative(root, out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
  }
}
