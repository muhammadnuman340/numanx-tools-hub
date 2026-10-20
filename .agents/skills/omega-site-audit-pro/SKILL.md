---
name: omega-site-audit-pro
description: >-
  Audits rendered web pages for technical SEO, WCAG 2.2 AA accessibility, console errors, broken links,
  and Open Graph/Schema.org metadata using Omega Site Audit Pro (Puppeteer headless crawler).
  Use this skill whenever running comprehensive site audits, checking page health across all sitemap routes,
  validating pre-deployment quality, diagnosing SEO or accessibility regressions, or generating HTML/CSV/JSON audit reports.
---

# Omega Site Audit Pro — Universal Quality & Technical SEO Auditor

**Omega Site Audit Pro — Universal Edition** (`scripts/audit-site.mjs`) is an automated, read-only quality crawler and accessibility/SEO inspection engine. Running in real headless Chromium via Puppeteer, it inspects fully rendered DOMs, tracks network failures, logs runtime console exceptions, and validates accessibility and structured data across static and client-hydrated web applications.

---

## 1. Core Architecture & System Overview

Unlike static regex scanners or naive HTML parsers, Omega Site Audit Pro executes inside real Chromium browser contexts. It tests what search engine bots and real human users actually experience after client-side JavaScript execution, hydrate hooks, web font downloads, and dynamic layout shifts.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Omega Site Audit Pro                            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   1. Route Discovery Engine                 2. Worker Pool Manager
   - Robots.txt parsing                      - Concurrency pool (default: 4)
   - XML Sitemap tree traversal              - Isolated Browser Pages
   - BFS Deep crawling (depth: 5)            - Resource block (skip heavy media)
   - Explicit routes text file               - DOM settle delay (hydration)
              │                                         │
              └────────────────────┬────────────────────┘
                                   │
                                   ▼
                   3. Headless Chromium Render Lifecycle
                   - Page navigation (wait: DOMContentLoaded)
                   - Runtime console error interceptor
                   - Network asset failure tracking (4xx / 5xx)
                   - Live DOM evaluation (evaluateScript)
                                   │
                                   ▼
                   4. Multi-Category Rule Engine
                   ├── Accessibility (WCAG 2.2 AA checks)
                   ├── Technical SEO (title, meta, canonical, robots)
                   ├── Social Graph (Open Graph, Twitter Cards)
                   ├── Structured Data (Schema.org JSON-LD validator)
                   └── Health & Performance (broken links, mixed content)
                                   │
                                   ▼
                   5. Multi-Format Report Generator
                   ├── audit-reports/omega-master-site-report.json
                   ├── audit-reports/omega-master-site-report.csv
                   └── audit-reports/omega-master-site-report.html
```

---

## 2. When to Use This Skill

Activate this skill when:
- Performing pre-deployment or post-deployment quality audits on staging, preview, or production URLs.
- Auditing site-wide WCAG 2.2 AA accessibility compliance (missing image alt tags, unlabeled form controls, inaccessible buttons, broken heading hierarchies).
- Auditing technical SEO hygiene across all indexable routes (canonical accuracy, title/description character limits, duplicate meta tags, robots directives).
- Diagnosing silent runtime crashes, unhandled client exceptions, or broken static assets across deep routes.
- Generating executive audit reports (JSON, CSV, or standalone HTML dashboards) for QA reviews or client sign-offs.

---

## 3. Configuration & Environment Variables

The audit engine is configured dynamically via environment variables. All parameters have safe, battle-tested defaults:

| Variable | Type | Default | Valid Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `SITE_URL` | URL | `http://localhost:3000` | Valid HTTP/HTTPS URL | The root origin to audit. Crawl will not traverse external domains. |
| `AUDIT_CONCURRENCY` | Integer | `4` | `1` to `16` | Number of concurrent Puppeteer pages rendered simultaneously. |
| `AUDIT_MAX_PAGES` | Integer | `1000` | `1` to `20000` | Maximum number of unique route URLs to process. |
| `AUDIT_TIMEOUT_MS` | Integer | `20000` | `1000` to `120000` | Maximum navigation timeout per page before failing gracefully. |
| `AUDIT_CRAWL_DEPTH` | Integer | `5` | `0` to `30` | Maximum link depth when running in BFS crawl mode. |
| `AUDIT_RETRIES` | Integer | `1` | `0` to `5` | Retry attempts for transient navigation/network failures. |
| `AUDIT_DISCOVERY` | String | `auto` | `auto`, `sitemap`, `crawl`, `routes` | Discovery strategy for collecting target URLs. |
| `AUDIT_ROUTES_FILE`| File Path | `""` | Valid file path | Newline-separated route list used when `AUDIT_DISCOVERY="routes"`. |
| `AUDIT_SETTLE_MS` | Integer | `200` | `0` to `5000` | Post-load sleep delay to allow client hydration to complete. |
| `AUDIT_OUTPUT_DIR` | Directory | `audit-reports` | Any writable path | Target output directory for JSON, CSV, and HTML reports. |
| `AUDIT_USER_AGENT` | String | *Dynamic* | Any string | Custom User-Agent header passed to browser requests. |

