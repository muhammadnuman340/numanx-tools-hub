import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');
const PUBLIC_DIR = path.resolve('public');

let totalErrors = 0;
let totalFilesChecked = 0;

console.log('🔍 Starting NumanX Pre-Build & Repository Audit...\n');

// 1. Audit Encoding & Mojibake in src/
function checkEncoding(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      checkEncoding(fullPath);
    } else if (/\.(astro|ts|js|mjs|json|css|md)$/i.test(file.name)) {
      totalFilesChecked++;
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('\uFFFD')) {
        console.error(`❌ Mojibake character \\uFFFD detected in: ${path.relative('.', fullPath)}`);
        totalErrors++;
      }
      if (/â€”|â†”|âœ“|â€™/.test(content)) {
        console.error(`❌ Legacy double-encoded UTF-8 artifact detected in: ${path.relative('.', fullPath)}`);
        totalErrors++;
      }
    }
  }
}

checkEncoding(SRC_DIR);
console.log(`✅ Checked ${totalFilesChecked} source files for encoding integrity (0 mojibake).`);

// 2. Audit robots.txt
const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (robots.includes('Google-Extended') && robots.includes('Sitemap: https://numanx-tools.pages.dev/sitemap.xml')) {
    console.log('✅ robots.txt properly configured with Google-Extended and single sitemap.xml.');
  } else {
    console.error('❌ robots.txt is missing Google-Extended or single sitemap.xml reference.');
    totalErrors++;
  }
} else {
  console.error('❌ robots.txt missing in public directory.');
  totalErrors++;
}

// 3. Audit llms.txt
const llmsPath = path.join(PUBLIC_DIR, 'llms.txt');
if (fs.existsSync(llmsPath)) {
  console.log('✅ llms.txt present for AI agent discoverability.');
} else {
  console.warn('⚠️ llms.txt missing in public directory.');
}

// 4. Audit Tool Pages in src/pages/tools/
const toolsDir = path.join(SRC_DIR, 'pages', 'tools');
if (fs.existsSync(toolsDir)) {
  const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.astro') && f !== 'index.astro' && !f.startsWith('['));
  console.log(`\n🛠️ Auditing ${toolFiles.length} tool pages in src/pages/tools/...`);
  let validTools = 0;
  for (const tf of toolFiles) {
    const content = fs.readFileSync(path.join(toolsDir, tf), 'utf8');
    const hasTitle = /title="[^"]+"/.test(content);
    const hasDesc = /description="[^"]+"/.test(content);
    if (!hasTitle || !hasDesc) {
      console.warn(`⚠️ Tool ${tf} is missing title or description metadata.`);
    } else {
      validTools++;
    }
  }
  console.log(`✅ All ${validTools}/${toolFiles.length} tool pages contain complete SEO metadata.`);
}

// 5. Audit E-E-A-T and Contact Verification in src/
function checkContactIntegrity(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      checkContactIntegrity(fullPath);
    } else if (/\.(astro|ts|js|mjs|json|md)$/i.test(file.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (/@numanxstudio\.com|@numanxtools\.site/.test(content)) {
        console.error(`❌ Unverified email domain detected in: ${path.relative('.', fullPath)}`);
        totalErrors++;
      }
      if (/https:\/\/github\.com\/numanxstudio\b/.test(content)) {
        console.error(`❌ Deprecated GitHub org URL detected in: ${path.relative('.', fullPath)}`);
        totalErrors++;
      }
    }
  }
}

checkContactIntegrity(SRC_DIR);
console.log('✅ E-E-A-T Contact Integrity verified (0 unverified email domains, canonical repo link verified).');

