# NumanX Tools — Comprehensive Design System & Component Matrix

This is the definitive "Principal Architect" specification for the NumanX visual language. It dictates exactly how the "God-Tier Glassmorphism" aesthetic is implemented across Tailwind utility classes, accessibility states, and animation keyframes.

---

## 1. The Design Language: "God-Tier Glassmorphism"

The NumanX aesthetic relies on deep dark backgrounds (`bg-[#0a0a0b]`), vibrant ambient radial glows, and heavily frosted glass surfaces. We explicitly avoid "flat" dark mode in favor of depth, transparency, and micro-interactions.

### 1.1 The Core Tailwind Glass Matrix
Whenever building a new card, modal, or container, you MUST use one of these three exact utility combinations:

| Glass Tier | Tailwind Combination | Use Case |
| --- | --- | --- |
| **Tier 1 (Subtle Base)** | `bg-white/[0.02] border border-white/[0.05] backdrop-blur-md` | Background sections, massive layout containers. |
| **Tier 2 (Standard Card)** | `bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-2xl` | Standard tool cards, blog post cards, dropdown menus. |
| **Tier 3 (Elevated Floating)** | `bg-white/[0.08] border border-white/[0.12] backdrop-blur-2xl shadow-purple-500/10` | Sticky navbars, search overlays, floating action buttons. |

### 1.2 The Interactive State Matrix (a11y)
Buttons, links, and cards must follow this exact state transition matrix to ensure WCAG AA compliance and a premium feel.

| State | Tailwind Utility Modifiers | Notes |
| --- | --- | --- |
| **Hover (`hover:`)** | `hover:bg-white/[0.08] hover:border-purple-500/50 hover:-translate-y-1` | Slight lift and brand-color border reveal. |
| **Focus (`focus-visible:`)** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0b]` | Mandatory for keyboard navigation accessibility. |
| **Active (`active:`)** | `active:scale-95 active:bg-white/[0.1]` | Immediate physical click feedback. |
| **Disabled (`disabled:`)** | `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none` | Visual communication of unavailable actions. |

---

## 2. Animation & Keyframe Definitions

Animations must feel deliberate, fluid, and hardware-accelerated (`transform` and `opacity` only).

### 2.1 Standard Transitions
- **Global Base Transition:** `transition-all duration-300 ease-out`
- **Snappy Micro-Interaction:** `transition-transform duration-150 ease-in-out`

### 2.2 Custom CSS Keyframes (`src/styles/global.css`)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

@keyframes slide-in-bottom {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

---

## 3. Core Component Library Specifications

### 3.1 `<AppSEO />` (The Meta Engine)
- **Purpose:** Injects all `<head>` metadata, OpenGraph tags, and JSON-LD schema dynamically per route.
- **Strict Rule:** Must be the very first component rendered inside `<head>` to ensure crawlers instantly hit canonical tags.

### 3.2 `<MainLayout />` (The Application Shell)
- **Purpose:** Wraps every single page. Injects the ambient background SVGs/Orbs, the `<Navbar />`, the main content `<slot />`, and the `<Footer />`.
- **Strict Rule:** Must handle the `client:idle` mounting of the global Search Modal to prevent blocking the initial LCP render.

### 3.3 `<ToolHeader />` (The Hook)
- **Purpose:** The H1 hero section for every tool.
- **Strict Rule:** Must implement `nt_tool_usage` localStorage tracking within a `<script>` tag that executes purely on the client side, bypassing Astro's SSG build.

### 3.4 `<Accordion />` (The FAQ Engine)
- **Purpose:** SEO-optimized expandable FAQ sections.
- **Strict Rule:** Must use CSS Grid transition hacks (`grid-template-rows: 0fr` to `1fr`) to animate height without relying on expensive JavaScript recalculations.

---

## 4. Typography & Layout Grids

### 4.1 Typography Scale (Inter Font)
- **H1 (Hero):** `text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60`
- **H2 (Section):** `text-2xl md:text-3xl font-bold text-white`
- **H3 (Card Title):** `text-xl font-semibold text-white/90`
- **Body (Prose):** `text-base text-white/70 leading-relaxed`

### 4.2 Standard Responsive Grid
Always use standard 12-column logic via Tailwind flex/grid.
- **Desktop Layout:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Max Width Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
