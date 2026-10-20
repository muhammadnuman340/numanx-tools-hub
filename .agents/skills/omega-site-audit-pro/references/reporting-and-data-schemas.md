# Omega Site Audit Pro — Reporting & Data Schemas

Omega Site Audit Pro generates three export formats in the configured output directory (`audit-reports/`):
1. `omega-master-site-report.json` — Exhaustive structured JSON document.
2. `omega-master-site-report.csv` — Flat spreadsheet for sorting, filtering, and reporting in Excel / Google Sheets.
3. `omega-master-site-report.html` — Standalone, interactive dark-mode dashboard.

---

## 1. JSON Report Schema (`omega-master-site-report.json`)

The JSON artifact contains the complete telemetry, configuration, summary statistics, and per-page audit findings.

### Root Object Schema:
```json
{
  "tool": "Omega Site Audit Pro Universal",
  "version": "3.0.0",
  "timestamp": "2026-10-17T21:57:03.038Z",
  "siteUrl": "https://numanx-tools.pages.dev",
  "configuration": {
    "discovery": "auto",
    "concurrency": 4,
    "timeoutMs": 20000,
    "maxPages": 1000,
    "crawlDepth": 5,
    "retries": 1
  },
  "totalPagesAudited": 108,
  "successfulNavigations": 108,
  "failedPages": 0,
  "siteHealthScore": 73,
  "totalIssues": 1038,
  "pages": [
    {
      "requestedUrl": "https://numanx-tools.pages.dev/tools/word-counter/",
      "finalUrl": "https://numanx-tools.pages.dev/tools/word-counter/",
      "status": 200,
      "redirected": false,
      "title": "Text Count & Paragraph Word Counter Online | NumanX Tools",
      "titleLength": 57,
      "metaDescription": "Free online text count and paragraph word counter. Instantly count words in a paragraph, characters, sentences, Flesch readability, and social media limits.",
      "metaDescriptionLength": 156,
      "canonical": "https://numanx-tools.pages.dev/tools/word-counter/",
      "scores": {
        "seo": 100,
        "accessibility": 40,
        "technical": 85,
        "structuredData": 100,
        "overall": 81
      },
      "metrics": {
        "title": "Text Count & Paragraph Word Counter Online | NumanX Tools",
        "metaDescription": "Free online text count...",
        "canonical": "https://numanx-tools.pages.dev/tools/word-counter/",
        "robots": "index, follow, max-snippet:-1, max-image-preview:large",
        "h1Count": 1,
        "h1": "Word Counter Analytics Pro",
        "imageCount": 0,
        "missingAlt": 0,
        "imagesWithEmptyAlt": 0,
        "controlCount": 11,
        "unlabeledControls": 4,
        "linkCount": 42,
        "unnamedLinks": 0,
        "tableCount": 1,
        "tablesWithoutHeaders": 0,
        "headingJumps": 1,
        "viewport": true,
        "lang": "en",
        "mainCount": 1,
        "schemaTypes": [
          "Organization",
          "WebSite",
          "WebPage",
          "BreadcrumbList",
          "FAQPage",
          "WebApplication"
        ],
        "textLength": 6420,
        "brokenAnchors": 0
      },
      "issues": [
        {
          "category": "accessibility",
          "code": "unlabeled-control",
          "severity": "high",
          "message": "Form control is missing an accessible label (<label>, aria-label, or aria-labelledby).",
          "selector": "textarea#input-text"
        }
      ],
      "consoleErrors": [],
      "failedRequests": []
    }
  ]
}
```

---

## 2. CSV Report Specification (`omega-master-site-report.csv`)

The CSV output flattens page audits into comma-separated rows with quoted strings, suitable for automated ingestion into BigQuery, PostgreSQL, Python pandas, or Google Sheets.

### Header Fields:
1. `URL`: The original target URL audited.
2. `Final URL`: The landing URL after any redirects.
3. `Status`: HTTP response status code (e.g. `200`, `301`, `404`).
4. `Overall Score`: Composite score (0-100).
5. `SEO Score`: Technical SEO category score (0-100).
6. `Accessibility Score`: WCAG 2.2 AA category score (0-100).
7. `Technical Score`: Console & runtime health score (0-100).
8. `Title`: Document `<title>` tag text.
9. `Title Length`: Character length of the title.
10. `Meta Description Length`: Character length of meta description.
11. `Canonical`: Value of `<link rel="canonical">`.
12. `H1 Count`: Number of `<h1>` elements detected.
13. `Missing Alt`: Count of `<img>` tags missing the `alt` attribute.
14. `Unlabeled Controls`: Count of inputs/textareas lacking accessible labels.
15. `Unnamed Links`: Count of anchor tags lacking accessible names.
16. `Heading Jumps`: Count of invalid heading rank skips (e.g. h1 to h3).
17. `Schemas`: Semicolon-separated list of detected Schema.org entities.
18. `Issues Count`: Total number of issues flagged on this route.
19. `Top Issues`: Pipe-separated list of the top 3 highest-severity issues.

---

## 3. Interactive HTML Dashboard (`omega-master-site-report.html`)

The HTML artifact is a single, zero-dependency HTML file featuring:
- **Dark Mode UI:** Modern zinc/slate glassmorphism design system matching high-contrast dark editors.
- **KPI Summary Cards:**
  - Total Pages Audited.
  - Overall Site Health Score (% badge with green/amber/red color coding).
  - Clean Navigations vs Navigation Failures.
  - Total Issues Found (broken down by Critical, High, Medium, Low).
- **Search & Filter Controls:**
  - Real-time text search filter (matches URLs, titles, or issue codes).
  - Minimum score slider filter.
  - Category selector (Filter by Accessibility, SEO, or Technical).
- **Collapsible Detail Drawers:**
  - Clicking any table row expands an accordion drawer with exact issue selectors, code snippets, and remediation instructions.
