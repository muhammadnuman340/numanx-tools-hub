// FILE: scripts/fix-encoding.mjs
import fs from 'node:fs';
import path from 'node:path';

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]
  );

const replacements = [
  [/â€”/g, '—'],
  [/â€“/g, '–'],
  [/â€™/g, "'"],
  [/â€œ/g, '"'],
  [/â€\u009d/g, '"'],
  [/â†”/g, '↔'],
  [/â†’/g, '→'],
  [/Ã—/g, '×'],
  [/100\uFFFD100px/g, '100×100px'],
  [/150\uFFFD150px/g, '150×150px'],
  [/200\uFFFD200px/g, '200×200px'],
  [/250\uFFFD250px/g, '250×250px'],
  [/300\uFFFD300px/g, '300×300px'],
  [/400\uFFFD400px/g, '400×400px'],
  [/500\uFFFD500px/g, '500×500px'],
  [/\$\{size\}\uFFFD\$\{size\}/g, '${size}×${size}'],
  [/\{s\}\uFFFD\{s\}px/g, '{s}×{s}px'],
  [/\(fuzzy\) \uFFFD with/g, '(fuzzy) — with'],
  [/provided \uFFFD prompt/g, 'provided — prompt'],
  [/tool \uFFFD just/g, 'tool — just'],
  [/Â /g, ' ']
];

let fixedCount = 0;
for (const file of walk('./src')) {
  if (!/\.(astro|md|mdx|ts|js|json)$/.test(file)) continue;
  const raw = fs.readFileSync(file, 'utf8');
  let clean = raw;
  for (const [pattern, rep] of replacements) clean = clean.replace(pattern, rep);
  if (clean !== raw) {
    fs.writeFileSync(file, clean, 'utf8');
    fixedCount++;
    console.log(`[UTF-8 FIXED] ${file}`);
  }
}
console.log(`Completed UTF-8 repair across ${fixedCount} file(s).`);
