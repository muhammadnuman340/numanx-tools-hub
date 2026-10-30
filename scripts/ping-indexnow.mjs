import fs from 'node:fs';
import path from 'node:path';

const HOST = 'toolshub.numanxstudio.com';
const KEY = 'numanx2026indexnowkey8842';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.resolve('dist', 'sitemap.xml');

async function pingIndexNow() {
  console.log('🚀 Initiating IndexNow Instant Crawl Ping for NumanX Tools Hub...\n');

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap file not found at ${SITEMAP_PATH}. Please run "npm run build" first.`);
    process.exit(1);
  }

  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const locMatches = sitemapContent.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g);
  const urls = [];

  for (const match of locMatches) {
    const url = match[1].trim();
    if (url.startsWith(`https://${HOST}`)) {
      urls.push(url);
    }
  }

  if (urls.length === 0) {
    console.error('❌ No valid URLs extracted from sitemap.xml.');
    process.exit(1);
  }

  console.log(`📡 Extracted ${urls.length} indexable URLs from sitemap.xml.`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const endpoints = [
    { name: 'IndexNow Universal Gateway', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing IndexNow Endpoint', url: 'https://www.bing.com/indexnow' },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📤 Sending payload to ${endpoint.name} (${endpoint.url})...`);
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      // IndexNow returns 200 (OK) or 202 (Accepted) on success
      if (response.status === 200 || response.status === 202) {
        console.log(`✅ ${endpoint.name}: SUCCESS (${response.status} ${response.statusText}) — ${urls.length} URLs queued!`);
      } else {
        const text = await response.text().catch(() => '');
        console.warn(`⚠️ ${endpoint.name}: Responded with status ${response.status} ${response.statusText}. Details: ${text}`);
      }
    } catch (err) {
      console.error(`❌ Failed to reach ${endpoint.name}:`, err.message);
    }
  }

  console.log('\n✨ IndexNow Instant Ping completed. Search engines (Bing, Copilot, Perplexity, Yandex) have been notified.');
}

pingIndexNow();
