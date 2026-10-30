# NumanX Tools — DevOps, CI/CD, & Edge Deployment Runbook

This document is the definitive Cloud Ops manual for NumanX Tools Hub. It defines how code moves from a developer's local machine to Cloudflare's global edge network in < 60 seconds.

---

## 1. Infrastructure Overview

- **Host Platform:** Cloudflare Pages
- **Compute Layer:** Cloudflare Edge Network (Static Delivery)
- **Build Engine:** Astro SSG (`npm run build`)
- **DNS Registrar:** Cloudflare (Proxied `Orange Cloud` mode)
- **Domain:** `toolshub.numanxstudio.com`

---

## 2. Continuous Integration / Continuous Deployment (CI/CD)

The deployment pipeline is fully automated via Cloudflare Pages GitHub Integration.

### 2.1 The Build Pipeline
When a commit is pushed to the `main` branch, Cloudflare Pages automatically triggers the following environment:
- **Node.js Version:** `v22.12.0` (Strictly enforced via environment variables)
- **Install Command:** `npm ci` (Ensures deterministic installs from `package-lock.json`)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2.2 Staging Environments (Preview Deployments)
Any Pull Request or push to a branch other than `main` triggers a **Preview Deployment**.
- Cloudflare generates a unique URL (e.g., `1a2b3c4d.numanx-tools.pages.dev`).
- Use this URL to run automated Lighthouse tests before merging into production.

---

## 3. Edge Caching & Asset Optimization Rules

To achieve a 100/100 Lighthouse Performance score, Cloudflare is configured with strict caching rules.

### 3.1 Immutable Asset Caching (`/_astro/*`)
Astro automatically bundles and hashes all CSS and JS files (e.g., `main.8f7d9a.js`). 
- **Rule:** Cache at the Edge for **1 Year** (`Cache-Control: public, max-age=31536000, immutable`).
- **Why:** The file hash changes on every build, so users will never serve stale CSS/JS, but they will never re-download unchanged files.

### 3.2 HTML Caching
- **Rule:** Cache at Edge with immediate invalidation on deployment.
- **Why:** Allows TTFB (Time to First Byte) to remain < 50ms globally, while ensuring users see the newest tools the second a build finishes.

### 3.3 Compression Protocols
- **Brotli:** Enabled by default on Cloudflare. 
- **Gzip:** Fallback enabled for older browsers.

---

## 4. Environment Variables & Security Protocols

### 4.1 Production Environment Variables
Set these strictly inside the Cloudflare Pages Dashboard (Settings > Environment Variables), never in the codebase.

| Variable | Usage | Environment |
| --- | --- | --- |
| `NODE_VERSION` | Forces Cloudflare to use Node 22+ for the Astro build. | All |
| `PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (`G-XXXXXXXXX`). | Production |
| `SECRET_WEBHOOK_URL` | (Future) Triggers Discord notifications on build failure. | Production |

### 4.2 Security Headers (Cloudflare Page Rules)
To prevent Clickjacking and MIME-type sniffing, Cloudflare Page Rules must inject the following headers on all `/*` responses:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## 5. Rollback & Disaster Recovery Procedures

### 5.1 Instant Rollback (The "Oh Sh*t" Button)
If a critical bug is merged into `main` and breaks the UI:
1. Open Cloudflare Pages Dashboard > NumanX Tools > **Deployments**.
2. Locate the previous successful deployment.
3. Click **"Restore to this deployment"**.
4. The global edge cache is instantly reverted (< 3 seconds) without requiring a new Astro build.

### 5.2 Build Failure Diagnostics
If `npm run build` fails in CI/CD:
1. **Check Node Version:** Ensure Cloudflare hasn't defaulted to an older Node environment.
2. **Check TypeScript:** Astro strictly enforces TS. A missing type in `src/data/appsData.ts` will intentionally crash the build to prevent runtime errors. Fix locally with `npx astro check`.
3. **Check Dynamic Routes:** Ensure `getStaticPaths()` in `[slug].astro` returns valid objects for every single tool listed in the matrix.
