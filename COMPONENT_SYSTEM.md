# NumanX Tools — Component System

> Complete inventory of every Astro component in the system. Use this as a reference when building new features to ensure consistency and avoid duplication.

---

## UI Primitives (`src/components/ui/`)

These are the foundational building blocks. Every UI component supports `class?: string` for Tailwind overrides.

---

### Accordion

**Path**: `src/components/ui/Accordion.astro`

Single-open accordion with CSS grid-rows height transition (no JS measurement). Smooth `grid-rows-[0fr]` ↔ `grid-rows-[1fr]` animation. Automatically closes other panels when one opens.

```astro
---
interface Props {
  items: Array<{ title: string; content: string }>;
  class?: string;
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{title: string, content: string}[]` | required | Accordion panels |
| `class` | `string` | `''` | Additional Tailwind classes |

**Script**: Reinitializes on `astro:after-swap` for view transitions.

**Usage**:
```astro
<Accordion items={[
  { title: "How does it work?", content: "It runs entirely in your browser." },
  { title: "Is it free?", content: "Yes, always." },
]} />
```

---

### Badge

**Path**: `src/components/ui/Badge.astro`

Inline badge/pill with 7 color variants and 2 sizes.

```astro
---
type BadgeVariant = "default" | "new" | "popular" | "pro" | "success" | "warning" | "info";

interface Props {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  class?: string;
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `BadgeVariant` | `'default'` | Color + semantic variant |
| `size` | `'sm' \| 'md'` | `'sm'` | `sm` = `text-[10px]`; `md` = `text-xs` |
| `class` | `string` | `''` | Additional Tailwind classes |

**Variants**:
| Variant | Visual |
|---------|--------|
| `default` | `bg-white/[0.04] text-zinc-400 border-white/[0.06]` |
| `new` | `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` |
| `popular` | `bg-purple-500/10 text-purple-400 border-purple-500/20` |
| `pro` | `bg-amber-500/10 text-amber-400 border-amber-500/20` |
| `success` | `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` |
| `warning` | `bg-amber-500/10 text-amber-400 border-amber-500/20` |
| `info` | `bg-blue-500/10 text-blue-400 border-blue-500/20` |

**Usage**:
```astro
<Badge variant="new" size="sm">New</Badge>
<Badge variant="popular">Popular</Badge>
```

---

### Button

**Path**: `src/components/ui/Button.astro`

Versatile button that renders `<a>` when `href` is provided, `<button>` otherwise. Supports loading state, disabled state, and any extra HTML attributes via spread.

```astro
---
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  class?: string;
  [key: string]: any; // spread to element
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'primary'` | Visual style |
| `size` | `ButtonSize` | `'md'` | `sm` = `px-3 py-1.5 text-xs`; `md` = `px-5 py-2.5 text-sm`; `lg` = `px-6 py-3 text-sm` |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Shows spinner SVG |
| `href` | `string` | — | If set, renders `<a>` instead of `<button>` |
| `class` | `string` | `''` | Additional Tailwind classes |
| `[key: string]` | `any` | — | Spread to element (e.g., `target="_blank"`, `aria-label`) |

**Variants**:
| Variant | Default | Hover | Active |
|---------|---------|-------|--------|
| `primary` | `bg-purple-600 text-white` | `bg-purple-500` | `scale-[0.97]` |
| `secondary` | `bg-white/[0.03] text-zinc-300 border-white/[0.1]` | `bg-white/[0.06]` | `scale-[0.97]` |
| `ghost` | `text-zinc-400` | `text-white bg-white/[0.04]` | `scale-[0.97]` |
| `outline` | `text-zinc-300 border-white/[0.1]` | `text-white border-white/[0.2]` | `scale-[0.97]` |
| `danger` | `bg-red-600 text-white` | `bg-red-500` | `scale-[0.97]` |

**Usage**:
```astro
<Button variant="primary" size="lg">Get Started</Button>
<Button variant="outline" href="/tools/">Browse Tools</Button>
<Button variant="danger" loading disabled>Deleting...</Button>
```

---

### Card

**Path**: `src/components/ui/Card.astro`

Container card with 3 visual variants and 3 padding sizes. Named slots for image and badge.

```astro
---
interface Props {
  variant?: "default" | "glass" | "interactive";
  padding?: "sm" | "md" | "lg";
  class?: string;
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'glass' \| 'interactive'` | `'default'` | Visual style |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | `sm` = `p-4`; `md` = `p-5`; `lg` = `p-6` |
| `class` | `string` | `''` | Additional Tailwind classes |

**Variants**:
| Variant | Classes |
|---------|---------|
| `default` | `bg-white/[0.03] border border-white/[0.06] rounded-2xl` |
| `glass` | Default + `backdrop-blur-xl` |
| `interactive` | Default + `hover:border-purple-500/30 hover:bg-white/[0.05] hover:shadow-lg` |

**Slots**: `slot="image"`, `slot="badge"`, default slot

**Usage**:
```astro
<Card variant="interactive" padding="lg">
  <Fragment slot="badge"><Badge variant="new">New</Badge></Fragment>
  <h3>Card Title</h3>
  <p>Card content here.</p>
</Card>
```

---

### Drawer

**Path**: `src/components/ui/Drawer.astro`

Slide-in panel (left or right) with backdrop. Triggered via `[data-drawer="id"]` attribute. Locks body scroll when open.

```astro
---
interface Props {
  id?: string;
  position?: "left" | "right";
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `'drawer'` | HTML id, also used for data-attribute trigger matching |
| `position` | `'left' \| 'right'` | `'right'` | Slide direction |

**Behavior**: Click backdrop or close button to dismiss. `document.body.style.overflow = "hidden"` when open.

**Usage**:
```astro
<button data-drawer="drawer">Open Menu</button>
<Drawer id="drawer" position="right">
  <nav>Menu content</nav>
</Drawer>
```

---

### Tabs

**Path**: `src/components/ui/Tabs.astro`

ARIA-compliant tab bar with role="tablist"/"tab"/"tabpanel". Active tab uses `aria-selected="true"` with purple styling. Tab panel visibility toggled via inline style.

```astro
---
interface Props {
  tabs: Array<{ id: string; label: string }>;
  activeTab?: string;
  class?: string;
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `{id: string, label: string}[]` | required | Tab definitions |
| `activeTab` | `string` | first tab's id | Initial active tab |
| `class` | `string` | `''` | Additional Tailwind classes |

**Usage**:
```astro
<Tabs tabs={[
  { id: "features", label: "Features" },
  { id: "specs", label: "Specifications" },
]} activeTab="features" />
```

---

### Toast

**Path**: `src/components/ui/Toast.astro`

Global toast notification system. Renders a fixed container at `top-4 right-4 z-[999]`. Exposes `window.__showToast(options)` for programmatic triggering.

```astro
---
type ToastVariant = "success" | "error" | "info" | "warning";

interface Props {
  variant?: ToastVariant;
  message?: string;
  duration?: number;
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ToastVariant` | `'info'` | Visual style |
| `message` | `string` | — | Notification text |
| `duration` | `number` | `4000` | Auto-dismiss in ms |

**Variants**:
| Variant | Visual |
|---------|--------|
| `success` | `bg-emerald-600` border + emerald icon |
| `error` | `bg-red-600` border + X icon |
| `info` | `bg-blue-600` border + info icon |
| `warning` | `bg-amber-600` border + warning icon |

**Usage**:
```astro
<Toast /> <!-- render once in layout -->

<!-- trigger from any script -->
<script>
  window.__showToast?.({ variant: "success", message: "Saved!" });
</script>
```

---

### ValueCard

**Path**: `src/components/ui/ValueCard.astro`

Animated value proposition card with hover glow, expanding underline, and staggered entrance animation. Used on the homepage "Why NumanX" section.

```astro
---
interface Props {
  title: string;
  description: string;
  delay?: number;
}
---
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Card heading |
| `description` | `string` | required | Card body text |
| `delay` | `number` | `0` | Stagger delay in seconds for `fadeInUp` |

**Visual Effects**:
- Ambient radial gradient overlay expands on hover (`scale-150`)
- Icon slot transitions to purple + border glow
- Underline bar expands from `w-4` → `w-12` on hover
- Bottom gradient divider slides in from center
- Staggered `fadeInUp` entrance via `delay` prop

**Slots**: `slot="icon"`

**Usage**:
```astro
<ValueCard title="Fast Processing" description="All conversions happen in-browser." delay={0.1}>
  <span slot="icon">⚡</span>
</ValueCard>
```

---

## Feature Components (`src/components/`)

---

### AdSlot

**Path**: `src/components/AdSlot.astro`

Ad placement container with configurable format dimensions. Currently renders "Sponsor / Advertise Here" placeholder.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slot` | `string` | `'default'` | Ad slot identifier |
| `format` | `'horizontal' \| 'vertical' \| 'rectangle' \| 'responsive'` | `'responsive'` | Ad size format |
| `class` | `string` | `''` | Additional Tailwind classes |

**Format dimensions**:
- `horizontal`: `728×90`
- `vertical`: `160×600`
- `rectangle`: `300×250`
- `responsive`: `min-h-[90px]` – `min-h-[250px]`

---

### Analytics

**Path**: `src/components/Analytics.astro`

Google Analytics 4 injection component. Loads `gtag.js` script conditionally.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `'G-XXXXXXXXXX'` | GA4 Measurement ID |

**Usage**: Conditionally rendered in MainLayout:
```astro
{GA_ID && <Analytics id={GA_ID} />}
```

---

### BackToTop

**Path**: `src/components/BackToTop.astro`

Self-contained scroll-to-top button. Fixed bottom-right. Uses `requestAnimationFrame` for scroll detection. Shows after 400px scroll. Smooth scroll to top on click.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | — | — | Self-contained |

---

### CategoryCard

**Path**: `src/components/CategoryCard.astro`

Simple category display card with fixed star icon.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Category name |
| `description` | `string` | required | Category description |

---

### CategoryHero

**Path**: `src/components/CategoryHero.astro`

Hero banner for `/category/[category]/` pages. Shows icon, tool count, title, and description.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `category` | `CategoryInfo` | required | From `data/tools.ts` |

---

### EmptyState

**Path**: `src/components/EmptyState.astro`

Generic empty/fallback display with optional icon, title, message, and CTA button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | — | Emoji or icon text |
| `title` | `string` | `'Nothing here yet'` | Heading text |
| `message` | `string` | `'Try adjusting your search or filters.'` | Body text |
| `actionLabel` | `string` | — | CTA button label |
| `actionHref` | `string` | — | CTA button href |
| `class` | `string` | `''` | Additional Tailwind classes |

---

### FavoriteButton

**Path**: `src/components/FavoriteButton.astro`

Star toggle button that reads/writes `nt_favorites` in localStorage. Uses `storage.ts` helpers.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slug` | `string` | required | Tool slug to save |
| `class` | `string` | `''` | Additional Tailwind classes |

**Behavior**: Toggles filled/outline star icon. Shows "Save"/"Saved" label. Amber highlight when active.

---

### Footer

**Path**: `src/components/Footer.astro`

4-column responsive footer: Brand + social icons, Tools links, Resources links, Company links. Gradient top divider. Copyright bar with tagline.

No props. Self-contained.

---

### HowToUse

**Path**: `src/components/HowToUse.astro`

Numbered step-by-step instruction grid. Used on tool pages.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `{num: string, title: string, desc: string}[]` | required | Ordered steps |

---

### Navbar

**Path**: `src/components/Navbar.astro`

Fixed glass navigation bar. Desktop: Home, Tools, Categories dropdown (from registry), Blog, About. Mobile: hamburger drawer. Search trigger (Ctrl+K), Favorites link, "Get Started" CTA button.

No props. Self-contained.

**Features**: Categories dropdown with hover translateY/opacity animation. Mobile glass drawer. Keyboard shortcut indicator for search. Active link state via current URL.

---

### PopularPosts

**Path**: `src/components/PopularPosts.astro`

Blog sidebar widget showing top 5 posts with numbered list.

No props. Hardcoded data.

---

### RelatedPosts

**Path**: `src/components/RelatedPosts.astro`

Shows up to 3 related blog articles filtered by matching category.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentSlug` | `string` | required | Current post slug (to exclude) |
| `category` | `string` | — | Category filter |
| `tags` | `string[]` | — | Tag filter |

Contains hardcoded array of all 14 blog posts.

---

### RelatedTools

**Path**: `src/components/RelatedTools.astro`

Displays up to 3 related tools from `getRelatedTools()`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | `string` | required | Current tool slug |

---

### SEO

**Path**: `src/components/SEO.astro`

Injects all meta tags (description, keywords, OG, Twitter Cards), canonical URL, and JSON-LD structured data (FAQ, BreadcrumbList, SoftwareApplication, Article).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Page title (appends `\| NumanX Tools` unless title contains "NumanX") |
| `description` | `string` | `'Free online tools for creators, students, and developers.'` | Meta description |
| `keywords` | `string` | Default SEO keywords set | Comma-separated |
| `canonical` | `string` | — | Canonical URL |
| `image` | `string` | — | OG image URL |
| `noindex` | `boolean` | — | Sets `noindex` meta |
| `faq` | `{question, answer}[]` | — | FAQ schema |
| `breadcrumbs` | `{name, url}[]` | — | BreadcrumbList schema |
| `toolSchema` | `Record<string, any>` | — | SoftwareApplication schema partial |
| `articleSchema` | `Record<string, any>` | — | Article schema partial |

---

### SearchBar

**Path**: `src/components/SearchBar.astro`

Full modal search overlay. Triggered via `window.__openSearch()`. Supports category filtering, keyboard navigation (arrows, Enter, Esc, Ctrl+K toggles).

No props. Self-contained with hardcoded tool data at the page level (called via `Astro.props` or inline).

**Features**: Category filter buttons (All, Image, Creator, Utility, Cricket, Blog). Result items with hover effect. Keyboard navigation with legend footer. Empty state. Popular suggestions.

---

### ShareBar

**Path**: `src/components/ShareBar.astro`

Social share bar with "Share" and "Copy Link" buttons. Prefers Web Share API, falls back to clipboard copy. Shows "Copied!" feedback for 2 seconds.

No props. Self-contained.

---

### Skeleton

**Path**: `src/components/Skeleton.astro`

Loading placeholder with 5 variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'card' \| 'text' \| 'circle' \| 'rect' \| 'image'` | `'text'` | Shape variant |
| `width` | `string` | — | CSS width (e.g., `'100px'`) |
| `height` | `string` | — | CSS height |
| `lines` | `number` | `3` | For `text` variant only |
| `class` | `string` | `''` | Additional Tailwind classes |

**Variants**:
- `text`: Multiple `h-3` lines, last line 60% width
- `card`: Icon + title + description skeleton
- `circle`: Perfect circle placeholder
- `rect`: Rectangle placeholder
- `image`: Aspect-video + caption skeleton

---

### TableOfContents

**Path**: `src/components/TableOfContents.astro`

Sticky sidebar TOC that scans `<article>` for `h2` and `h3` elements. Adds `id` attributes automatically. Uses `IntersectionObserver` for active section highlighting. Hides if no headings found.

No props. Self-contained.

---

### ToolHeader

**Path**: `src/components/ToolHeader.astro`

Hero section for every tool page. Renders badge, two-line title (line + gradient subtitle), description, and optional FavoriteButton. Records page view to localStorage (`nt_tool_usage` + `nt_recently_used`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Tool name (first line) |
| `gradient` | `string` | required | Purple-blue gradient subtitle |
| `desc` | `string` | required | Description paragraph |
| `badge` | `string` | `'Free Online Tool'` | Pill badge text |
| `slug` | `string` | — | Enables FavoriteButton + usage tracking |

---

## Layouts (`src/layouts/`)

### MainLayout

**Path**: `src/layouts/MainLayout.astro`

Primary layout used by all pages except blog articles. Provides ambient background (3 orbiting orbs + grid + vignette), Navbar, `<main>` slot, Footer, BackToTop, SearchBar, SEO meta, GA4 analytics, WebApplication JSON-LD schema.

**Props** (passed to SEO): `title`, `description`, `keywords`, `canonical`, `image`, `noindex`, `faq`, `breadcrumbs`, `toolSchema`, `articleSchema`

**Slots**: `slot="head"` (in `<head>`), default slot (in `<main>`)

### BlogLayout

**Path**: `src/layouts/BlogLayout.astro`

Specialized layout for blog articles. Includes reading progress bar (fixed top), Navbar, `<article>` with prose styling, TableOfContents sidebar, RelatedPosts, PopularPosts, author box with social share, Article JSON-LD schema.

**Props**: `frontmatter: { title, description, date, author, category, tags, readingTime, slug }`

**Slots**: default slot for `.md` content

---

## Component Tree

```
MainLayout
├── Navbar
│   ├── Categories dropdown (from data/tools.ts)
│   ├── SearchBar trigger (Ctrl+K)
│   └── Mobile Drawer
├── <main> (page content)
│   ├── ToolHeader (tool pages)
│   │   └── FavoriteButton
│   ├── CategoryHero (category pages)
│   ├── ShareBar
│   ├── HowToUse
│   ├── Accordion (FAQ)
│   ├── RelatedTools
│   ├── ValueCard[] (homepage Why section)
│   ├── AdSlot
│   └── EmptyState (fallback)
├── Footer
│   └── Social icon links
├── BackToTop
└── SearchBar (modal overlay)

BlogLayout
├── Navbar
├── TableOfContents (sticky sidebar)
├── <article> (markdown with prose)
├── PopularPosts (sidebar)
├── RelatedPosts
├── Share Bar (author section)
└── Footer
```