---

## 4. Discovery Engine Strategies

### 1. `auto` Mode (Default & Recommended)
1. Checks `${SITE_URL}/robots.txt` for `Sitemap:` directives.
2. Checks standard sitemap locations:
   - `${SITE_URL}/sitemap.xml`
   - `${SITE_URL}/sitemap_index.xml`
3. If sitemaps are found, parses nested `<sitemap>` indices and `<url>` entries.
4. If no sitemap exists or 0 URLs are found, automatically falls back to recursive BFS internal link crawling starting from `/`.

### 2. `sitemap` Mode
Strictly forces sitemap discovery. If sitemaps are missing or empty, halts with an error instead of crawling.

### 3. `crawl` Mode
Bypasses sitemaps entirely. Begins at `${SITE_URL}/` and crawls all internal `<a href="...">` links up to `AUDIT_CRAWL_DEPTH` and `AUDIT_MAX_PAGES`. Automatically filters out query params, hash anchors, and static asset file extensions (`.png`, `.svg`, `.pdf`, `.css`, etc.).

### 4. `routes` Mode
Reads explicit relative or absolute route paths from a text file specified by `AUDIT_ROUTES_FILE`:
```text
/
/tools/word-counter/
/tools/base64-tool/
/blog/
```

---

## 5. Execution Runbook & Recipes

### Scenario A: Fast Pre-Flight Check (10 Pages)
Ideal for quick PR checks or rapid testing during development:
```powershell
$env:SITE_URL="http://localhost:3000"
$env:AUDIT_MAX_PAGES="10"
$env:AUDIT_CONCURRENCY="2"
npm run audit:site:pro
```

### Scenario B: Full Local Production Sitemap Audit
Runs against a local production build (`npm run preview` on port 3000):
```powershell
$env:SITE_URL="http://localhost:3000"
$env:AUDIT_MAX_PAGES="1000"
$env:AUDIT_CONCURRENCY="4"
npm run audit:site:pro
```

### Scenario C: Live Deployed Production Audit
Audits the live hosted site (`https://numanx-tools.pages.dev`):
```powershell
$env:SITE_URL="https://numanx-tools.pages.dev"
$env:AUDIT_MAX_PAGES="1000"
$env:AUDIT_CONCURRENCY="4"
npm run audit:site:pro
```

### Scenario D: Explicit Target Route List
Audits only specific high-priority tools:
```powershell
$env:SITE_URL="http://localhost:3000"
$env:AUDIT_DISCOVERY="routes"
$env:AUDIT_ROUTES_FILE="./docs/examples/audit-routes.example.txt"
npm run audit:site:pro
```

### Scenario E: Running in Headless Linux / CI Environments
```bash
SITE_URL="https://staging.example.com" \
AUDIT_MAX_PAGES="500" \
AUDIT_CONCURRENCY="2" \
npm run audit:site:pro
```

### Scenario F: Deep Historical & PDF Audit (Universal V4 Engine)
Runs the modular V4 engine with historical scan indexing and PDF report generation:
```powershell
$env:SITE_URL="http://localhost:3000"
$env:AUDIT_ALLOW_PRIVATE_NETWORK="true"
$env:AUDIT_PROFILE="professional"
npm run audit:site:v4
```

---

## 6. Audit Inspection Categories & Rules

The crawler executes 30+ validation checks categorized into five core domains:

### 1. Accessibility (WCAG 2.2 AA)
- **Image Text Alternatives:** Flags `<img>` missing `alt` attributes. Flags empty `alt=""` on images that act as active interactive links.
- **Form Controls & Inputs:** Verifies every `<input>`, `<textarea>`, `<select>` has an associated `<label>`, `aria-label`, or `aria-labelledby`.
- **Actionable Elements:** Verifies `<button>` and `<a>` elements contain accessible text or discernible `aria-label`. Flags blank icon buttons.
- **Heading Semantics:** Ensures exactly one `<h1>` per page. Detects skipped heading levels (e.g. `<h1>` followed directly by `<h3>`).
- **Document Structure:** Verifies `<html lang="...">` exists and is non-empty. Ensures `<main>` landmark exists.
- **Mobile Viewport:** Flags `user-scalable=no` or `maximum-scale=1` which disable assistive zooming.

### 2. Technical SEO
- **Title Tag:** Checks existence, length (optimal: 30–65 characters), and unrendered placeholders (e.g. `undefined`, `NaN`).
- **Meta Description:** Checks existence and length (optimal: 70–160 characters).
- **Canonical Link:** Verifies `<link rel="canonical">` presence, valid URL syntax, matching host, and flags self-referential mismatches.
- **Robots Directives:** Inspects `<meta name="robots">` for unintended `noindex` or `nofollow` directives.

