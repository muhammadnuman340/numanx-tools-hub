# DESIGN.md — NumanX Tools Hub

The visual system for every page. Product truth lives in [PRODUCT.md](./PRODUCT.md).
This file replaces the "God-Tier Glassmorphism" rules in [COMPONENT_SYSTEM.md](./COMPONENT_SYSTEM.md) for new work. Migrate existing pages gradually (order in Section 10).

---

## 1. Archetype: Swiss Technical Grid

**Why:** the product is 65 working tools. The page should look like an instrument, not a launch page: the workspace first, numbers in mono, hairline structure, very little decoration.

What that means in practice:

- 1px hairlines and surface shifts instead of glass, glow and blur.
- Numbered steps and sections (`01 / 03`) on tools and kits.
- Monospace for numbers, file sizes, results, keyboard keys and labels.
- Left-aligned headings on tool pages; the tool workspace inside the first 300px.
- One accent colour, used only for the primary action, focus and active state.

Page overrides go in `design-system/pages/<route>.md` and list only the differences.

---

## 2. Colour tokens (OKLCH)

**Brand hue decision (2026-10-31):** amber (`--hue: 75`), chosen by the owner from the [colour picker](./docs/ui-audit-2026/brand-colour-picker.html). Accent ≈ `#f5ae39` with dark text on it (≈ 9.9:1). Neutrals take a warm tint from the same hue (page ≈ `#100d08`).

Consequences:

- Violet (`#a855f7`, 113 uses), pink, blue and the orange/rose values stored under `--purple-*` in `design-tokens.css` all stop being brand or decorative colours.
- The logo mark, favicon, app icons, default share image and manifest colours move to amber (implementation plan, Phase 6).
- Amber sits close to the usual "warning" yellow, so the warning status uses a separate orange (hue 50) and is **always** shown with an icon and text, never colour alone.
- The focus ring is a pale amber (`--focus`, ≈ `#ffd592`) with a 2px offset, so it stays visible around amber buttons.

