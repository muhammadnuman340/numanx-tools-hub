import fs from 'node:fs';
import path from 'node:path';

const SITE_HOST = 'numanx-tools.pages.dev';
const KEY = 'numanx2026indexnowkey8842';
const KEY_LOCATION = `https://${SITE_HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.resolve('dist', 'sitemap-0.xml');

async function submitIndexNow() {
  console.log('📡 Starting Multi-Engine IndexNow AI Broadcasting...');
  console.log(`🔑 Host: ${SITE_HOST} | Key: ${KEY}\n`);

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap file not found at ${SITEMAP_PATH}. Please run "npm run build" first.`);
    process.exit(1);
  }

  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urlMatches = [...sitemapXml.matchAll(/<loc>(https:\/\/numanx-tools\.pages\.dev\/[^<]+)<\/loc>/g)];
  const urlList = urlMatches.map((m) => m[1]);

  if (urlList.length === 0) {
    console.error('❌ No URLs matched in sitemap-0.xml.');
    process.exit(1);
  }

  console.log(`✅ Discovered ${urlList.length} clean URLs in dist/sitemap-0.xml.`);
  console.log('🚀 Broadcasting batch to IndexNow endpoints (Bing, Copilot, Perplexity, OpenAI, DuckDuckGo)...\n');

  const payload = {
    host: SITE_HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const gateways = [
    { name: 'Universal IndexNow Gateway', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing Direct IndexNow Gateway', url: 'https://www.bing.com/indexnow' },
  ];

  for (const gw of gateways) {
    try {
      console.log(`📤 Sending payload to ${gw.name} (${gw.url})...`);
      const response = await fetch(gw.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 202) {
        console.log(`  🟢 ${gw.name}: SUCCESS [${response.status} ${response.statusText}] — ${urlList.length} URLs submitted!`);
      } else {
        const body = await response.text().catch(() => '');
        console.warn(`  🟡 ${gw.name}: HTTP ${response.status} ${response.statusText}. Response: ${body}`);
      }
    } catch (err) {
      console.error(`  🔴 ${gw.name} Failed:`, err.message);
    }
  }

  console.log('\n✨ Multi-Engine IndexNow submission complete.');
}

submitIndexNow();
