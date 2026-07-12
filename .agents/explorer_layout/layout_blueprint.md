# Layout Blueprint — NumanX Tools Hub Component Layouts

This document serves as the comprehensive design and structural blueprint for NumanX Tools Hub, detailing the grid structures, flex containers, borders, colors, animations, and interactive behaviors across key pages:

- `src/pages/index.astro` (Landing Page)
- `src/pages/about.astro` (About Page)
- `src/pages/contact.astro` (Contact Page)
- `src/pages/blog/index.astro` (Blog Page)
- `src/pages/tools/index.astro` (Tools Directory)

---

## 1. Global Visual & Interaction Layer

The global layout environment is powered by `MainLayout.astro` and styling tokens defined in `global.css` and `design-tokens.css`.

### Theme & Colors

The application implements a dark theme by default (with a light theme fallback).

- **Base background**: `var(--bg-base)` = `#0a0a0b`
- **Surface backgrounds**:
  - `--surface-1` = `rgba(255, 255, 255, 0.02)`
  - `--surface-2` = `rgba(255, 255, 255, 0.04)`
  - `--surface-3` = `rgba(255, 255, 255, 0.06)`
  - `--surface-nav` = `rgba(10, 10, 11, 0.9)`
  - `--surface-search` = `rgba(0, 0, 0, 0.85)`
- **Borders**:
  - `--border-surface` = `rgba(255, 255, 255, 0.06)` (Class: `border-surface`)
  - `--border-surface-2` = `rgba(255, 255, 255, 0.08)` (Class: `border-surface-2`)
  - `--border-surface-3` = `rgba(255, 255, 255, 0.1)` (Class: `border-surface-3`)
  - `--border-subtle` = `rgba(39, 39, 42, 0.5)`
  - `--border-default` = `rgba(39, 39, 42, 0.8)`
- **Texts**:
  - `--text-primary` = `#f4f4f5` (Class: `text-primary`)
  - `--text-secondary` = `#d4d4d8` (Class: `text-secondary`)
  - `--text-tertiary` = `#a1a1aa` (Class: `text-tertiary`)
  - `--text-muted` = `#8a8a95` (Class: `text-muted`)
  - `--text-dim` = `#767680` (Class: `text-dim`)
- **Brand Gradients**:
  - `--purple-400` (`#fb7185` - Sunset Rose) to `--purple-500` (`#ff5a36` - Glowing Orange-Red) to `--blue-500` (`#f97316` - Glowing Orange)
  - Active/Glow shadows use Volcanic Sunset (`#ea580c`), Amber (`#fbbf24`), and Purple (`#ff5a36`).

### Ambient Graphics

- **Orbiting Background Orbs**: Two animated gradients breathing behind content:
  - Top-Left: `bg-fuchsia-600/5 blur-[150px] rounded-full`
  - Bottom-Right: `bg-amber-600/5 blur-[150px] rounded-full`
- **Scanning Grid Lines**: Repeating linear gradient overlays to simulate retro-futuristic grid meshes (`rgba(255, 255, 255, 0.01)` at 40px intervals).
- **Vignette shadow**: Central transparent to outer dark gradient overlay (`rgba(5, 5, 5, 0.8)`).
- **WebGL Particle Canvas**: Rendered via Three.js with mouse magnetic pull and voice reactivity.

### Interaction Engines

- **Scroll Layer**: Lenis smooth scroll active on the main thread.
- **GSAP Animations**:
  - `reveal-text`: blur-out to clear entry on scroll.
  - `group-section`: staggered 3D card entry (`rotationX: 10`, `scale: 0.9` -> 0 on scroll).
- **Magnetic 3D Tilt**: Real-time cursor coordinates tilt card items around center axis within 4 degrees.
- **Audio Feedback**: Sine oscillator ticks played via browser `AudioContext` on element hover (`.audio-trigger`).

---

## 2. Page-Specific Layout Blueprints

### A. Landing Page (`src/pages/index.astro`)