### 3. Social & Open Graph Metadata
- **Open Graph:** Validates `og:title`, `og:description`, `og:image`, and `og:url`. Ensures `og:image` is an absolute HTTP/HTTPS URL.
- **Twitter Card:** Checks `twitter:card` (e.g. `summary_large_image`) and `twitter:image`.

### 4. Structured Data (Schema.org JSON-LD)
- Discovers and validates all `<script type="application/ld+json">` blocks.
- Validates JSON parse integrity (zero syntax errors).
- Recursively traverses root entities and `@graph` arrays to index all declared types (e.g., `WebSite`, `WebApplication`, `Organization`, `FAQPage`, `BreadcrumbList`).

### 5. Runtime Health & Technical Hygiene
- **Console Errors:** Intercepts `console.error` and unhandled exceptions thrown during page execution.
- **Network Asset 4xx/5xx:** Records failed HTTP requests for stylesheets, scripts, web fonts, and images.
- **Broken Internal Links:** Identifies internal `<a>` links returning 404, 500, or invalid protocol targets.
- **Mixed Content:** Flags insecure `http://` assets loaded on `https://` origins.

---

## 7. Scoring System & Formulas

Each audited page receives a composite health score from `0` to `100`, computed via weighted deductions:

$$\text{Overall Score} = (0.35 \times \text{SEO}) + (0.35 \times \text{Technical}) + (0.30 \times \text{Accessibility})$$

### Penalty Scale:
- **Critical Issues (-20 to -30 pts):** Page failure, HTTP 4xx/5xx, missing title, missing viewport, unhandled JS crash.
- **High Issues (-10 to -15 pts):** Missing canonical, missing H1, unlabeled form controls, broken internal links.
- **Medium Issues (-5 to -8 pts):** Title length out of range, missing meta description, heading hierarchy jump, missing Open Graph tags.
- **Low Issues (-2 to -4 pts):** Minor description length deviation, missing lang attribute.

---

## 8. Output Reports & Data Artifacts

Every audit run writes three distinct, self-contained artifacts into the output directory (default: `audit-reports/`):

```
audit-reports/
├── omega-master-site-report.json  # Complete raw JSON dataset with all pages & issues
├── omega-master-site-report.csv   # Flat tabular report for Excel / Google Sheets
└── omega-master-site-report.html  # Standalone interactive dark-mode dashboard
```

### 1. `omega-master-site-report.json`
Contains top-level metadata:
```json
{
  "tool": "Omega Site Audit Pro Universal",
  "version": "3.0.0",
  "timestamp": "2026-10-17T21:57:03.038Z",
  "siteUrl": "https://numanx-tools.pages.dev",
  "totalPagesAudited": 108,
  "successfulNavigations": 108,
  "failedPages": 0,
  "siteHealthScore": 73,
  "totalIssues": 1038,
  "pages": [ ... ]
}
```

### 2. `omega-master-site-report.csv`
Tabular columns:
`URL, Final URL, Status, Overall Score, SEO Score, Accessibility Score, Technical Score, Title, Title Length, Meta Description Length, Canonical, H1 Count, Missing Alt, Unlabeled Controls, Unnamed Links, Heading Jumps, Schemas, Issues Count, Top Issues`

### 3. `omega-master-site-report.html`
- Interactive dark-mode dashboard built with zero external runtime dependencies.
- KPI metric cards: Total Audited, Average Site Score, Total Issues Found, Critical Errors.
- Filterable and searchable table with status badges and score color coding.
- Expandable issue drawers showing exact selectors, code contexts, and remediation steps.

---

## 9. Performance Optimization & Safety Guidelines

1. **Read-Only Non-Destructive Operation:** The crawler never submits forms, clicks mutating buttons (e.g. Delete, Save), or modifies server state.
2. **Resource Throttling:** Requests for heavy media types (`image`, `media`, `font`) can be intercepted and aborted if bandwidth optimization is required.
3. **Safe Concurrency:** Always use concurrency between 2 and 4 when testing live serverless hosts (such as Cloudflare Pages or Vercel) to avoid triggering DDoS rate-limiting or 429 Too Many Requests.
4. **Memory Management:** Each page is opened, evaluated, and explicitly closed inside a `try...finally` block to prevent Chromium memory leaks.
5. **Git Safety:** `audit-reports/` is registered in `.gitignore` by default to avoid bloating source repositories with transient report files.

---

## 10. Related Reference Documents

For deeper implementation details, consult the reference guides:
- [Audit Rules & Scoring Reference](./references/audit-rules-reference.md)
- [Configuration & CLI Reference](./references/configuration-and-cli-reference.md)
- [Report Data Schemas & API](./references/reporting-and-data-schemas.md)
