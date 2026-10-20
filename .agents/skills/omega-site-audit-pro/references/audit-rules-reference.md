# Omega Site Audit Pro — Audit Rules & Scoring Reference

This document provides the exhaustive specification for all validation checks, heuristics, severity levels, and scoring algorithms evaluated by Omega Site Audit Pro.

---

## 1. Scoring Engine & Weighting System

Each audited page starts with 100 points in three individual categories, then computes a weighted composite overall health score:

$$\text{Overall Score} = (0.35 \times \text{SEO}) + (0.35 \times \text{Technical}) + (0.30 \times \text{Accessibility})$$

The overall site health score is the arithmetic mean of all audited pages' overall scores:

$$\text{Site Health Score} = \frac{1}{N} \sum_{i=1}^{N} \text{Overall Score}_i$$

---

## 2. Category 1: Accessibility (WCAG 2.2 AA)

Weight: **30%** of Overall Score.

### Rule A11Y-01: Image Text Alternatives (`<img>` elements)
- **Standard:** WCAG 2.2 Success Criterion 1.1.1 (Non-text Content).
- **Checks:**
  - Evaluates every `HTMLImageElement` in the rendered DOM.
  - Flags images missing the `alt` attribute entirely (`img:not([alt])`).
  - Flags images wrapped inside `<a>` links that have `alt=""` and no other text or `aria-label` inside the anchor (resulting in an empty link accessible name).
- **Severity:** High (`missing-alt`) or Medium (`decorative-link`).
- **Remediation:** Provide concise, descriptive `alt="..."` for informational images, or mark purely decorative standalone images with `alt="" aria-hidden="true"`.

### Rule A11Y-02: Form Controls & Input Labeling
- **Standard:** WCAG 2.2 Success Criterion 1.3.1 (Info and Relationships) & 4.1.2 (Name, Role, Value).
- **Checks:**
  - Inspects all `<input>` (excluding `type="hidden"`, `type="button"`, `type="submit"`), `<textarea>`, `<select>`, and contenteditable controls.
  - Verifies presence of:
    1. Associated `<label for="id">` or nesting `<label>`.
    2. Accessible name via `aria-label="..."`.
    3. Associated text via `aria-labelledby="..."`.
- **Severity:** High (`unlabeled-control`).
- **Remediation:** Add `<label for="id">` or `aria-label="Description"` to all inputs, selects, and textareas.

### Rule A11Y-03: Actionable Element Accessible Names
- **Standard:** WCAG 2.2 Success Criterion 4.1.2 (Name, Role, Value).
- **Checks:**
  - Tests all `<button>` elements and `<a>` elements for non-empty accessible text.
  - Flags icon-only buttons (such as copy buttons, theme toggles, modal closes) that omit both inner text and an `aria-label`.
- **Severity:** High (`unnamed-button` / `unnamed-link`).
- **Remediation:** Add `aria-label="Copy input to clipboard"` or visually hidden text (`<span class="sr-only">Copy</span>`).

### Rule A11Y-04: Heading Level Hierarchy & Document Outline
- **Standard:** WCAG 2.2 Success Criterion 1.3.1 (Info and Relationships) & 2.4.6 (Headings and Labels).
- **Checks:**
  - Enforces exactly one `<h1>` per page. Flags missing `<h1>` or duplicate multiple `<h1>` elements.
  - Analyzes the sequential heading ladder (`<h1>` through `<h6>`).
  - Detects heading level skips greater than 1 (e.g. `<h2>` followed directly by `<h4>`, skipping `<h3>`).
- **Severity:** Medium (`heading-jump`, `missing-h1`, `multiple-h1`).
- **Remediation:** Structure content using hierarchical semantic headings (`h1` -> `h2` -> `h3`) without skipping levels.

### Rule A11Y-05: Document Language Declaration
- **Standard:** WCAG 2.2 Success Criterion 3.1.1 (Language of Page).
- **Checks:**
  - Inspects `<html lang="...">`.
  - Verifies the attribute is present, non-empty, and conforms to BCP 47 language tags (e.g. `en`, `en-US`, `es`).
- **Severity:** Low (`missing-lang`).
- **Remediation:** Ensure `<html lang="en">` is rendered on the root element.

### Rule A11Y-06: Mobile Zoom & Viewport Scalability
- **Standard:** WCAG 2.2 Success Criterion 1.4.4 (Resize Text).
- **Checks:**
  - Inspects `<meta name="viewport">`.
  - Flags directives that restrict user zoom: `user-scalable=no`, `user-scalable=0`, `maximum-scale=1`, or `maximum-scale=1.0`.
- **Severity:** Critical (`viewport-zoom-disabled`).
- **Remediation:** Use standard responsive viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.

---

## 3. Category 2: Technical SEO & Metadata