```css
:root,
:root[data-theme='dark'] {
  --hue: 75; /* amber */
  --accent-c: 0.15;

  /* Surfaces — tinted toward the brand hue, never pure black */
  --bg: oklch(0.16 0.012 var(--hue));
  --panel: oklch(0.2 0.014 var(--hue));
  --panel-2: oklch(0.24 0.016 var(--hue));
  --well: oklch(0.13 0.01 var(--hue)); /* recessed inputs, dropzones */
  --line: oklch(0.98 0.005 var(--hue) / 0.1);
  --line-strong: oklch(0.98 0.005 var(--hue) / 0.18);

  /* Text */
  --text: oklch(0.95 0.008 var(--hue));
  --text-soft: oklch(0.76 0.014 var(--hue)); /* minimum for any body text */
  --text-faint: oklch(0.66 0.014 var(--hue)); /* large text or non-essential labels only */

  /* Accent */
  --accent: oklch(0.8 var(--accent-c) var(--hue)); /* ≈ #f5ae39 */
  --accent-fg: oklch(0.18 0.02 var(--hue)); /* ≈ #171008, 9.9:1 on accent */
  --focus: oklch(0.9 0.1 var(--hue)); /* ≈ #ffd592, used with a 2px offset */

  /* Status — always paired with text or an icon */
  --success: oklch(0.74 0.15 150); /* ≈ #5ac576 */
  --warning: oklch(0.72 0.17 50); /* ≈ #f67f2f, kept apart from the amber accent */
  --danger: oklch(0.68 0.19 27); /* ≈ #f75e54 */

  /* Shape */
  --radius-outer: 14px;
  --pad: 6px;
  --radius-inner: calc(var(--radius-outer) - var(--pad));

  /* Rhythm */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  color-scheme: dark;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

Rules:

- No raw hex in `.astro` files (510 today). Tailwind arbitrary values like `bg-[#0a0a0c]` map to tokens.
- 60-30-10: about 60% `--bg`, 30% `--panel`/`--panel-2` and lines, 10% accent.
- Hover and pressed shades come from `color-mix()`, not new colours:
  `background: color-mix(in oklch, var(--accent), var(--text) 10%);`
- Contrast targets: body text 4.5:1, large text and UI borders 3:1. **Verify every pair with a checker** after implementing. Today `zinc-600` (2.6:1), `zinc-500` (4.2:1) and `--text-dim` (4.5:1 on the page, 4.2:1 on cards) fail and are banned for body text.
- Light theme: either build it properly with the same token names, or remove the theme toggle. A toggle that resets on reload is not allowed.

---

## 3. Typography

| Tier        | Font                                                                            | Use                                                            | Rules                                                              |
| ----------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Display     | Inter 700–800 (optional later: a narrower grotesk such as Archivo, self-hosted) | H1, H2, kit titles                                             | Tracking −0.02em at large sizes; solid colour, never gradient text |
| Body / UI   | Inter 400–600                                                                   | Paragraphs, labels, controls                                   | Line height 1.55–1.65; 60–75ch line length                         |
| Mono / data | JetBrains Mono 400–600                                                          | Results, numbers, file sizes, keys, step numbers, small labels | `font-variant-numeric: tabular-nums` on anything that updates      |

Fluid scale:

```css
:root {
  --step--1: clamp(0.83rem, 0.8rem + 0.15vw, 0.9rem);
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.1rem);
  --step-1: clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem);
  --step-2: clamp(1.56rem, 1.38rem + 0.9vw, 2.1rem);
  --step-3: clamp(1.95rem, 1.62rem + 1.6vw, 2.6rem); /* tool H1 max */
  --step-4: clamp(2.44rem, 1.9rem + 2.7vw, 3.6rem); /* homepage H1 max */
}
.num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

Tool H1s use `--step-3` (today they are ~96px with a gradient word). One label style only: mono, 12px, uppercase, `--text-faint`.

---

## 4. Layout

Max content width 1200px; gutters 16px (mobile), 32px (desktop). Breakpoints tested: 320, 375, 768, 1024, 1440.

### 4.1 Tool page template

```text
┌──────────────────────────────────────────────────────────────┐
│ NumanX Tools Hub   Tools ▾  Kits  Blog            [⌕ Search] │  56px, solid surface, 1 hairline
├──────────────────────────────────────────────────────────────┤
│ Home / Image tools / Image Compressor                        │
│ Image Compressor — JPG, PNG & WebP           [☆ Save] [Share]│  H1 step-3, left
│ Compress images in your browser. Files never leave your device.│ one line
├──────────────────────────────────────┬───────────────────────┤
│ 01 DROP IMAGES                       │ 02 SETTINGS           │
│ ┌──────────────────────────────────┐ │ Quality  ○ Low ● Med  │
│ │  Drop images or browse          │ │ Format   [Keep ▾]     │
│ │  (well surface, 60% width)      │ │ [ Compress images ]   │
│ └──────────────────────────────────┘ │                       │
├──────────────────────────────────────┴───────────────────────┤
│ 03 RESULT   photo.jpg  2.4 MB → [n] KB  [Download] [Copy]    │  mono numbers
│ Next step:  Resize for YouTube →   Convert to WebP →         │
├──────────────────────────────────────────────────────────────┤
│ How it works · FAQ · Related tools (one block, 4–6 links)    │
└──────────────────────────────────────────────────────────────┘
```

Rules: workspace starts within 300px of the top on desktop and within the first screen on a 375×812 phone. One "How to use", one "Related" block, one support/affiliate slot (after the result). Target page length: under ~4,500px on desktop.

### 4.2 Homepage template

```text
┌──────────────────────────────────────────────────────────────┐
│ 65 free tools that run in your browser                       │  H1 step-4, left
│ [⌕  Search tools — "compress", "NRR", "json"            ]    │  search is the hero
│ Popular: Image Compressor · QR Generator · Word Counter · NRR │
├───────────────┬───────────────┬──────────────────────────────┤
│ IMAGE  10     │ DEVELOPER 17  │ CRICKET 6                    │  categories as ledger
│ Compress      │ JSON          │ Run rate                     │  rows, not floating
│ Resize …      │ JWT …         │ NRR …                        │  cards
├───────────────┴───────────────┴──────────────────────────────┤
│ KITS  01 Cricket Match Centre  02 Thumbnail Pack  03 …       │
├──────────────────────────────────────────────────────────────┤
│ How it works (files stay on your device) · Blog · Support    │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Mobile

- Header: logo, search icon, menu button. Nav links and secondary buttons move into the menu. **Nothing in the header may exceed the viewport width.**
- Tool settings stack under the workspace; the primary action becomes a sticky bottom bar once the workspace has input.
- `body { overflow-x: clip; }` as a safety net, not as the fix.

### 4.4 Grouping

No cards inside cards. Group with spacing, `divide-y` hairlines, `--panel` vs `--panel-2`, or a numbered heading.

---

## 5. Components

### 5.1 Buttons

| Variant   | Use                                                  |
| --------- | ---------------------------------------------------- |
| Primary   | One per view: the main action ("Compress images")    |
| Secondary | Download, copy, share — outline with `--line-strong` |
| Ghost     | Toolbar and icon buttons — must have `aria-label`    |

```css
.btn {
  min-height: 44px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-inner);
  background: var(--accent);
  color: var(--accent-fg);
  font-weight: 600;
  transition:
    transform 120ms ease-out,
    background-color 120ms ease-out;
}
@media (hover: hover) {
  .btn:hover {
    background: color-mix(in oklch, var(--accent), var(--text) 10%);
  }
}
.btn:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
.btn:active {
  transform: scale(0.98);
}
.btn[aria-busy='true'] {
  cursor: progress;
}
.btn:disabled,
.btn[aria-disabled='true'] {
  opacity: 0.55;
  cursor: not-allowed;
}
```

Every control styles six states: default, hover (hover devices only), focus-visible, active, loading, error/empty. Disabled shows a reason when it isn't obvious. Touch targets 44×44px; never under 24×24px.

### 5.2 Dropzone

States, each with visible text and announced through the status region:
`idle` → `drag-over` (border `--accent`, copy "Release to add") → `processing` (real progress: "3 of 8 images") → `done` (result list + download + "Add more") → `error` (reason + retry).

### 5.3 Result panel

Mono numbers, before → after, primary download, copy, "Share as image" where results are shareable (cricket, calculators). Followed by the **Next step** row (2–3 links to the next tool in the workflow).

### 5.4 Status region (every tool)

```html
<div id="tool-status" role="status" aria-live="polite" data-agent-status="ready" class="sr-only"></div>
```

Update text and `data-agent-status` through `ready` → `processing` → `complete` / `error`.

### 5.5 Tool links in lists

Homepage categories use ledger rows (name, one-line description, arrow) with hairline dividers. `/tools/`, category pages and post lists use the one shared card (`src/components/ui/ToolCard.astro` and its post variant). Phase 7 chose this over ledger rows for those pages. No 3D tilt, no spotlight, no "LAUNCH TOOL" labels in low-contrast grey.

### 5.7 Articles (blog, guides, comparisons)

- `BlogLayout.astro`: text column `max-w-[68ch]`, solid headings, author line with published and "Updated" dates, no reading progress bar.
- Share image: `public/images/og/<slug>.png`, made by `node scripts/make-og-images.mjs`. Run it when you add a post; the build warns if a card is missing. If there is no card, the post's own non-SVG `image` is used, then the site default. The rule lives in `src/lib/ogImage.ts`; don't add another one.
- One "Try it" tool box per post. It picks a tool by matching whole words in the slug, tags, title and description (`TOOL_MATCHES`). Add a rule when a new topic has no fitting tool.
- Paid or affiliate offers (`MonetizationSlot`) are labelled "Partner link" and use `rel="sponsored"`. Never call them "Recommended".
- Counts in copy ("65 tools") come from `tools.length`, never typed by hand.

### 5.6 Floating elements

At most **one** fixed floating element per page (back-to-top, appearing after scrolling). Feedback moves to the result panel and footer; the assistant opens from the header or search. The cookie banner is a compact bar: max ~96px tall on desktop, fully inside the viewport on mobile, buttons side by side.

---

## 6. Motion

- Animate only `transform` and `opacity`. No `filter: blur()` animations.
- Durations: micro 100–150ms, entrances 200–260ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Content is visible by default. A reveal may add a small fade or 8px rise, runs once, and never hides content again on scroll-up. If JavaScript fails or motion is reduced, everything is still visible.
- GSAP always inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; kill ScrollTriggers on `astro:before-swap`.
- Background canvases: pause off-screen and on hidden tabs, cap pixel ratio at 2, still frame under reduced motion, never delay the workspace or LCP.
- `backdrop-filter` on at most 2 layers per viewport (header, modal). Today 4–5 layers are active in the first viewport of every page.

---

## 7. Copy patterns

| Instead of                               | Write                                       |
| ---------------------------------------- | ------------------------------------------- |
| Smart Image Compressor Pro               | Image Compressor — JPG, PNG & WebP          |
| Built Uncompromisingly                   | How it works                                |
| Enterprise Quality, Free                 | Free, no sign-up, no watermark              |
| NEURAL CORE ACTIVE / THINK IT. BUILD IT. | (remove)                                    |
| Get Started (header)                     | (remove) or "All tools"                     |
| LAUNCH TOOL                              | Open                                        |
| Jarvis Voice                             | (move into search as a mic icon, or remove) |

---

## 8. Accessibility baseline

- One H1; landmarks; skip link (exists).
- Visible labels on every field; errors tied with `aria-describedby`.
- Icon-only buttons have `aria-label` (113 missing today).
- Focus ring visible and not hidden under the sticky header (`scroll-margin-top: 72px` on targets).
- Works at 320px width and 200% zoom without horizontal scroll.
- `prefers-reduced-motion` respected in CSS **and** JS.

---

## 9. Banned here

- Gradient text (`bg-clip-text text-transparent`) and gradient H1 words.
- Glass tiers (`bg-white/[0.0x] backdrop-blur-*`) as the default surface.
- Purple → pink, orange → rose, or rainbow gradients for decoration.
- Custom cursor, scroll progress bar, starfield/noise/aurora behind tool pages.
- "Pro" suffix on tool names; emoji in headings.
- Hype words listed in [PRODUCT.md](./PRODUCT.md) Voice.
- Unverified numbers in UI copy.
- `text-zinc-500`, `text-zinc-600`, `text-dim` for body text.
- Raw hex colours in components.
- Scroll reveals with `toggleActions: '… reverse'` or blur filters.
- More than one floating fixed button.

---

## 10. Migration order

Step-by-step tasks, checks and targets: [docs/NUMANX-UI-IMPLEMENTATION-PLAN-2026.md](./docs/NUMANX-UI-IMPLEMENTATION-PLAN-2026.md).

1. Mobile header overflow fix; compact cookie bar; one floating element.
2. Tool header compaction (workspace in first 300px) — shared `ToolHeader` component, affects all 65 tools at once.
3. Remove duplicated sections in `ToolContentSections` (second "How to use", "Why use" + "Benefits", 6–7 related blocks, second support bar).
4. Tokens: add the OKLCH sheet, alias old token names to new ones, then replace raw hex file by file.
5. Homepage rebuild to template 4.2.
6. Contrast pass (replace banned greys).
7. Motion pass (GSAP matchMedia, remove reverse/blur, pause background canvas).
