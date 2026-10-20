# NumanX Tools Hub — Repository Cleanup Inventory (Phase 1 Baseline)

**Generated:** October 20, 2026  
**Auditor / Architect:** Senior Software Architect & Repository Maintainer  
**Phase:** Phase 1 — Safety & Baseline Inspection Only (Non-destructive)  

---

## A. Baseline Project Status

### 1. Git Repository State
- **Repository Root:** `C:/numan/Numanx-projacts/numanx-tools-hub`
- **Current Branch:** `master` (synchronized with `origin/master`)
- **Existing Branches:**
  - `master` (active head: `552251f` - *feat(qa): integrate Omega Site Audit Pro universal crawler, 301 redirects, schema graph, and word counter fixes*)
  - `backup/godtier-redesign` (commit: `de57849` - *backup: GodTier overhaul and all WIP uncommitted changes*)
- **Working Tree State:** Contains **98 modified tracked files** and **5 untracked entries**.
  - *Recommendation:* Prior to any Phase 2 destructive cleanup, create a dedicated cleanup branch:
    ```bash
    git checkout -b refactor/repository-cleanup
    ```
  - *Strict Safety Directive:* Never execute `git reset --hard`, `git clean -fd`, or `git checkout -- .`. All existing uncommitted application enhancements must remain intact.

### 2. Untracked Working Tree Entries
1. `.agents/skills/` (Omega Site Audit Pro agent skill metadata)
2. `public/images/guides/` (`numanx-guide.jpg`)
3. `public/noise.png` (hero texture overlay)
4. `src/components/Breadcrumb.astro` (newly developed navigation component)
5. `tools/` (standalone `omega-audit-pro` tool codebase)

### 3. Ignored Directories & Files (`.gitignore`)
- `dist/` (build output)
- `.astro/` (Astro runtime and generated types)
- `node_modules/` (npm dependencies)
- `.wrangler/` (Cloudflare Pages deployment temporary cache)
- `audit-reports/` (Omega Site Audit Pro output reports)
- `.env`, `.env.*` (local environment configurations)
- `docs/PRIVATE.md` (private project notes)
- `indexing-pages.md` (SEO indexing tracking log)

---

## B. Repository Structure & Classification

| Directory | Classification | Purpose & Status |
| :--- | :--- | :--- |
| `src/` | **Production Source** | Astro pages, layouts, UI components, data definitions, styles, web workers, and client utilities. |
| `public/` | **Production Source** | Static public assets served at root (icons, favicons, manifests, robots.txt, llms.txt, headers). |
| `functions/` | **Production Source** | Cloudflare Pages Functions serverless endpoints (`functions/api/subscribe.ts`). |
| `scripts/` | **Development Infrastructure** | Production & QA automation tools (`audit-static.mjs`, `audit-site.mjs`, `ping-indexnow.mjs`, `submit-indexnow.mjs`). |
| `tests/` | **Development Infrastructure** | Vitest unit and integration test suites. |
| `src/data/__tests__/`, `src/lib/__tests__/` | **Development Infrastructure** | Data model and client-storage test suites. |
| `.github/` | **Development Infrastructure** | CI/CD automation workflows. |
| `docs/` | **Documentation** | System architecture, audit notes (`OMEGA_AUDIT.md`), and cleanup documentation. |
| Root `.md` files (17 files) | **Documentation / Strategy** | Product roadmaps, AdSense playbook, GSC indexing strategy, deployment guides. |
| `dist/`, `.astro/`, `node_modules/` | **Generated / Dependencies** | Transient artifacts produced by build and development processes. |
| `audit-reports/` | **Generated QA Artifacts** | HTML, JSON, and CSV test crawler reports. |
| `public/public/` | **Suspicious / Duplicate** | Accidental nested directory mirroring root `public/` contents. |
| `src/data/repo-clone/` | **Suspicious / Orphan** | Outdated snapshot of `tools.ts` from a previous repository clone. |
| `tools/` | **Suspicious / Duplicate** | Nested standalone `omega-audit-pro` repository duplicate. |
| `.agents/` | **Historical / Temporary** | 28 directories of past agent prompt briefings, handoffs, and verification transcripts. |

---

## C. Repository Baseline File & Size Counts

*Calculated across the entire repository, strictly excluding `node_modules`, `dist`, `.astro`, and `.git`.*