- **Wrapper**: `MainLayout` wrapping a `min-h-screen pt-12 pb-32 px-4 sm:px-6` main element. Inner layout wraps section elements in a `max-w-7xl mx-auto space-y-32` flex container.
- **Marquee Section**:
  - Full-viewport row breakout: `w-[100vw] left-1/2 -ml-[50vw]`.
  - Borders: `border-y border-white/5`.
  - Background: `#0a0a0c/80` backdrop blur.
  - Inner Marquee: Flex container set to `w-[200%]`, running a CSS keyframe translating `translateX(0%)` to `translateX(-50%)` over 40 seconds.
- **Ecosystem Stats Bento Grid**:
  - Grid Configuration: `grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[180px]`.
  - _Stat Card_: Span: `col-span-1 md:col-span-2 lg:col-span-2 row-span-2`. Contains big stat text, custom yellow badge, text, and description.
  - _Small Info Card 1 & 2_: Default grid cell width/height (1x1 span). Includes absolute offset SVG graphics.
  - _Horizontal Security Card_: Span: `col-span-1 md:col-span-2 lg:col-span-2` (1 row tall, 2 cols wide). Incorporates custom CSS concentric circles spinning in opposite directions.
- **Featured Utilities Grid**:
  - Grid Configuration: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
  - Cards: Uniform 3D interactive spotlight cards (`card-spotlight`) with borders, hover borders, bottom transition indicators, and layout badges.
- **Architecture Benefits Bento Grid**:
  - Grid Configuration: `grid-cols-1 md:grid-cols-3 gap-6`.
  - Custom column spans for items mapping over `whyNumanX`:
    - Zero Server Processing: `col-span-1 md:col-span-2 row-span-2`
    - Military-Grade Privacy: `col-span-1`
    - Enterprise Quality, Free: `col-span-1`
    - Progressive Web Tools: `col-span-1`
    - Instant Execution: `col-span-1 md:col-span-2`
- **Dual Column Blog & Roadmap Layout**:
  - Grid Configuration: `grid grid-cols-1 lg:grid-cols-12 gap-8`.
  - _Left Column (Blog)_: Span `lg:col-span-8 flex flex-col`. Contains an inner grid of `grid-cols-1 sm:grid-cols-2 gap-6`. Individual blog cards utilize radial gradient headers.
  - _Right Column (Roadmap)_: Span `lg:col-span-4 flex flex-col`. Houses a single vertical roadmap stepper component inside a `card-spotlight` box.
- **Footer CTA Banner**:
  - Container card: Rounded structure `rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden bg-[#050505] border border-white/10`.
  - Internal alignment: Flex column with nested forms.

---

### B. About Page (`src/pages/about.astro`)

- **Wrapper**: `MainLayout` wrapping `max-w-5xl mx-auto` structure.
- **Hero Column**: Flex column, center aligned, spacing text, tags, and dual CTAs.
- **Founder Profile Card**:
  - Outer: `relative rounded-2xl md:rounded-3xl border border-surface bg-surface-1 backdrop-blur-2xl p-6 md:p-10 shadow-2xl`. Includes top border accent lines: `absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent`.
  - Content structure: Responsive flex direction `flex flex-col md:flex-row items-center gap-8`.
  - Internal timeline divider: `border-t border-surface mt-10 pt-8`. Timeline columns structured in a responsive 4-column grid: `grid grid-cols-2 md:grid-cols-4 gap-4`.
- **Vision Grid**:
  - Grid Configuration: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.
  - Cards: `rounded-xl border border-surface bg-surface-1 p-6 text-left hover:border-purple-500/30 hover:bg-surface-2 transition-all`.
- **Ecosystem Product Roadmap Timeline**:
  - Outer Card: Glass card container enclosing a vertical timeline list.
  - Stepper structure: `flex items-start gap-5`. Vertical alignment lines: `w-px flex-1 bg-gradient-to-b from-purple-500/50 to-transparent min-h-[60px]` connecting circular nodes (`w-8 h-8 rounded-full bg-purple-600`).
