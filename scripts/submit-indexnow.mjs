import fs from 'node:fs';
import path from 'node:path';

const SITE_HOST = 'numanx-tools.pages.dev';
const KEY = 'numanx2026indexnowkey8842';
const KEY_LOCATION = `https://${SITE_HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.resolve('dist', 'sitemap.xml');

async function submitIndexNow() {
  console.log('📡 Starting Multi-Engine IndexNow AI Broadcasting...');
  console.log(`🔑 Host: ${SITE_HOST} | Key: ${KEY}\n`);

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap file not found at ${SITEMAP_PATH}. Please run "npm run build" first.`);
    process.exit(1);
  }

  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urlMatches = [...sitemapXml.matchAll(/<loc>(https:\/\/numanx-tools\.pages\.dev\/[^<]*)<\/loc>/g)];
  const urlList = urlMatches.map((m) => m[1]);

  if (urlList.length === 0) {
    console.error('❌ No URLs matched in sitemap.xml.');
    process.exit(1);
  }

  console.log(`✅ Discovered ${urlList.length} clean URLs in dist/sitemap.xml.`);
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

  // Resilient High-Speed GET Broadcast Fallback for Universal IndexNow Gateway
  console.log('\n⚡ Broadcasting routes via Universal IndexNow GET API...');
  let successCount = 0;
  for (const url of urlList) {
    try {
      const getEndpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${KEY}`;
      const res = await fetch(getEndpoint);
      if (res.status === 200 || res.status === 202) {
        successCount++;
      }
    } catch (e) {}
  }
  console.log(`  🟢 Universal IndexNow GET Broadcast: ${successCount}/${urlList.length} URLs Accepted (HTTP 202)!`);

  console.log('\n✨ Multi-Engine IndexNow submission complete.');
}

submitIndexNow();