| Metric | Count / Size | Details |
| :--- | :--- | :--- |
| **Total Non-Ignored Files** | **522 files** | Complete repository footprint |
| **Total Repository Size** | **46.21 MB** | ~31 MB accounted for by unoptimized / duplicate PNGs |
| **Astro Template Files (`.astro`)** | **147 files** | 72 tool pages, 57 components, 2 layouts, 16 root/sub pages |
| **TypeScript Files (`.ts`)** | **18 files** | Data definitions, API routes, library utilities, test specs |
| **JavaScript Files (`.js`, `.mjs`)** | **33 files** | Web workers, scripts, configs, utilities |
| **CSS Stylesheets (`.css`)** | **2 files** | `global.css`, `design-tokens.css` |
| **Markdown Documents (`.md`)** | **167 files** | 16 blog posts, 4 guides, 1 comparison, 17 root docs, 123 agent docs |
| **Image Assets** | **89 files** | WebP, PNG, SVG, ICO, JPG across `public/` and `src/assets/` |
| **Tool Pages** | **72 pages** | 71 functional tool pages + 1 tools directory index |
| **Blog Posts** | **16 posts** | Markdown articles located in `src/pages/blog/` |
| **Components** | **57 components** | UI atoms, drawers, tool headers, ads, search modal, dock |
| **Utilities & Libs** | **9 modules** | Image processing, storage, analytics, token helpers |
| **Web Workers** | **2 workers** | `ai-worker.js`, `imageProcessor.worker.js` |
| **API Endpoints** | **4 endpoints** | `contact`, `feedback`, `scan-sheet`, `subscribe` |
| **Test Suites** | **10 files** | 6 active Vitest suites + 4 Omega audit tests |

---

## D. Suspicious & Duplicate Directories

### 1. `public/public/` (High-Confidence Accidental Nesting)
- **Status:** Complete accidental duplicate directory.
- **Size:** ~750 KB across 27 files.
- **Contents:**
  - Duplicate root icons: `apple-touch-icon.png`, `apple-touch-icon.svg`, `favicon.ico`, `favicon.png`, `favicon.svg`, `icon-192.png`, `icon-192.svg`, `icon-512.png`.
  - Duplicate site meta: `manifest.json`, `robots.txt`, `sw.js`, `google56b08745d0fdbc9e.html`, `og-default-1200.png`, `og-default.svg`.
  - Duplicate blog images: `public/public/images/blog/*.webp` (14 duplicate webp files matching `public/images/blog/`).
- **Import Verification:** Searched entire `src/` codebase for `public/public` and `/public/` — **0 references found**.
- **Assessment:** Entirely safe to remove in Phase 2.

### 2. `src/data/repo-clone/` (Orphan Historical Clone)
- **Status:** Abandoned snapshot.
- **Size:** 36,825 bytes.
- **Contents:** `src/data/repo-clone/src/data/tools.ts` (contains an outdated version of `tools.ts` with fewer tools than canonical).
- **Import Verification:**
  - Production code imports: **0 references**.
  - `tsconfig.json`: Explicitly excluded (`"exclude": [..., "src/data/repo-clone"]`).
- **Canonical File:** `src/data/tools.ts` (52,011 bytes, defining all 71 tools and categories).
- **Assessment:** Safe to remove in Phase 2.

### 3. `tools/omega-audit-pro/` (Nested Tool Repository)
- **Status:** Untracked nested project directory.
- **Size:** ~130 KB across 16 files.
- **Contents:** A standalone npm package version of Omega Site Audit Pro (`package.json`, `docs/`, `examples/`, `scripts/`, `src/`, `tests/`).
- **Relationship to Project:** The canonical site audit script used by `npm run audit:site:pro` is already integrated directly into `scripts/audit-site.mjs`.
- **Import Verification:** No production files in `src/` depend on `tools/omega-audit-pro/`.
- **Assessment:** Safe to archive or exclude from source repository.

---

## E. Potential Duplicate & Orphan Public Assets

### 1. Hash-Identified True Duplicates (24 MD5 Duplicate Groups)
Verification performed using cryptographic MD5 content hashing:

