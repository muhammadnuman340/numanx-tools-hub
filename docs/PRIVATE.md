# NumanX Tools Hub — Private / Internal Info

> ⚠️ This file is for internal reference only. Not published to the site.

---

## Tech Stack

- **Framework:** Astro v6.4.2
- **CSS:** TailwindCSS v4.3 (via `@tailwindcss/vite`)
- **CSS Minifier:** LightningCSS
- **Language:** TypeScript
- **Runtime:** Node >= 22.12.0

## Build & Dev Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (`astro dev`) |
| `npm run build` | Production build (`astro build`) |
| `npm run preview` | Preview production build (`astro preview`) |

## GitHub

- **Repo:** https://github.com/muhammadnuman340/numanx-tools-hub (private)
- **Branch:** master

## Site URL

- **Production:** https://numanxtools.site

## Analytics

- **Provider:** Google Analytics (GA4)
- **Measurement ID:** Set via `PUBLIC_GA_ID` environment variable (default placeholder: `G-XXXXXXXXXX`)
- **Component:** `src/components/Analytics.astro`
- **Integration:** `MainLayout.astro` conditionally renders `<Analytics id={GA_ID} />` when non-empty

## Carbon Ads

- **Serve ID:** `CEAICKJM`
- **Placement:** `numanxtools`
- **Component:** `src/components/CarbonAd.astro` — uses default fallback values, can be overridden via props

## Deployment

- **Platform:** Cloudflare Pages
- **Build command:** `npm run build`
- **Build output directory:** `dist/`
- **Node version requirement:** >= 22.12.0 (`engines.node` in package.json)

## Project Config

- **Config file:** `astro.config.mjs`
  - `site`: https://numanxtools.site
  - `compressHTML`: true
  - `scopedStyleStrategy`: 'where'
  - `build.inlineStylesheets`: 'auto'
  - `vite.build.cssMinify`: 'lightningcss'

## Dependencies (package.json)

| Package | Version |
|---------|---------|
| `astro` | ^6.4.2 |
| `@tailwindcss/vite` | ^4.3.0 |
| `tailwindcss` | ^4.3.0 |
| `qrcode` | ^1.5.4 |

## Directory Layout

```
src/
├── assets/           — Static assets (images, SVGs)
├── components/       — Reusable Astro components
│   ├── ui/           — Base UI primitives (Card, Button, Tabs, etc.)
│   └── icons/        — Icon-related components
├── data/             — Tool definitions, categories, SEO data
├── layouts/          — Page layouts (MainLayout, BlogLayout)
├── lib/              — Utility functions, icon SVGs
├── pages/            — Route pages
│   ├── blog/         — Blog posts and index
│   ├── category/     — Category listing pages
│   └── tools/        — Individual tool pages
└── styles/           — Global CSS
```

## Contact Information

### Brand
- **Name:** NumanX Studio
- **Site:** https://numanxtools.site
- **Location:** Karachi, Pakistan
- **Response Time:** Typically within 24 hours

### Email Addresses
| Purpose | Email |
|---------|-------|
| General Inquiries | `contact@numanxstudio.com` |
| Support | `support@numanxstudio.com` |
| Business / Partnerships | `business@numanxstudio.com` |

### Social Media
| Platform | URL |
|----------|-----|
| GitHub | https://github.com/numanxstudio |
| X / Twitter | https://x.com/numanxstudio |
| Instagram | https://instagram.com/numanxstudio |
| Facebook | https://facebook.com/numanxstudio |
| TikTok | https://tiktok.com/@numanxstudio |
| YouTube | https://youtube.com/@numanxstudio |

### SEO / Structured Data
- **Twitter handle:** `@numanxstudio` (used in `twitter:site` and `twitter:creator` meta tags)
- **Organization Schema:** `sameAs` includes all social URLs listed above
- **ContactPoint Schema:** `email: hello@numanxstudio.com`, `contactType: customer service`
- **Page:** `/contact/` — contact form for submissions (tool suggestions, feedback, issues)

---

## Full Codebase Map

### Root Config Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro build config: site URL, HTML compression, TailwindCSS v4 via Vite plugin, LightningCSS minification, scoped style strategy |
| `tsconfig.json` | TypeScript strict mode config (extends `astro/tsconfigs/strict`) |
| `package.json` | Project metadata, scripts (`dev`, `build`, `preview`), dependencies (Astro 6.4.2, TailwindCSS 4.3, qrcode) |
| `.gitignore` | Ignores `dist/`, `.astro/`, `node_modules/`, `.env`, `.DS_Store`, `.idea/` |

### `public/` — Static Assets (served as-is at root)

