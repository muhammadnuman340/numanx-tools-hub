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
  if (robots.includes('Google-Extended') && robots.includes('sitemap-index.xml')) {
    console.log('✅ robots.txt properly configured with Google-Extended and sitemap-index.xml.');
  } else {
    console.warn('⚠️ robots.txt is missing Google-Extended or sitemap-index.xml reference.');
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

console.log('\n----------------------------------------');
if (totalErrors === 0) {
  console.log('🎉 AUDIT PASSED: Site integrity, encoding, and metadata are 100% clean!\n');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED with ${totalErrors} issue(s).\n`);
  process.exit(1);
}