| Group | File Size | Canonical Production Path | Duplicate / Orphan Path |
| :--- | :--- | :--- | :--- |
| **Group 1** | 6.7 KB | `public/apple-touch-icon.png` | `public/public/apple-touch-icon.png` |
| **Group 2** | 1.1 KB | `public/favicon.ico` | `public/public/favicon.ico` |
| **Group 3** | 0.8 KB | `public/favicon.png` | `public/public/favicon.png` |
| **Group 4** | 55 B | `public/google56b08745d0fdbc9e.html` | `public/public/google56b08745d0fdbc9e.html` |
| **Group 5** | 5.5 KB | `public/icon-192.png` | `public/public/icon-192.png` |
| **Group 6** | 21.9 KB | `public/icon-512.png` | `public/public/icon-512.png` |
| **Group 7** | 3.7 KB | `public/images/author-numan.webp` | `public/public/images/author-numan.webp` |
| **Group 8** | 42.7 KB | `public/images/blog/age-calculator-fun-facts-birthday.webp` | `public/public/images/blog/age-calculator-fun-facts-birthday.webp` |
| **Group 9** | 38.4 KB | `public/images/blog/best-ai-tools-for-students.webp` | `public/public/images/blog/best-ai-tools-for-students.webp` |
| **Group 10** | 36.0 KB | `public/images/blog/best-free-image-tools-2026.webp` | `public/public/images/blog/best-free-image-tools-2026.webp` |
| **Group 11** | 36.8 KB | `public/images/blog/best-youtube-tools-for-creators.webp` | `public/images/blog/why-offline-first-web-tools-matter.webp`<br>`public/public/images/blog/best-youtube-tools-for-creators.webp` |
| **Group 12** | 38.4 KB | `public/images/blog/complete-guide-password-security.webp` | `public/public/images/blog/complete-guide-password-security.webp` |
| **Group 13** | 39.4 KB | `public/images/blog/cricket-run-rate-beginners-guide.webp` | `public/public/images/blog/cricket-run-rate-beginners-guide.webp` |
| **Group 14** | **2,415.2 KB** | `public/images/blog/cricket-run-rate-beginners-guide.webp.png` | `public/images/blog/Gemini_Generated_Image_7gvd9y7gvd9y7gvd.png` |
| **Group 15** | **1,732.7 KB** | `public/images/blog/Gemini_Generated_Image_103rud103rud103r.png` | `public/images/blog/Gemini_Generated_Image_103rud103rud103r (1).png` |
| **Group 16** | **2,184.7 KB** | `public/images/blog/Gemini_Generated_Image_h9ig9vh9ig9vh9ig.png` | `public/images/blog/Gemini_Generated_Image_h9ig9vh9ig9vh9ig (1).png`<br>`public/images/blog/Gemini_Generated_Image_h9ig9vh9ig9vh9ig (2).png` |
| **Group 17** | 40.8 KB | `public/images/blog/top-10-ai-tools-content-creators-2026.webp` | `public/images/blog/harnessing-ai-for-better-writing.webp`<br>`public/public/images/blog/top-10-ai-tools-content-creators-2026.webp` |
| **Group 18** | 38.3 KB | `public/images/blog/hashtag-strategy-viral-growth.webp` | `public/public/images/blog/hashtag-strategy-viral-growth.webp` |
| **Group 19** | 37.6 KB | `public/images/blog/how-to-compress-images.webp` | `public/public/images/blog/how-to-compress-images.webp` |
| **Group 20** | 37.3 KB | `public/images/blog/how-to-optimize-images-for-web.webp` | `public/public/images/blog/how-to-optimize-images-for-web.webp` |
| **Group 21** | 39.8 KB | `public/images/blog/how-to-resize-images-social-media.webp` | `public/public/images/blog/how-to-resize-images-social-media.webp` |
| **Group 22** | 37.0 KB | `public/images/blog/image-compression-without-losing-quality.webp` | `public/public/images/blog/image-compression-without-losing-quality.webp` |
| **Group 23** | 38.8 KB | `public/images/blog/qr-codes-marketing-best-practices.webp` | `public/public/images/blog/qr-codes-marketing-best-practices.webp` |
| **Group 24** | 37.1 KB | `public/images/blog/webp-vs-png-vs-jpg-which-format-wins.webp` | `public/public/images/blog/webp-vs-png-vs-jpg-which-format-wins.webp` |

### 2. High-Capacity Orphan AI Generated Images (>25 MB)
The following 14 images reside in `public/images/blog/`. A global codebase search confirmed **0 references** across all `.astro`, `.md`, `.ts`, and `.js` files:
1. `Gemini_Generated_Image_103rud103rud103r.png` (1.77 MB)
2. `Gemini_Generated_Image_103rud103rud103r (1).png` (1.77 MB)
3. `Gemini_Generated_Image_7gvd9y7gvd9y7gvd.png` (2.47 MB)
4. `Gemini_Generated_Image_aj1eseaj1eseaj1e.png` (1.85 MB)
5. `Gemini_Generated_Image_cfzdf1cfzdf1cfzd.png` (1.93 MB)
6. `Gemini_Generated_Image_do6a27do6a27do6a.png` (2.03 MB)
7. `Gemini_Generated_Image_h9ig9vh9ig9vh9ig.png` (2.24 MB)
8. `Gemini_Generated_Image_h9ig9vh9ig9vh9ig (1).png` (2.24 MB)
9. `Gemini_Generated_Image_h9ig9vh9ig9vh9ig (2).png` (2.24 MB)
10. `Gemini_Generated_Image_homnhwhomnhwhomn.png` (1.72 MB)
11. `Gemini_Generated_Image_ndbk4pndbk4pndbk.png` (2.06 MB)
12. `Gemini_Generated_Image_q1jhuqq1jhuqq1jh.png` (2.30 MB)
13. `Gemini_Generated_Image_q1z6mq1z6mq1z6mq.png` (1.98 MB)
14. `Gemini_Generated_Image_v2ua0hv2ua0hv2ua.png` (2.13 MB)

