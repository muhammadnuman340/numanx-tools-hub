# SEO Roadmap — NumanX Tools

## Growth Targets

### 50 Tool Pages
- Expand from 11 to 50+ tools across categories (Image, Text, SEO, Developer, Math, Cricket, Generators)
- Each tool page targets: `tools/{tool-name}/` with unique meta description, H1, and schema
- Programmatic generation for parameterized tools (e.g., `color-picker/`, `unit-converter/`, `base64-encode/`)

### 100 Blog Articles
- Publish 4–8 articles/month targeting long-tail keywords
- Categories: tool tutorials, industry comparisons, how-to guides, cricket analytics
- Internal link from relevant tool pages to blog articles and vice versa

### Internal Linking Strategy
- Tool pages link to related tools (e.g., JPG→PNG links to PNG→WebP)
- Blog articles link to relevant tools
- Tools listing page link from every tool page footer
- Breadcrumb navigation on all tool pages

### Programmatic SEO
- Country-specific pages: `/tools/us/age-calculator`, `/tools/uk/age-calculator` (localized)
- Cricket series-specific pages: `/tools/ipl-run-rate-calculator`, `/tools/wc-strike-rate-calculator`
- Template-based tool pages sharing the same Astro layout with different config

## Technical Priorities

### Lighthouse Targets
- SEO: 100 (already structured for this)
- Performance: 95+ (minify JS, lazy load non-critical assets, inline critical CSS)
- Accessibility: 95+ (proper ARIA labels, focus states, color contrast)
- Best Practices: 100

### Core Web Vitals
- LCP: < 1.5s (optimize hero images/backgrounds, preload key resources)
- FID/INP: < 100ms (defer non-critical JS, avoid long tasks)
- CLS: < 0.05 (set explicit dimensions on all images, avoid layout shifts)

### Next Actions
1. Replace placeholder `VERIFICATION_CODE` in SEO.astro with actual GSC verification code
2. Create `/og-default.png` Open Graph image (1200×630)
3. Add breadcrumb schema to tool pages
4. Add FAQ schema to tool pages with FAQ accordions
5. Generate favicon PNGs at multiple sizes (32×32, 192×192, 512×512)
6. Add `next/prev` pagination links to blog listing if paginated
