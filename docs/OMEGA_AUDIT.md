# Omega Site Audit Pro — Universal Edition (v3.0.0)

A framework-independent, read-only browser crawler and accessibility/SEO auditor powered by Puppeteer.

---

## 1. Requirements
- Node.js 20+ (Verified on Node v24.15.0)
- Project dev server running locally (e.g. `http://localhost:3000`), or an authorized public URL
- `puppeteer` installed as a devDependency

---

## 2. Quick Installation & Integration

### Install Puppeteer
```powershell
npm install -D puppeteer
```

### Scripts in `package.json`
```json
{
  "scripts": {
    "audit:site:pro": "node scripts/audit-site.mjs",
    "audit:site:v4": "node tools/omega-audit-pro/scripts/audit-site.mjs",
    "test:omega": "node --test tools/omega-audit-pro/tests/core.test.mjs tools/omega-audit-pro/tests/report.test.mjs"
  }
}
```
- **Tier 1 (`audit:site:pro`)**: Fast, zero-config single-file crawler (`scripts/audit-site.mjs`, v3.0.0) generating fixed deterministic reports for CI and pre-commit checks.
- **Tier 2 (`audit:site:v4`)**: Enterprise modular crawler (`tools/omega-audit-pro/`, v4.0.0) with history diffing (`manage-history.mjs`), PDF exports, SSRF guards, and GSC integration.


---

## 3. Usage & Execution Commands

### Step 1: Start the Local Server
```powershell
npm run dev
# or npm run preview
```
Default local port for NumanX Tools Hub is `http://localhost:3000`.

### Step 2: Run the Crawler in Another Terminal

#### Safe 10-Page Test (Recommended First Run)
```powershell
$env:SITE_URL="http://localhost:3000"; $env:AUDIT_MAX_PAGES="10"; $env:AUDIT_CONCURRENCY="2"; npm run audit:site:pro
```

#### Full Comprehensive Sitemap Audit
```powershell
$env:SITE_URL="http://localhost:3000"; $env:AUDIT_MAX_PAGES="1000"; $env:AUDIT_CONCURRENCY="4"; npm run audit:site:pro
```

#### Run Against Deployed Production / Preview URL
```powershell
$env:SITE_URL="https://numanx-tools.pages.dev"; npm run audit:site:pro
```

#### Run With Route List Mode
```powershell
$env:SITE_URL="http://localhost:3000"; $env:AUDIT_DISCOVERY="routes"; $env:AUDIT_ROUTES_FILE="./docs/examples/audit-routes.example.txt"; npm run audit:site:pro
```

---

## 4. Configuration Options

| Environment Variable | Default | Description |
| :--- | :--- | :--- |
| `SITE_URL` | `http://localhost:3000` | Target origin to audit |
| `AUDIT_DISCOVERY` | `auto` | Discovery mode: `auto`, `sitemap`, `crawl`, `routes` |
| `AUDIT_CONCURRENCY` | `4` | Parallel Chromium tabs (range 1–16) |
| `AUDIT_TIMEOUT_MS` | `20000` | Page navigation timeout in milliseconds |
| `AUDIT_MAX_PAGES` | `1000` | Maximum pages to discover and audit |
| `AUDIT_CRAWL_DEPTH` | `5` | Maximum internal anchor link depth (crawl mode) |
| `AUDIT_RETRIES` | `1` | Retries on failed navigations (0–5) |
| `AUDIT_SETTLE_MS` | `200` | Extra delay post-`DOMContentLoaded` in ms |
| `AUDIT_ROUTES_FILE` | `""` | File path for `routes` mode (one path per line) |
| `AUDIT_OUTPUT_DIR` | `audit-reports` | Directory where JSON, CSV, and HTML reports are written |
| `AUDIT_USER_AGENT` | `OmegaSiteAuditPro/...` | Custom HTTP User-Agent header |

---

## 5. Output Reports
Reports are generated in `audit-reports/` (gitignored):
1. **`omega-master-site-report.json`**: Complete structured audit data, metrics, and per-page issues.
2. **`omega-master-site-report.csv`**: Tabular format for spreadsheets (Excel / Google Sheets).
3. **`omega-master-site-report.html`**: Interactive dark-mode dashboard with per-page findings.

---

## 6. Heuristic Checks & Scoring Weights
- **SEO Score (40% weight):**
  - Title presence & optimal length (30–65 chars)
  - Meta description presence & length (70–160 chars)
  - Canonical link presence & valid URL
  - Single `<h1>` heading
  - `<html lang>` document language
  - Indexability (absence of `noindex`)
  - Content depth (>= 100 characters body text)
- **Accessibility Score (25% weight):**
  - Images missing `alt` attributes
  - Form controls without accessible labels
  - Links without accessible names
  - Heading hierarchy jumps
  - Tables without header cells (`<th>`)
  - Broken same-page anchor links (`#id`)
- **Technical Health (25% weight):**
  - HTTP 2xx/3xx status code
  - Viewport `<meta>` tag
  - Rendered content length
  - `<main>` semantic landmark presence
  - Browser console error count
  - Page runtime exception count
- **Structured Data (10% weight):**
  - Discovery of JSON-LD Schema.org types (informational)

---

## 7. Troubleshooting & Limitations
1. **Target server must be running:** The crawler requires an active HTTP/HTTPS endpoint.
2. **Heuristic review aid:** Scores are automated diagnostics and do not guarantee search rankings or full WCAG conformance.
3. **Client-rendered hydration:** For sites with heavy async client-side hydration, increase `AUDIT_SETTLE_MS` (e.g. `500` or `1000`).