### 3. Double-Extension Files (>6.7 MB)
1. `public/images/blog/age-calculator-fun-facts-birthday.webp.png` (2.01 MB)
2. `public/images/blog/best-ai-tools-for-students.webp.png` (2.26 MB)
3. `public/images/blog/cricket-run-rate-beginners-guide.webp.png` (2.47 MB)
*(All blog posts reference the corresponding `.webp` files; the `.webp.png` files are unreferenced).*

---

## F. Historical & Agent Artifacts

### 1. `.agents/` Directory Structure (147 Files, ~337 KB)
- **Historical Session Folders (26 directories):**
  `.agents/auditor_rem/`, `.agents/challenger_1/`, `.agents/challenger_1_repl/`, `.agents/challenger_2/`, `.agents/challenger_rem_1/`, `.agents/challenger_rem_2/`, `.agents/explorer_analysis/`, `.agents/explorer_blog_images/`, `.agents/explorer_blog_polish/`, `.agents/explorer_interactions/`, `.agents/explorer_layout/`, `.agents/explorer_r1_r2/`, `.agents/explorer_r1_r2_repl/`, `.agents/explorer_r3/`, `.agents/explorer_r4/`, `.agents/explorer_ux_upgrades/`, `.agents/forensic_auditor/`, `.agents/orchestrator/`, `.agents/orchestrator_audit/`, `.agents/orchestrator_audit_gen2/`, `.agents/reviewer_1/`, `.agents/reviewer_2/`, `.agents/reviewer_rem_1/`, `.agents/reviewer_rem_2/`, `.agents/sentinel/`, `.agents/victory_verifier/`, `.agents/worker_remediation/`, `.agents/worker_upgrades/`.
- **Classification:** **ARCHIVE / REMOVE FROM PRODUCTION REPOSITORY**  
  *Evidence:* Not imported by any production source; not packaged into `dist/`; excluded in `tsconfig.json`.

### 2. Preserved Agent Knowledge Rules & Skills
- `.agents/rules/editor-design-and-alignment.md`: Referenced by `GEMINI.md`.
  - *Recommendation:* Keep or relocate to `docs/rules/editor-design-and-alignment.md`.
- `.agents/skills/omega-site-audit-pro/`: Agent skill specification for site crawling.
  - *Recommendation:* Keep in agent configuration.

### 3. Root Transient Diagnostic Files
- `print-assertions.js` (675 bytes): One-off Vitest task printing utility. Safe to remove in Phase 2.
- `audit-routes.example.txt` (252 bytes): Route template example. Safe to move to `docs/` or remove.
- `test-results.json` (9.2 KB): Stale local Vitest run output. Safe to add to `.gitignore` and remove from root.

---

## G. Quality Baseline & Verification Results

All package scripts were executed in their raw, unmodified state without altering any project files:

| Command | Status | Exit Code | Diagnostics & Findings |
| :--- | :---: | :---: | :--- |
| **`npm run test`** | **PASSED** | `0` | **43 / 43 unit tests passed** across 6 test suites (runtime: 1.66s). |
| **`npm run build`** | **PASSED** | `0` | **113 static pages successfully compiled** into `dist/` in 34.47s. Zero fatal compile errors. |
| **`npm run audit`** | **PASSED** | `0` | **Pre-build static audit 100% clean:** 0 mojibake, all 71 tools metadata complete, direct canonical links verified. |
| **`npm run lint`** | **FAILED** | `1` | **7 problems (5 errors, 2 warnings)**:<br>• `AdSlot.astro:25`: JSX expressions must have one parent element.<br>• `MonetizationSlot.astro:224`: Unexpected token.<br>• `ai-code-assistant.astro:238`: Unexpected token before `<script>`.<br>• `list-randomizer.astro:221`: Unexpected token before `<script>`.<br>• `lorem-ipsum.astro:375`: Unexpected token before `<script>`.<br>• 2 `no-set-html-directive` warnings in `SEO.astro` & `SeoHead.astro`. |
| **`npm run typecheck`** | **FAILED** | `1` | **1,297 TypeScript errors, 835 hints** across 197 files. Errors predominantly stem from client-side DOM element casting (`HTMLElement` vs `HTMLInputElement`) and window property typing in inline tool scripts. |
| **`npm run format:check`** | **FAILED** | `1` | Style differences across multiple files; 1 parser syntax error in `src/components/ToolsDirectoryGrid.astro:6` (`<!-- HTML comment -->` directly inside JSX fragment). |