| File | Purpose |
|------|---------|
| `favicon.ico` | Legacy favicon (16×16 ICO format for old browsers) |
| `favicon.svg` | Primary SVG favicon (used in manifest for 512×512) |
| `icon-192.svg` | PWA icon for 192×192 |
| `apple-touch-icon.svg` | Apple touch icon for iOS home screen bookmarks |
| `manifest.json` | PWA manifest: app name "NumanX Tools", standalone display, dark theme (#0a0a0b) |
| `og-default.svg` | Default Open Graph image for social sharing (fallback when no per-page image) |
| `robots.txt` | Static robots: allows all crawlers, disallows `/favorites/` and `/search/`, points to sitemap |

---

### `src/styles/` — Global Styles

| File | Purpose |
|------|---------|
| `global.css` | Entry stylesheet: imports TailwindCSS and design-tokens. Loads Inter font. Defines base body styles, scrollbar, selection colors, animations (`@keyframes breathe`), and responsive utilities |
| `design-tokens.css` | 272 CSS custom properties: brand colors (purple 50→900), surface/neutral tones, accent colors (emerald, blue, amber, rose, red), semantic colors (success, warning, error, info), typography scale, shadow levels, z-index layers, border radius, spacing scale, backdrop blur levels |

---

### `src/layouts/` — Page Layouts

| File | Purpose |
|------|---------|
| `MainLayout.astro` | **Primary layout** for all pages. Includes global CSS, Navbar, Footer, SearchBar, BackToTop, Toast, Analytics (conditional on GA_ID), custom cursor, scroll progress bar, ambient background effects. Sets up HTML shell with preconnect hints, SEO component, viewport meta, theme-color, manifest link |
| `BlogLayout.astro` | **Blog post layout**. Extends the visual shell with: blog-specific meta (Article schema, author, date), TableOfContents sidebar, PopularPosts widget, RelatedPosts at bottom, social share buttons (Twitter, LinkedIn), reading time, tags/category display |

---

### `src/data/` — Data Definitions

| File | Purpose |
|------|---------|
| `tools.ts` | **Central data source.** Defines `Tool` type (14 fields), `CategoryInfo` type, `ToolCategory` union. Exports `categories[]` (4 categories with counts) and `tools[]` (14 tools with id, name, description, icon, url, category, keywords, relatedIds). Exports helper functions: `getToolBySlug()`, `getToolsByCategory()`, `getRelatedTools()`, `getCategoryInfo()`, `getPopularTools()`, `getFeaturedTools()`, `getNewTools()` |

---

### `src/lib/` — Utility Libraries

| File | Purpose |
|------|---------|
| `iconSvgs.ts` | SVG icon registry: `Record<string, string>` mapping icon names to inline SVG strings. Used as a lookup table for components that need icons dynamically. Keys: qr, word, age, password, hashtag, runrate, strikerate, jpg2png, compress, webp, resize, image, creator, utility, cricket, bolt, lock, target, mobile, rocket, globe, article, unit, markdown, json |
| `storage.ts` | Client-side localStorage utilities: favorites CRUD (`getFavorites`, `toggleFavorite`, `isFavorite`), recently used tracking (`addRecentlyUsed`, `getRecentlyUsed`, max 20), search history (`addSearchHistory`, `getSearchHistory`, max 10), tool usage analytics (`trackToolUsage`, `getToolUsage`, `getMostUsedTools`). All wrapped in try/catch with graceful fallbacks |

---

### `src/components/` — Reusable Components

#### UI Primitives (`src/components/ui/`)

| File | Purpose |
|------|---------|
| `Accordion.astro` | Expandable FAQ accordion. Takes `items: [{title, content}]` array. Client-side JS for toggle with smooth height animation, chevron rotation, aria-expanded support |
| `Badge.astro` | Inline badge/tag. Variants: default, new, popular, pro, success, warning, info. Sizes: sm, md |
| `Button.astro` | Styled button or link. Variants: primary, secondary, ghost, outline, danger. Sizes: sm, md, lg. Supports disabled, loading states, and `href` for anchor rendering |
| `Card.astro` | Container card with variants: default, glass, interactive. Padding levels: sm, md, lg |
| `Drawer.astro` | Slide-in drawer panel (left/right position). Toggle via `data-drawer-toggle` attributes. Client-side JS for open/close/backdrop |
| `Tabs.astro` | Tabbed interface. Takes `tabs: [{id, label}]` array. Client-side JS for tab switching with active state |
| `Toast.astro` | Notification toast system. Variants: success, error, info, warning. Auto-dismiss after configurable duration. Shows via `window.dispatchEvent` API |
| `ValueCard.astro` | Animated value proposition card. Takes title, description, delay (for staggered entrance animation). Used on homepage hero section |

#### Feature Components

| File | Purpose |
|------|---------|
| `AdSlot.astro` | Carbon Ads fallback container. Renders a placeholder box with "Developer Ad" label. Links to /contact/ if no ad loads. Styled to match dark theme |
| `Analytics.astro` | Google Analytics 4 snippet. Takes GA measurement ID via prop. Injects gtag.js async script and config. Used conditionally in MainLayout |
| `BackToTop.astro` | Floating "back to top" button. Shows on scroll past 300px. Smooth scrolls to top on click. Fades in/out |
| `CarbonAd.astro` | Carbon Ads integration. Renders the `_carbonads_js` script tag with `serve` and `placement` params (defaults: CEAICKJM, numanxtools) |
| `CategoryCard.astro` | Category display card for tools overview. Shows title, description, icon. Hover effect with purple border and lift |
| `CategoryHero.astro` | Banner/hero section for category pages. Shows category title, description, icon with gradient background |
| `EmptyState.astro` | Placeholder for empty lists (e.g. no favorites, no search results). Configurable icon, title, message, action button |
| `FavoriteButton.astro` | Heart toggle button for tools. Reads/writes localStorage via `storage.ts`. Shows filled/outline heart SVG. Toggles "nt_favorites" on click |
| `Footer.astro` | Site footer with 4-column grid: brand (NumanX Tools + social icons), tools links, resources, company links. Copyright bar with "Build. Create. Analyze." tagline |
| `HowToUse.astro` | Numbered step-by-step guide. Takes `steps: [{num, title, desc}]` array. Used on tool pages to show usage instructions |
| `KeyboardHints.astro` | Displays keyboard shortcut hints (e.g., Ctrl+Enter to submit). Takes `hints: [{keys, label}]` array |
| `Navbar.astro` | Top navigation bar. Desktop: logo, category dropdown, tool links, contact. Mobile: hamburger menu with full drawer. Active page highlighting via `Astro.url` |
| `PopularPosts.astro` | Sidebar widget listing hardcoded top blog posts with numbered ranking. Links to blog pages |
| `RelatedPosts.astro` | Dynamic related blog posts. Filters posts by matching category/tags vs current post. Shows up to 2 links |
| `RelatedTools.astro` | Dynamic related tool cards at bottom of tool pages. Uses `getRelatedTools()` from tools.ts. Shows up to 3 linked tool cards |
| `SearchBar.astro` | Full-screen search overlay (Cmd/Ctrl+K trigger). Client-side search across all tools and blog posts. Includes search history, keyboard navigation, category filtering. Uses localStorage for history |
| `SEO.astro` | Complete SEO head component: meta title/desc/keywords, canonical URL, Open Graph tags, Twitter cards, JSON-LD structured data (Organization, WebSite, FAQ, BreadcrumbList, Tool/Article schema). Generates Organization schema with social profiles. Conditionally adds FAQ schema, breadcrumbs, tool/article schemas |
| `ShareBar.astro` | Social share button bar. Native share API with fallback to copy-link. Share icon button with tooltip |
| `Skeleton.astro` | Loading skeleton placeholder. Variants: card, text, circle, rect, image. Configurable width/height. Animated shimmer effect |
| `TableOfContents.astro` | Sticky sidebar TOC for blog posts. Client-side JS parses `<h2>` headings from the page and builds a linked list. Highlights active section on scroll |
| `ToolHeader.astro` | Tool page header. Shows tool name, description, badge ("Free Online Tool"), gradient/icon, plus FavoriteButton. Used at the top of every tool page |

#### Icon Components (`src/components/icons/`)

| File | Purpose |
|------|---------|
| `ToolIcon.astro` | Inline SVG renderer for tool icons. Takes `name` prop, renders the corresponding SVG via a long ternary chain. Falls back to default clock icon. Has 20+ icon options matching tool IDs |

---

### `src/pages/` — Route Pages

#### Core Pages

| File | Route | Purpose |
|------|-------|---------|
| `index.astro` | `/` | **Homepage.** Hero section with animated typing effect, search bar, value props (ValueCards). Tool grid with categories, featured tools carousel, blog highlights, newsletter signup, testimonials, stats counter. Client-side JS for recently used tools (localStorage), category filter, scroll animations |
| `404.astro` | `/404` | Custom 404 page with fun message, suggested tools grid, and search prompt |
| `about.astro` | `/about` | About page: brand story, feature highlights, stats (tools count), team section (Muhammad Numan Usmani), values |
| `contact.astro` | `/contact` | Contact form page with validation, email links (contact/support/business), FAQ accordion, social links, location (Karachi) |
| `dashboard.astro` | `/dashboard` | Internal platform dashboard showing tool categories with counts, feature roadmap (4 phases), ecosystem links |
| `favorites.astro` | `/favorites` | Saved tools page. Reads localStorage favorites, renders tool cards. Shows empty state if none saved |
| `search.astro` | `/search` | Search results page with full tool list, category filtering, grid layout |
| `privacy-policy.astro` | `/privacy-policy` | Privacy policy: data collection, cookies, third-party services (Carbon Ads, GA, Fonts), user rights, contact info |
| `terms-of-service.astro` | `/terms-of-service` | Terms of service: usage rules, intellectual property, disclaimers, limitations, contact info |

#### Tool Pages (`src/pages/tools/`)

| File | Route | Purpose |
|------|-------|---------|
| `index.astro` | `/tools` | Tools directory: category grid showing all 4 categories with tool counts, links to each category page |
| `qr-generator.astro` | `/tools/qr-generator` | QR code generator: text/URL/WiFi/Email/Phone/vCard templates, color picker, logo upload, SVG download. Real-time preview |
| `word-counter.astro` | `/tools/word-counter` | Word/character counter with textarea input, live stats (words, chars, sentences, paragraphs), readability score |
| `age-calculator.astro` | `/tools/age-calculator` | Age calculator: date picker, exact age breakdown (years/months/days/hours/minutes/seconds), next birthday countdown |
| `password-generator.astro` | `/tools/password-generator` | Password generator: length slider, character type toggles, entropy meter, strength indicator, copy button, PIN mode |
| `hashtag-generator.astro` | `/tools/hashtag-generator` | Hashtag generator: topic input, platform selector, popularity scores, copy-to-clipboard |
| `run-rate-calculator.astro` | `/tools/run-rate-calculator` | Cricket run rate calculator: runs/overs inputs, current RR, required RR, chase difficulty indicator |
| `strike-rate-calculator.astro` | `/tools/strike-rate-calculator` | Cricket strike rate calculator: batting (runs/balls) and bowling (balls/runs/wickets) modes, impact rating |
| `jpg-to-png.astro` | `/tools/jpg-to-png` | JPG to PNG converter: file upload, preview, download. Client-side Canvas API conversion |
| `image-compressor.astro` | `/tools/image-compressor` | Image compressor: upload, quality slider, size preview, download. Lossless client-side compression |
| `png-to-webp.astro` | `/tools/png-to-webp` | PNG to WebP converter: file upload, quality control, preview comparison, download |
| `image-resizer.astro` | `/tools/image-resizer` | Image resizer: upload, dimension inputs, aspect ratio lock, social media presets, Canvas API processing |
| `unit-converter.astro` | `/tools/unit-converter` | Unit converter: 100+ units across 8 categories (length, mass, volume, temp, area, speed, time, data). Smart category detection |
| `markdown-editor.astro` | `/tools/markdown-editor` | Markdown editor: split-pane live preview, formatting toolbar, HTML export |
| `json-formatter.astro` | `/tools/json-formatter` | JSON formatter: textarea input, format/validate/minify, error highlighting, tree view, copy output |

#### Category Pages

| File | Route | Purpose |
|------|-------|---------|
| `[category].astro` | `/category/:slug` | Dynamic category page. Uses `getCategoryInfo()` and `getToolsByCategory()` from tools.ts. Renders CategoryHero + tool grid with ToolHeader-style cards |

#### Blog Pages

| File | Route | Purpose |
|------|-------|---------|
| `index.astro` | `/blog` | Blog index: lists all 13 blog posts with title, excerpt, date, read time, category, tags. Newsletter signup section |
| `*.md` (×13) | `/blog/:slug` | Individual blog posts. Each is a Markdown file with frontmatter (title, description, date, category, tags, readingTime, slug, image). Topics: password security, QR codes, AI tools, hashtag strategy, image optimization, cricket guide, etc. |

#### Utility Endpoints (`.ts` files, not `.astro`)

| File | Route | Purpose |
|------|-------|---------|
| `robots.txt.ts` | `/robots.txt` | Generates dynamic robots.txt with per-bot rules (Googlebot, Bingbot, *) disallowing /admin/, /api/, /internal/, /draft/. Sitemap URL. **Note:** Static `public/robots.txt` takes precedence over this |
| `sitemap.xml.ts` | `/sitemap.xml` | Generates XML sitemap with all static pages (13+), all 14 tool pages, all 4 category pages, all 13 blog posts. Each entry has priority, changefreq, lastmod date |

---

## Notes

- All tool processing is **client-side only** (no server uploads). Uses Canvas API, FileReader, localStorage
- The `robots.txt.ts` endpoint is **shadowed** by the static `public/robots.txt` file — Astro serves the static file first
- Icon SVGs are duplicated in two places: `iconSvgs.ts` (lookup map for JS) and `ToolIcon.astro` (inline ternary for Astro rendering)

### Image Tools (4)
- Image Compressor, Image Resizer, JPG to PNG, PNG to WebP

### Creator Tools (3)
- QR Generator, Hashtag Generator, Markdown Editor

### Utility Tools (6)
- Word Counter, Age Calculator, Password Generator, Unit Converter, JSON Formatter

### Cricket Tools (2)
- Run Rate Calculator, Strike Rate Calculator
