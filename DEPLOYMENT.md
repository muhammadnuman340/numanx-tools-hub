# Cloudflare Deployment Guide — NumanX Tools

## Prerequisites
- Node.js >= 22.12.0
- Git repository initialized
- Cloudflare account (free tier)
- Domain: `numanxtools.site` (or any custom domain)

---

## Step 1: Build the Project

```bash
npm run build
```

Output goes to `dist/` (configured as Astro default).  
Build produces **25 static pages** with zero JavaScript framework overhead.

**Expected output:**
```
25 page(s) built in ~6s
✓ Complete!
```

---

## Step 2: Deploy to Cloudflare Pages

### Option A: Direct Upload (Quick Start)

1. Go to **Cloudflare Dashboard > Workers & Pages > Pages**
2. Click **Create > Upload assets**
3. Upload the entire `dist/` folder
4. Set project name: `numanx-tools`
5. No build command needed (pre-built)
6. Deploy

### Option B: Git Integration (Recommended)

1. Push your repo to GitHub/GitLab
2. In Cloudflare Pages, click **Create > Connect to Git**
3. Select your repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output** | `dist` |
| **Root directory** | `/` |
| **Node.js version** | 22 |

5. Click **Save and Deploy**

---

## Step 3: Custom Domain Setup

### 3.1 Add Domain in Cloudflare

1. In Cloudflare Pages > your project > **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `numanxtools.site`
4. Cloudflare will provide DNS records to add

### 3.2 DNS Configuration

At your domain registrar (e.g. Namecheap, GoDaddy):

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| CNAME | `@` | `numanx-tools.pages.dev` | Proxied (orange cloud) |
| CNAME | `www` | `numanx-tools.pages.dev` | Proxied (orange cloud) |

> **Important:** Cloudflare proxy (orange cloud) enables DDoS protection, SSL, and CDN caching.

### 3.3 SSL/TLS

- Cloudflare Pages auto-provisions SSL certificates
- Set SSL/TLS encryption mode to **Full** (not Flexible)
- Wait ~1 minute for certificate provisioning

### 3.4 Verify HTTPS

```
https://numanxtools.site    → should resolve
https://www.numanxtools.site → should redirect to apex
```

---

## Step 4: Post-Deployment Verification

### 4.1 Check All Routes

```
/                 → Homepage
/tools/           → Tools listing
/blog/            → Blog index
/about/           → About page
/contact/         → Contact page
/dashboard/       → Dashboard
/search/          → Search page
/privacy-policy/  → Privacy Policy
/terms-of-service/ → Terms
/404/             → 404 page (test with /nonexistent)
```

### 4.2 Verify Technical SEO

```
/robots.txt       → Googlebot/Bingbot rules
/sitemap.xml      → 25 URLs with priorities
```

### 4.3 Run Lighthouse Audit

- Open Chrome DevTools > Lighthouse
- Test on mobile and desktop
- **Target:** Performance 95+, SEO 95+, Accessibility 95+

---

## Step 5: Cloudflare Pages Configuration

### 5.1 SPA Routing (Not needed — static SSG)

Astro generates HTML files directly. No SPA fallback needed.

### 5.2 Security Headers (Optional)

To add security headers on Cloudflare Pages:

1. Go to **Cloudflare Dashboard > Rules > Page Rules**
2. Create rule for `numanxtools.site/*`
3. Add header: `X-Content-Type-Options: nosniff`
4. Add header: `X-Frame-Options: DENY`
5. Add header: `Referrer-Policy: strict-origin-when-cross-origin`

### 5.3 Compression

Cloudflare auto-enables Brotli and Gzip compression. No configuration needed.

### 5.4 Caching

Static assets in `_astro/` have content-based hashes → cache forever.  
HTML pages are served fresh via Cloudflare's default caching.

---

## Step 6: Environment Variables

For Analytics (optional):

```
PUBLIC_GA_ID=G-XXXXXXXXXX
```

Set this in Cloudflare Pages dashboard:
1. Project > **Settings** > **Environment variables**
2. Add variable: `PUBLIC_GA_ID`
3. Apply to **Production** branch

---

## Step 7: Ongoing Maintenance

### Update Content

1. Edit `.astro` files or `.md` blog posts
2. Run `npm run build`
3. Deploy updated `dist/` (or push to Git)

### Monitor

- **Cloudflare Analytics** — traffic, bandwidth, cache hit ratio
- **Google Search Console** — indexing, crawl errors
- **Lighthouse CI** — performance regression detection

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on page routes | Ensure all routes are in `dist/` — Astro SSG generates folders |
| SSL not working | Wait 1-2 minutes for Cloudflare cert provisioning |
| Domain not resolving | Check DNS propagation (can take 5-30 mins) |
| Build fails | Check Node.js version (22+), run `npm install` first |
| Analytics not firing | Verify `PUBLIC_GA_ID` env var is set in Cloudflare dashboard |