Weight: **35%** of Overall Score.

### Rule SEO-01: Document Title Tag
- **Standard:** Google Search Central Title Guidelines & W3C HTML5.
- **Checks:**
  - Inspects `<title>` in `<head>`.
  - Checks character length:
    - Target: **30 to 65 characters**.
    - Flags `< 20` characters as too short / low keyword relevance.
    - Flags `> 65` characters as truncated by Google SERP snippet limits.
  - Flags placeholder / corrupt values: `undefined`, `NaN`, `null`, `[object Object]`.
- **Severity:** High (`missing-title`), Medium (`title-too-long` / `title-too-short`).

### Rule SEO-02: Meta Description
- **Standard:** Google Search Central Snippet Guidelines.
- **Checks:**
  - Inspects `<meta name="description" content="...">`.
  - Checks character length:
    - Target: **70 to 160 characters**.
    - Flags missing description or descriptions `< 50` characters.
    - Flags descriptions `> 165` characters as vulnerable to SERP ellipsis truncation.
- **Severity:** Medium (`missing-description`, `description-length`).

### Rule SEO-03: Canonical URL Integrity
- **Standard:** RFC 6596 (The Canonical Link Relation).
- **Checks:**
  - Inspects `<link rel="canonical" href="...">`.
  - Validates full absolute URL syntax (`http:` or `https:`).
  - Checks self-referencing accuracy: matches the requested URL origin and normalized pathname.
  - Flags relative canonical URLs or mismatched domains.
- **Severity:** High (`missing-canonical`, `mismatched-canonical`).

### Rule SEO-04: Robots Meta Directives
- **Standard:** Robots Exclusion Protocol & Google Search Central.
- **Checks:**
  - Inspects `<meta name="robots" content="...">`.
  - Flags unexpected `noindex` or `none` directives on production pages.
- **Severity:** High (`unexpected-noindex` on indexable targets).

---

## 4. Category 3: Social & Structured Data

### Rule SOC-01: Open Graph Protocol (OG)
- **Standard:** Open Graph Protocol (`ogp.me`).
- **Checks:**
  - `og:title`: Presence and non-empty content.
  - `og:description`: Presence and non-empty content.
  - `og:image`: Presence, valid absolute URL (`https://...`), and non-broken resource.
  - `og:url`: Presence and matching canonical URL.
- **Severity:** Medium (`missing-og-tags`, `relative-og-image`).

### Rule SOC-02: Twitter Card Meta
- **Standard:** Twitter Developer Documentation (Cards Markup).
- **Checks:**
  - `twitter:card`: Presence (e.g. `summary_large_image` or `summary`).
  - `twitter:title`, `twitter:description`, `twitter:image`.
- **Severity:** Low (`missing-twitter-card`).

### Rule STR-01: Schema.org JSON-LD Validation
- **Standard:** Schema.org & Google Rich Results Specification.
- **Checks:**
  - Finds all `<script type="application/ld+json">`.
  - Validates JSON parse syntax (flags trailing commas, unescaped characters).
  - Recursively traverses root objects and `@graph` containers.
  - Records all declared `@type` entities (e.g. `WebApplication`, `WebSite`, `Organization`, `FAQPage`).
- **Severity:** High (`invalid-json-ld-syntax`), Medium (`missing-structured-data`).

---

## 5. Category 4: Runtime Health & Technical Hygiene

Weight: **35%** of Overall Score.

### Rule TEC-01: Client-Side Console Errors & Exceptions
- **Standard:** Clean JavaScript execution.
- **Checks:**
  - Listens to Puppeteer `page.on('console')` for `msg.type() === 'error'`.
  - Listens to `page.on('pageerror')` for unhandled window runtime exceptions.
  - Captures error stack traces and logs the offending file/line.
- **Severity:** Critical (`js-runtime-error`, `console-error`).

### Rule TEC-02: Network Asset Failures (4xx / 5xx)
- **Standard:** Complete asset delivery.
- **Checks:**
  - Tracks all network responses for scripts, styles, fonts, and images.
  - Flags any asset returning HTTP status $\ge 400$.
- **Severity:** High (`broken-asset`).

### Rule TEC-03: Broken Internal Hyperlinks
- **Standard:** Zero broken navigation links.
- **Checks:**
  - Scrapes all internal `<a href="...">` elements on the rendered page.
  - Verifies targets resolve cleanly without 404, 500, or invalid scheme errors.
- **Severity:** High (`broken-internal-link`).

### Rule TEC-04: Mixed Content Detection
- **Standard:** W3C Mixed Content Recommendation.
- **Checks:**
  - When audited origin is `https://`, flags any subresource (scripts, stylesheets, images, iframes) loaded over insecure `http://`.
- **Severity:** Critical (`mixed-content-insecure`).
