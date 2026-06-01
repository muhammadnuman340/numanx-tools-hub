# NumanX Tools — Project Architecture & Roadmap

> **Mission**: A privacy-first, client-side platform of free online tools for creators, students, and builders. Every tool runs entirely in the browser — zero server uploads, zero data leaks, zero subscriptions.

---

## 1. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | [Astro](https://astro.build) | ^6.4.2 | Static site generator, island architecture |
| CSS | [Tailwind CSS](https://tailwindcss.com) | ^4.3.0 | Utility-first styling via `@tailwindcss/vite` |
| CSS Minifier | LightningCSS | – | Faster builds via `vite.build.cssMinify` |
| Icons | Inline SVG + Emoji | – | Zero icon library dependency |
| Fonts | Inter (Google Fonts) | – | System font stack fallback |
| QR Code | [qrcode](https://www.npmjs.com/package/qrcode) | ^1.5.4 | Client-side QR generation (toCanvas, toDataURL, toString) |
| Storage | localStorage (prefix: `nt_`) | – | Favorites, recently used, search history, tool usage |
| Analytics | Google Analytics 4 | – | Conditional via `PUBLIC_GA_ID` env var |
| Deployment | Cloudflare Pages | – | Static export to `dist/`, custom domain `numanxtools.site` |

### Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | SSG output, HTML compression, LightningCSS, Tailwind v4 plugin, scoped style strategy |
| `tsconfig.json` | Astro strict TypeScript preset |
| `package.json` | 3 dependencies + 4 scripts |

---

## 2. Directory Architecture

```
src/
├── assets/           # Static SVGs / images (astro.svg, background.svg)
├── components/
│   ├── ui/           # Design-system primitives (8 components)
│   └── *.astro       # Feature / app-level components (17 components)
├── data/
│   └── tools.ts      # Centralized tool registry (11 tools, 4 categories, helpers)
├── layouts/
│   ├── MainLayout.astro   # Primary layout (ambient bg, navbar, footer, search, back-to-top)
│   ├── BlogLayout.astro   # Blog article layout (ToC, sidebar, prose, share)
│   └── Layout.astro       # Minimal shell (unused in production)
├── lib/
│   └── storage.ts    # localStorage helpers (favorites, recently used, history, usage)
├── pages/
│   ├── index.astro         # Homepage V3 (12 sections, staggered animations)
│   ├── about.astro         # Company / founder / mission
│   ├── contact.astro       # Contact form + info
│   ├── dashboard.astro     # Platform analytics dashboard
│   ├── favorites.astro     # Client-side favorites grid
│   ├── search.astro        # Full-page search (tools + blog)
│   ├── privacy-policy.astro
│   ├── terms-of-service.astro
│   ├── 404.astro
│   ├── robots.txt.ts
│   ├── sitemap.xml.ts
│   ├── tools/
│   │   ├── index.astro     # All tools listing
│   │   └── 11 tool pages
│   ├── category/
│   │   └── [category].astro # 4 static category pages
│   └── blog/
│       ├── index.astro     # Blog index with URL-based category filtering
│       └── 14 .md articles
└── styles/
    ├── global.css           # Imports Tailwind + tokens, base styles, utilities
    └── design-tokens.css    # CSS custom properties, keyframes, glass utilities
```

### File Count

| Category | Count |
|----------|-------|
| UI primitives | 8 |
| Feature components | 17 |
| Layouts | 3 |
| Static pages | 10 |
| Dynamic category pages | 4 |
| Tool pages | 11 |
| Blog articles | 14 |
| System endpoints | 2 |
| CSS files | 2 |
| Data / lib files | 2 |
| **Total routes built** | **40** |

---

## 3. Route Map

| Route | Type | Layout | Schema |
|-------|------|--------|--------|
| `/` | Static | MainLayout | WebApplication |
| `/tools/` | Static | MainLayout | – |
| `/tools/[slug]/` | Static (×11) | MainLayout | SoftwareApplication |
| `/category/[category]/` | Static (×4) | MainLayout | – |
| `/blog/` | Static | MainLayout | – |
| `/blog/[slug]/` | Static (×14) | BlogLayout | Article |
| `/about/` | Static | MainLayout | – |
| `/contact/` | Static | MainLayout | – |
| `/dashboard/` | Static | MainLayout | – |
| `/favorites/` | Static | MainLayout | – |
| `/search/` | Static | MainLayout | – |
| `/privacy-policy/` | Static | MainLayout | – |
| `/terms-of-service/` | Static | MainLayout | – |
| `/404/` | Static | MainLayout | – |
| `/robots.txt` | Generated | – | – |
| `/sitemap.xml` | Generated | – | – |

---

## 4. Data Architecture

### Tool Registry (`src/data/tools.ts`)
Single source of truth for all 11 tools. Every page that references tools (search, categories, homepage, sitemap, related tools, dashboard) reads from this registry.

```typescript
interface Tool {
  id: string;              // e.g. "word-counter"
  name: string;            // display name
  description: string;     // short (meta/cards)
  longDescription: string; // (featured cards)
  category: "image-tools" | "creator-tools" | "utility-tools" | "cricket-tools";
  icon: string;            // emoji
  url: string;             // e.g. "/tools/word-counter/"
  isNew?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  keywords: string[];
  relatedIds: string[];    // cross-link IDs
}
```

**Helpers**: `getToolBySlug`, `getToolsByCategory`, `getRelatedTools`, `getCategoryInfo`, `getPopularTools`, `getFeaturedTools`, `getNewTools`.

### localStorage Schema (prefix: `nt_`)

| Key | Type | Max | Purpose |
|-----|------|-----|---------|
| `nt_favorites` | `string[]` | – | Saved tool slugs |
| `nt_recently_used` | `string[]` | 20 | Tool visit history |
| `nt_search_history` | `string[]` | 10 | Recent search queries |
| `nt_tool_usage` | `Record<string, number>` | – | Per-tool visit counts |
| `pwd_history` | `string[]` | – | Password generator history |
| `ht_favorites` | `string[]` | – | Hashtag generator favorites |

All storage functions in `src/lib/storage.ts` use try/catch for SSR safety.

---

## 5. Design System

### Tokens (`src/styles/design-tokens.css`)
All visual properties defined as CSS custom properties on `:root`:

| Category | Variables |
|----------|-----------|
| **Brand** | `purple-50` through `purple-950`, `blue-400/500/600`, `emerald-400/500`, `amber-400/500`, `red-400/500` |
| **Background** | `--bg-base` (`#0a0a0b`), `--bg-surface`, `--bg-elevated`, `--bg-overlay`, `--bg-glass` |
| **Text** | `--text-primary` through `--dim` (5 tiers) |
| **Border** | `--border-subtle`, `--border-default`, `--border-hover`, `--border-accent` |
| **Shadow** | `sm`/`md`/`lg`/`xl`/`2xl` + glow variants (purple/blue/emerald) |
| **Radius** | `sm`/`md`/`lg`/`xl`/`2xl`/`3xl`/`full` |
| **Transition** | `fast`(150ms)/`base`(200ms)/`slow`(300ms)/`spring`(500ms cubic-bezier) |
| **Z-index** | `base`/`dropdown`/`sticky`/`overlay`/`modal`/`toast` (100–400) |

### Glass System
Three utility classes for frosted-glass surfaces:
- `.glass` — `bg-white/[0.03] backdrop-blur-xl`
- `.glass-strong` — `bg-white/[0.05] backdrop-blur-2xl`
- `.glass-card` — hover variant with purple border highlight

### Animations (available as Tailwind v4 `animate-*` utilities)
`fadeIn`, `fadeInUp`, `fadeInDown`, `slideInRight`, `slideOutRight`, `scaleIn`, `pulse`, `spin`, `float` (10px), `subtle-float` (6px), `ping`, `shimmer`, `breathe`

---

## 6. Component Architecture

### UI Primitives (`src/components/ui/`)

| Component | Props | Variants | Slots |
|-----------|-------|----------|-------|
| **Accordion** | `items: {title, content}[]`, `class?` | Single-open, CSS grid-rows transition | – |
| **Badge** | `variant?`, `size?`, `class?` | 7 variants (`default`/`new`/`popular`/`pro`/`success`/`warning`/`info`), 2 sizes | default |
| **Button** | `variant?`, `size?`, `disabled?`, `loading?`, `href?`, `class?`, spread | 5 variants, 3 sizes, `<a>` or `<button>` | default |
| **Card** | `variant?`, `padding?`, `class?` | 3 variants (`default`/`glass`/`interactive`), 3 padding sizes | `image`, `badge`, default |
| **Drawer** | `id?`, `position?` | Left/right, data-attribute triggered | default |
| **Tabs** | `tabs: {id, label}[]`, `activeTab?`, `class?` | aria tablist/tabpanel pattern | – |
| **Toast** | `variant?`, `message?`, `duration?` | 4 variants, exposes `window.__showToast()` | – |
| **ValueCard** | `title`, `description`, `delay?` | Hover glow, underline expansion, stagger | `icon` |

### Feature Components (`src/components/`)

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **AdSlot** | Ad placeholder with format sizes | `format?`, `slot?` |
| **Analytics** | GA4 gtag.js injection | `id?` |
| **BackToTop** | Fixed scroll-to-top button | None (self-contained) |
| **CategoryCard** | Category display card | `title`, `description` |
| **CategoryHero** | Category page hero banner | `category: CategoryInfo` |
| **EmptyState** | Generic empty/fallback state | `icon?`, `title?`, `message?`, `actionLabel?`, `actionHref?` |
| **FavoriteButton** | Star toggle (localStorage) | `slug` |
| **Footer** | 4-column site footer | None |
| **HowToUse** | Numbered step-by-step guide | `steps: {num, title, desc}[]` |
| **Navbar** | Fixed glass navigation | None |
| **PopularPosts** | Top 5 blog posts sidebar | None (hardcoded) |
| **RelatedPosts** | 3 related blog articles | `currentSlug`, `category?`, `tags?` |
| **RelatedTools** | 3 related tools | `current: string` (slug) |
| **SEO** | Meta tags + JSON-LD structured data | `title`, `description`, `keywords`, `canonical`, `faq`, `breadcrumbs`, `toolSchema`, `articleSchema` |
| **SearchBar** | Modal search overlay (Ctrl+K) | None (self-contained) |
| **ShareBar** | Share + copy link buttons | None |
| **Skeleton** | Loading placeholder | `variant?`, `width?`, `height?`, `lines?` |
| **TableOfContents** | Sticky sidebar from h2/h3 | None |
| **ToolHeader** | Tool page hero + usage tracking | `title`, `gradient`, `desc`, `badge?`, `slug?` |

---

## 7. Phased Roadmap

### ✅ Phase 1 — Foundation (Complete)
- Centralized tool registry (`src/data/tools.ts`)
- CSS design token system (`design-tokens.css`)
- 8 UI primitive components
- Ambient background system (orbs, grid, vignette)
- Glassmorphism design language

### ✅ Phase 2 — Navigation (Complete)
- Fixed glass navbar with categories dropdown
- Mobile slide-out drawer
- Modal search overlay with keyboard navigation (Ctrl+K)
- Favorites link, "Get Started" CTA

### ✅ Phase 3 — Favorites + Recently Used (Complete)
- localStorage persistence layer (`src/lib/storage.ts`)
- Favorite toggle on every tool page
- Favorites page with dynamic grid
- Recently used tracking + display on homepage
- Tool usage analytics (per-tool visit counts)

### ✅ Phase 4 — Category Pages + SEO (Complete)
- 4 static category pages from registry
- SEO component with FAQ, Breadcrumb, SoftwareApplication, Article schema
- Dynamic sitemap.xml from registry + blog posts
- robots.txt with clean crawl rules

### ✅ Phase 5 — Homepage V3 + Dashboard (Complete)
- 12-section homepage with staggered fadeInUp animations
- Stats counters, testimonials, founder section, roadmap timeline
- Dashboard with tool table, activity chart, category analytics

### ✅ Phase 6 — Blog Platform (Complete)
- Blog layout with reading progress bar, ToC sidebar, related/popular posts
- 14 blog articles (SEO-optimized .md files)
- URL-based category filtering on blog index
- Author box with social share buttons

### ✅ Phase 7 — Monetization + Accessibility (Complete)
- AdSlot component with responsive/rectangle/horizontal/vertical formats
- WCAG AA: focus-visible rings, ARIA labels/roles, keyboard nav
- Reduced-motion and high-contrast media queries
- GA4 analytics integration

### 🔜 Phase 8 — Expansion Pipeline (Planned)
- 50→100→200 tool pages (see TOOL-ROADMAP.md)
- Premium/pro subscription tier with gated features
- AI Platform: text/image generation tools
- Cricket Analytics v2: series-level stats, team comparisons
- Creator Hub: asset libraries, templates, collaboration
- NumanX Operating Brain: cross-tool workflow automation

---

## 8. Performance Targets

| Metric | Target | Current Approach |
|--------|--------|-----------------|
| Lighthouse Performance | 95+ | Static SSG, LightningCSS, inline small stylesheets, no render-blocking resources |
| Lighthouse SEO | 95+ | JSON-LD schemas, meta tags, OG/Twitter Cards, semantic HTML, sitemap |
| Lighthouse Accessibility | 95+ | ARIA labels, focus-visible rings, keyboard nav, reduced-motion support, high-contrast mode |
| Lighthouse Best Practices | 95+ | HTTPS, no HTTP links, no deprecated APIs, secure context |
| Build time | <10s | 40 pages in ~8s with LightningCSS |
| Total JS | <200KB | ~179KB across all pages |
| Total page weight | <1MB | ~1MB total, mostly inlined |

---

## 9. Key Architecture Decisions

1. **SSG over SSR** — All pages pre-rendered at build time; no server runtime needed.
2. **Zero server uploads** — All processing uses Canvas API, crypto.subtle, FileReader, QRCode library — client-side only.
3. **Tailwind v4 CSS-first** — No `tailwind.config.mjs`; animations and tokens defined in CSS with `@import "tailwindcss"`.
4. **No PWA** — Service worker and manifest explicitly skipped per product decision.
5. **Single registry** — `tools.ts` drives search, categories, homepage, sitemap, related tools, and dashboard from one source.
6. **localStorage over backend** — All user preferences (favorites, history, usage) stored locally.
7. **White/rgba glass tokens** — Unified `bg-white/[0.03]` / `border-white/[0.06]` pattern instead of mixed zinc classes.
8. **CSS grid-rows for accordion** — Hardware-accelerated height transitions without JS measurement.
