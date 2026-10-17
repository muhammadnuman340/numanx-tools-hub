# Code & Text Editor UI, Gutter Alignment, and Accessibility Standard

This document defines the strict workspace design, structural, and behavioral standards for all code editors, textareas, dual-box comparison layouts, line number gutters, and typography across NumanX Tools Hub.

---

## 1. Line Numbers Gutter Rules

### 1.1 Zero Vertical Drift (Mathematical Metric Matching)
The gutter line numbers and textarea lines must match to the exact sub-pixel.
* **Metric Equality:**
  - Font Size: 14px (or matched dynamic font size)
  - Line Height: 24px (or `Math.round(fontSize * 1.7)px`)
  - Vertical Padding: `py-3` (12px top and bottom) on both gutter and input
* **Inline Style Enforcement:** Both `#line-nums` and the `<textarea>` must declare matching inline styles:
  ```html
  style="line-height: 24px; font-size: 14px;"
  ```
* **Lockstep Resizing:** When font scaling controls (`A−` / `A+`) are triggered, update both the textarea and line numbers simultaneously:
  ```javascript
  const updateEditorFontSize = (newSize) => {
    const clamped = Math.max(10, Math.min(24, newSize));
    const lineHeight = Math.round(clamped * 1.7);
    textarea.style.fontSize = clamped + 'px';
    textarea.style.lineHeight = lineHeight + 'px';
    lineNums.style.fontSize = clamped + 'px';
    lineNums.style.lineHeight = lineHeight + 'px';
    try { localStorage.setItem('nt_fs', String(clamped)); } catch (e) {}
  };
  ```

### 1.2 Strict Container Containment & Overflow Prevention
* **Encapsulation:** The line numbers gutter (`#line-nums`) must ALWAYS be enclosed inside the same outer card container as the `<textarea>`. It must NEVER sit outside the container's rounded borders.
* **Overflow Protection:** Gutter must have `h-full select-none overflow-hidden shrink-0` inside a fixed or relative parent container. It must NEVER grow or stretch the parent card downwards when line counts increase.
* **Pointer Events:** Gutter must have `pointer-events-none` so mouse text selections pass through without highlighting line numbers.
* **Tabular Numbers:** Must apply `font-mono tabular-nums` so numbers like `9`, `10`, `99`, `100` remain strictly aligned in the vertical column.
* **Gutter Styling Standard:**
  ```html
  <div
    id="line-nums"
    class="w-12 shrink-0 h-full select-none overflow-hidden font-mono text-sm leading-6 text-right pr-3.5 py-3 text-zinc-500/80 bg-zinc-950/60 border-r border-white/5 whitespace-pre pointer-events-none tabular-nums"
    style="line-height: 24px; font-size: 14px;"
  >1</div>
  ```

### 1.3 Bidirectional Scroll & Event Lifecycle
* **Synchronized Scrolling:** Gutter scroll follows the textarea:
  ```javascript
  textarea.addEventListener('scroll', () => {
    lineNums.scrollTop = textarea.scrollTop;
  });
  ```
* **Immediate Initialization:** Gutter must be populated on initial mount (matching default content or saved drafts), on every `input` event, on toolbar clicks, and on clear actions.

---

## 2. Multi-Box & Split-Pane Alignment Rules

### 2.1 Top Edge Alignment
* Top header action rows above side-by-side columns (e.g. Left Input vs Right Output, or Original vs Modified) must share an identical minimum height (`min-h-[38px] mb-2` or `min-h-[32px] mb-2`).
* Auxiliary controls (font scaling, format dropdowns, clear buttons) must be integrated into this header row rather than creating unbalanced secondary rows that push one box down.

### 2.2 Bottom Edge Alignment
* Both columns must share identical explicit heights (e.g., `h-[520px]`, `h-[480px]`, or `h-[320px]`) with `rounded-xl overflow-hidden`.
* Disallow unbounded vertical resizing (`resize-y`) on side-by-side editors that breaks the grid alignment. Use `resize-none` and provide `overflow-y-auto`.

### 2.3 Analytics & Character Frequency Formatting
* Never render tall, unbounded percentage bars in analytics sections.
* Render frequency data as compact, inline glassmorphism chips:
  ```html
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-xs font-mono">
    <strong class="text-purple-400 uppercase">${char}</strong>
    <span class="text-zinc-400">${count}</span>
  </span>
  ```

---

## 3. Typographic Scale & Design Tokens

### 3.1 Strict 6-Step Type Scale
Never use arbitrary Tailwind pixel values (`text-[9px]`, `text-[10px]`, `text-[11px]`). Use:
1. `text-xs` (12px) - Micro badges, tags, metadata, line numbers
2. `text-sm` (14px) - Code inputs, editors, preview body copy, toolbar buttons
3. `text-base` (16px) - Section subtitles, lead copy
4. `text-xl` (20px) - Component headings (H3)
5. `text-2xl` (24px) - Section titles (H2)
6. `text-3xl` / `text-4xl` (30px–36px) - Page hero titles (H1)

### 3.2 4-Tier Semantic Text Colors
1. High Emphasis: `text-zinc-100` / `text-white`
2. Medium Emphasis: `text-zinc-300`
3. Muted / Secondary: `text-zinc-400` / `text-zinc-500`
4. Interactive Accent: `text-purple-400` (or tool accent color)

### 3.3 3-Tier Corner Radii
1. Buttons, inputs, dropdowns: `rounded-lg` (8px)
2. Cards, panels, preview boxes: `rounded-xl` (12px)
3. Pills & swatches: `rounded-full` (9999px)

---

## 4. Accessibility & WCAG 2.2 AA Standards

1. **Discernible Names:** All icon buttons (`🔗`, `⛶`, `✕`, `A−`, `A+`) and theme swatches must include explicit `aria-label` and `title` attributes.
2. **Keyboard Navigable Regions:** Live preview panels and scrollable code outputs must declare `role="region"`, `tabindex="0"`, and a descriptive `aria-label`.
3. **Contrast:** Text must maintain a minimum 4.5:1 contrast ratio against dark surfaces.
4. **Focus Visibility:** High-contrast focus states: `focus:outline-none focus:ring-2 focus:ring-purple-400` or `focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500`.