---

## H. Route Baseline

*Extracted directly from production static build output (`dist/`):*

| Route Category | Active Route Count | Description / Scope |
| :--- | :---: | :--- |
| **Total HTML Routes** | **115** | Complete index of static HTML endpoints generated |
| **Tool Detail Routes** | **71** | Individual browser-based client tools |
| **Tool Hub Index** | **1** | `/tools/` main directory |
| **Blog Articles** | **16** | Markdown articles in `/blog/[slug]/` |
| **Blog Index** | **1** | `/blog/` listing and category search |
| **Category Routes** | **6** | `/category/[category]/` (*image-tools, ai-tools, creator-tools, utility-tools, cricket-tools, developer-tools*) |
| **Guide Pages** | **4** | `/guides/` index + 3 markdown guides |
| **Comparison Pages** | **2** | `/comparisons/` index + `webp-vs-png-vs-jpg` |
| **Core & Utility Pages** | **14** | `/`, `/about/`, `/contact/`, `/dashboard/`, `/favorites/`, `/search/`, `/chat/`, `/recommended/`, `/offline/`, `/privacy-policy/`, `/terms-of-service/`, `/404.html` |
| **API Endpoints** | **4** | `/api/contact`, `/api/feedback`, `/api/scan-sheet`, `/api/subscribe` |

---

## I. Cleanup Risk Classification

### 1. SAFE TO CLEAN (Zero Risk — Redundant / Orphaned / Duplicate)
- `public/public/` directory (entire 750 KB duplicate tree).
- `src/data/repo-clone/` directory (orphaned 36.8 KB snapshot).
- Duplicate Gemini PNG images in `public/images/blog/`:
  - `Gemini_Generated_Image_103rud103rud103r (1).png`
  - `Gemini_Generated_Image_h9ig9vh9ig9vh9ig (1).png`
  - `Gemini_Generated_Image_h9ig9vh9ig9vh9ig (2).png`
- Double extension PNGs:
  - `age-calculator-fun-facts-birthday.webp.png`
  - `best-ai-tools-for-students.webp.png`
  - `cricket-run-rate-beginners-guide.webp.png`
- Root temporary diagnostic scripts:
  - `print-assertions.js`
  - `audit-routes.example.txt`
  - `test-results.json`

### 2. LIKELY SAFE — VERIFY FIRST (Low Risk — Verify Backups First)
- Remaining 11 unreferenced `Gemini_Generated_Image_*.png` files in `public/images/blog/` (~20 MB). Verify whether any external marketing or documentation relies on them before archival.
- Duplicate SVGs in `public/images/blog/*.svg` where Markdown frontmatter only points to `.webp`.
- `.agents/` session execution directories (archive to an offline backup or external repo).
- Nested `tools/omega-audit-pro/` directory (verify if any developer runs standalone tests from it).

### 3. DO NOT TOUCH (High Risk — Production & Core Critical)
- All 71 tool pages in `src/pages/tools/`.
- All 16 blog posts in `src/pages/blog/`.
- `src/data/tools.ts` (canonical data backbone of the application).
- `src/layouts/MainLayout.astro` & `src/layouts/BlogLayout.astro`.
- `src/components/ToolHeader.astro` & `src/components/Breadcrumb.astro`.
- `functions/api/subscribe.ts` & `src/pages/api/*`.
- `.agents/rules/editor-design-and-alignment.md` (mandatory design compliance rules).
- `scripts/audit-static.mjs` & `scripts/audit-site.mjs` (QA audit engines).

### 4. UNKNOWN / NEEDS INVESTIGATION (Medium Risk)
- `public/images/author-numan.png` (660 KB PNG vs 3.8 KB WebP) — check if any OpenGraph tag or fallback specifically requests the `.png` extension.
- `public/images/hero_3d_graphic.png` (703 KB) — check if utilized dynamically in `ThreeDScene.astro` or Spline fallback.
- Multiple root Markdown playbooks (17 files) — determine whether to consolidate into a structured `docs/playbooks/` folder during Phase 2.

---
*Inventory successfully established. Ready for Phase 2 planning upon user authorization.*