- **Values Grid**:
  - Grid Configuration: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`.
  - Cells: Smaller content modules with centered icons and labels.

---

### C. Contact Page (`src/pages/contact.astro`)

- **Wrapper**: `MainLayout` enclosing a `max-w-5xl mx-auto` wrapper.
- **Contact Main Grid**:
  - Grid Configuration: `grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16`.
  - _Left Column (Form)_: Span `lg:col-span-3`. Bordered card wrapping a custom grid-based form (`grid-cols-1 sm:grid-cols-2 gap-4`). Input boxes utilize dark background elements `bg-black/40 border border-surface`.
  - _Right Column (Info Sidebar)_: Span `lg:col-span-2`. Standard flex-col container layout with multiple card widgets (`space-y-5`).
    - _Follow Us Widget_: Flex row wrapping circular social button modules: `w-9 h-9 rounded-xl bg-surface-2 border border-surface flex items-center justify-center hover:bg-surface-3 hover:border-purple-500/30`.

---

### D. Blog Page (`src/pages/blog/index.astro`)

- **Wrapper**: `MainLayout` wrapping a `max-w-6xl mx-auto` grid block.
- **Featured Glass Card**:
  - Container style: `glass-card rounded-3xl p-6 md:p-10 mb-12 overflow-hidden`.
  - Inner structure: Responsive `flex flex-col md:flex-row gap-6 md:gap-10 items-start`.
  - Image block: `w-full md:w-[280px] shrink-0 aspect-[4/3] rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-zinc-800`.
- **Search & Filters Bar Layout**:
  - Card wrapper: `bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl mb-8`.
  - Inner Search: Input with search icon absolute positioned on the left, and a clear button absolute positioned on the right.
  - Category row: Flex row wrapping items with `flex gap-2 flex-wrap mt-4`. Buttons change border-color and backgrounds between active/inactive.
- **Posts Card Grid**:
  - Grid Configuration: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`.
  - Card style: `post-card group glass-card rounded-3xl p-6 hover:border-purple-500/40 hover:-translate-y-1`. Contains aspect-ratio images, categories badges, dates, and title texts.

---

### E. Tools Directory (`src/pages/tools/index.astro`)

- **Wrapper**: `MainLayout` wrapping `max-w-7xl mx-auto`.
- **Search & Filter Container**:
  - Sized wrapper: Centered width `w-full max-w-xl mx-auto px-4 mt-8 space-y-4`.
  - Category buttons: Flex wrapping items with `flex flex-wrap gap-2 justify-center`. Buttons swap styles between active and inactive.
- **Tools Card Grid**:
  - Grid Configuration: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8`.
  - Card style: `tool-card bg-surface-1/50 border border-surface p-5 rounded-2xl flex flex-col justify-between hover:border-purple-500/50 hover:bg-surface-2`.
  - Initials wrapper: `w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600/20`.
  - CTA Button: `mt-5 w-full bg-surface-2 hover:bg-purple-600 text-secondary hover:text-white text-xs font-medium py-2.5 rounded-xl border border-surface-2 hover:border-purple-500/50`.

---

## 3. Structural Synthesis

| Dimension                   | Standard Design Token / Class                                                                                                                                              | Custom Page Breakouts                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Page Outer Spacing**      | `px-6` (about, contact, blog, tools), `min-h-screen pt-8/16 pb-20`                                                                                                         | `px-4 sm:px-6 pt-12 pb-32` on Landing                                                  |
| **Max Content Width**       | `max-w-5xl` (about, contact), `max-w-6xl` (blog)                                                                                                                           | `max-w-7xl` on Landing & Tools                                                         |
| **Grid Column Gaps**        | `gap-4` (timeline, vision, stats grids), `gap-5` (blog posts, recently used grids), `gap-6` (featured grid, tools grid), `gap-8` (main contact grid, blog-roadmap columns) | Landing Stats Bento: `gap-6 auto-rows-[180px]`                                         |
| **Card Borders**            | `border border-surface` (`rgba(255, 255, 255, 0.06)`), `border border-zinc-800`                                                                                            | Landing cards: `border border-white/5` (equivalent)                                    |
| **Card Backgrounds**        | `bg-surface-1` (`rgba(255, 255, 255, 0.02)`)                                                                                                                               | Landing: `bg-[#0a0a0c]/80` backdrop blur; Blog cards: `glass-card` background gradient |
| **Interactive Transitions** | `hover:border-purple-500/30 hover:bg-surface-2 hover:shadow-lg`                                                                                                            | Landing/Tools cards: 3D tilt magnet script tracking mouse coordinates                  |
| **Accent Text Styles**      | `bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent`                                                                                | Landing: `bg-gradient-to-r from-amber-400 to-peach-400`                                |
