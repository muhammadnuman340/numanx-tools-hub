# Omega Site Audit Pro — Configuration & CLI Reference

This document provides exhaustive documentation on all environment parameters, command line options, execution patterns, concurrency tuning, and CI/CD integration.

---

## 1. Environment Variables Reference

| Variable | Type | Default | Range | Detailed Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `SITE_URL` | String (URL) | `http://localhost:3000` | Valid HTTP/HTTPS | The target website origin. The crawler restricts all crawling and link checks to this domain. |
| `AUDIT_CONCURRENCY` | Integer | `4` | `1` - `16` | Number of simultaneous browser tabs. On 4-core systems, `4` is optimal. For low-RAM machines, use `2`. |
| `AUDIT_MAX_PAGES` | Integer | `1000` | `1` - `20000` | Cap on the number of unique routes visited during the audit. Prevents runaway crawls on large sites. |
| `AUDIT_TIMEOUT_MS` | Integer | `20000` | `1000` - `120000`| Navigation timeout per page in milliseconds. If exceeded, the page records a timeout error and the worker proceeds. |
| `AUDIT_CRAWL_DEPTH` | Integer | `5` | `0` - `30` | In `crawl` mode, limits the breadth-first search (BFS) traversal depth from the root `/`. |
| `AUDIT_RETRIES` | Integer | `1` | `0` - `5` | Number of automatic retries before logging a page navigation as failed. |
| `AUDIT_DISCOVERY` | String | `auto` | `auto`, `sitemap`, `crawl`, `routes` | Strategy used to find URLs across the site. |
| `AUDIT_ROUTES_FILE`| String (Path) | `""` | Valid file path | Path to a text file with newline-separated URLs when using `AUDIT_DISCOVERY="routes"`. |
| `AUDIT_SETTLE_MS` | Integer | `200` | `0` - `5000` | Milliseconds to wait after `domcontentloaded` before taking the DOM snapshot. Critical for React/Astro hydration. |
| `AUDIT_OUTPUT_DIR` | String (Path) | `audit-reports` | Any path | Directory where `omega-master-site-report.json`, `.csv`, and `.html` are saved. |
| `AUDIT_USER_AGENT` | String | *Dynamic* | Any string | Custom User-Agent header passed to browser contexts. Defaults to `OmegaSiteAuditPro/3.0.0 (read-only quality audit)`. |

---

## 2. Discovery Strategies in Detail

### 1. `auto` Mode (Default)
The crawler attempts sitemap discovery first:
1. Fetches `${SITE_URL}/robots.txt`.
2. Searches for `Sitemap:` directives.
3. Tests `${SITE_URL}/sitemap.xml` and `${SITE_URL}/sitemap_index.xml`.
4. Decodes XML entities (`&amp;`, `&lt;`, etc.) and unpacks nested sitemap files.
5. If at least 1 URL is found, executes the sitemap-driven audit.
6. If 0 URLs are found (e.g. no sitemap exists), silently falls back to internal BFS link crawling starting from `${SITE_URL}/`.

### 2. `sitemap` Mode
Forces the crawler to rely solely on XML sitemaps. If no sitemaps are found or if the sitemap returns HTTP 404, the audit exits immediately with a diagnostic message.

### 3. `crawl` Mode
Bypasses sitemaps completely and runs a pure BFS crawler:
- Starts at `${SITE_URL}/`.
- Scrapes all internal `<a>` links matching `${SITE_URL}`.
- Normalizes paths (stripping hashes `#...` and query parameters `?...`).
- Excludes common static asset extensions: `.avif`, `.css`, `.csv`, `.gif`, `.ico`, `.jpg`, `.jpeg`, `.js`, `.json`, `.map`, `.mp3`, `.mp4`, `.pdf`, `.png`, `.svg`, `.ttf`, `.txt`, `.webm`, `.webp`, `.woff`, `.woff2`, `.xml`, `.zip`.
- Follows links up to `AUDIT_CRAWL_DEPTH` layers deep.

### 4. `routes` Mode
Reads a static text file specified by `AUDIT_ROUTES_FILE`. Blank lines and comments starting with `#` are ignored:
```text
# Production core tools list
/
/tools/word-counter/
/tools/base64-tool/
/tools/json-formatter/
/blog/best-ai-tools-for-students/
```

---

## 3. Platform & Shell Invocation Recipes

### PowerShell (Windows)
```powershell
# Set variables and execute
$env:SITE_URL="https://numanx-tools.pages.dev"
$env:AUDIT_MAX_PAGES="1000"
$env:AUDIT_CONCURRENCY="4"
npm run audit:site:pro
```

### Bash / Zsh (macOS / Linux)
```bash
SITE_URL="https://numanx-tools.pages.dev" \
AUDIT_MAX_PAGES="1000" \
AUDIT_CONCURRENCY="4" \
npm run audit:site:pro
```

### Single Inline Command (Cross-Platform via npx / cross-env)
```powershell
npx cross-env SITE_URL=http://localhost:3000 AUDIT_MAX_PAGES=50 npm run audit:site:pro
```

---

## 4. CI/CD Integration Examples

### GitHub Actions Workflow
```yaml
name: Omega Site Audit CI

on:
  push:
    branches: [ master, main ]
  pull_request:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Site
        run: npm run build

      - name: Start Preview Server
        run: |
          npm run preview &
          npx wait-on http://localhost:3000

      - name: Run Omega Site Audit Pro
        env:
          SITE_URL: "http://localhost:3000"
          AUDIT_MAX_PAGES: "200"
          AUDIT_CONCURRENCY: "2"
        run: npm run audit:site:pro

      - name: Upload Audit Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: omega-audit-reports
          path: audit-reports/
```

### Cloudflare Pages / Vercel Pre-Deploy Check
Add a custom script in `package.json`:
```json
{
  "scripts": {
    "audit:ci": "cross-env AUDIT_MAX_PAGES=150 AUDIT_CONCURRENCY=2 node scripts/audit-site.mjs"
  }
}
```

---

## 5. Performance & Concurrency Tuning

| System Specs | Recommended Concurrency | Max Pages | Estimated Speed |
| :--- | :--- | :--- | :--- |
| **Low-Spec VPS (1-2 vCPU, 2GB RAM)** | `AUDIT_CONCURRENCY=1` | `100` | ~1.5 - 2.5 pages/sec |
| **Standard Laptop / Dev (4-8 cores, 16GB RAM)** | `AUDIT_CONCURRENCY=4` | `1000` | ~4 - 8 pages/sec |
| **High-End Workstation / CI Runner** | `AUDIT_CONCURRENCY=8` | `5000` | ~10 - 18 pages/sec |

> [!TIP]
> **Cloudflare Pages / CDN Rate-Limiting:** When crawling live hosted domains (e.g. `*.pages.dev`), keep concurrency at `4` or below to prevent anti-bot challenge triggers or 429 Too Many Requests responses.