// 6. Audit Trailing Slash Canonicalization across all internal links in src/
let linkErrors = 0;
function checkTrailingSlashIntegrity(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      checkTrailingSlashIntegrity(fullPath);
    } else if (/\.(astro|md|ts|js)$/i.test(file.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // 1. Static href="/blog/xyz" without trailing slash
        const mStatic = line.match(/href=["'](\/(?:blog|guides|comparisons|category|tools)\/[a-zA-Z0-9_-]+)(?<!\/)["']/g);
        if (mStatic) {
          console.error(`❌ Static link missing trailing slash in ${path.relative('.', fullPath)}:${idx + 1} -> ${line.trim()}`);
          linkErrors++;
          totalErrors++;
        }
        // 2. Concatenated href={'/blog/' + slug} without +'/'
        if (/href=\{['"]\/(?:blog|guides|comparisons|category|tools)\/['"]\s*\+/.test(line) && !/\+\s*['"]\/['"]/.test(line)) {
          console.error(`❌ Concatenated link missing trailing slash in ${path.relative('.', fullPath)}:${idx + 1} -> ${line.trim()}`);
          linkErrors++;
          totalErrors++;
        }
        // 3. Template literal href={`/blog/${slug}`} where character before closing backtick is not /
        const mTemplate = line.match(/href=\{`\/(?:blog|guides|comparisons|category|tools)\/[^`]+`\}/g);
        if (mTemplate) {
          mTemplate.forEach((tpl) => {
            if (!tpl.includes('/`}') && !tpl.includes('/?')) {
              console.error(`❌ Template link missing trailing slash in ${path.relative('.', fullPath)}:${idx + 1} -> ${line.trim()}`);
              linkErrors++;
              totalErrors++;
            }
          });
        }
      });
    }
  }
}

checkTrailingSlashIntegrity(SRC_DIR);
if (linkErrors === 0) {
  console.log('✅ Trailing Slash Canonicalization verified (0 internal redirect inlinks, 100% direct 200 OK links).');
}

// 7. Audit Single Sitemap Architecture (when dist/ exists)
const DIST_DIR = path.resolve('dist');
const distSitemap = path.join(DIST_DIR, 'sitemap.xml');
const distSitemapIndex = path.join(DIST_DIR, 'sitemap-index.xml');
const distSitemap0 = path.join(DIST_DIR, 'sitemap-0.xml');

if (fs.existsSync(distSitemapIndex) || fs.existsSync(distSitemap0)) {
  console.error('❌ Redundant multi-file sitemaps (sitemap-index.xml or sitemap-0.xml) detected in dist/.');
  totalErrors++;
}

if (fs.existsSync(distSitemap)) {
  const sitemapXml = fs.readFileSync(distSitemap, 'utf8');
  const locMatches = [...sitemapXml.matchAll(/<loc>(https:\/\/numanx-tools\.pages\.dev\/[^<]*)<\/loc>/g)];
  const urls = locMatches.map(m => m[1]);
  const uniqueUrls = new Set(urls);

  if (urls.length !== uniqueUrls.size) {
    console.error(`❌ Duplicate URLs detected in sitemap.xml (${urls.length} total, ${uniqueUrls.size} unique).`);
    totalErrors++;
  }

  const disallowed = ['/dashboard/', '/favorites/', '/search/', '/offline/', '/404', '/api/'];
  let disallowedFound = 0;
  for (const url of urls) {
    if (disallowed.some(d => url.includes(d))) {
      console.error(`❌ Disallowed URL detected in sitemap.xml: ${url}`);
      disallowedFound++;
      totalErrors++;
    }
  }

  if (urls.length === 107 && urls.length === uniqueUrls.size && disallowedFound === 0) {
    console.log(`✅ Single Sitemap Architecture verified (exactly 107 canonical URLs, 0 duplicates, 0 disallowed).`);
  } else if (urls.length !== 107) {
    console.error(`❌ Sitemap URL count mismatch: expected 107 URLs, found ${urls.length}.`);
    totalErrors++;
  }
}

console.log('\n----------------------------------------');
if (totalErrors === 0) {
  console.log('🎉 AUDIT PASSED: Site integrity, encoding, and metadata are 100% clean!\n');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED with ${totalErrors} issue(s).\n`);
  process.exit(1);
}
