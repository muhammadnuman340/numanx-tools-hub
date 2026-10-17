# NumanX Tools Hub — Development & Design Rules

## Core Project Guidelines
- Framework: Astro (Static Site Generation), Tailwind CSS, TypeScript.
- Design System: Dark theme by default, modern glassmorphism, high contrast (WCAG 2.2 AA).
- Test & Audit Integrity: Always run `npm test` and `npm run audit` before completing tasks. All 71 tool pages must maintain complete SEO metadata, zero mojibake encoding issues, and direct canonical links without trailing slash redirects.

## UI, Editor, and Accessibility Rules
Always adhere to the detailed rules defined in `.agents/rules/editor-design-and-alignment.md`:
1. **Editor Box & Gutter Containment:** Line number gutters (`#line-nums`) must always be encapsulated inside the unified editor container with `h-full overflow-hidden select-none font-mono tabular-nums`.
2. **Zero Vertical Drift:** Ensure mathematical metric equality (`font-size: 14px; line-height: 24px; py-3;`) between `#line-nums` and `<textarea>`. Resizing via `A−` / `A+` must scale both elements in lockstep.
3. **Dual Box Alignment:** Side-by-side columns (Input vs Output, Original vs Modified) must align pixel-for-pixel at the top (matching `min-h-[38px] mb-2` header bars) and bottom (identical explicit heights, e.g. `h-[520px]`, `h-[480px]`, or `h-[320px]`).
4. **Typographic Scale:** Strict 6-step scale (`text-xs` 12px, `text-sm` 14px, `text-base` 16px, `text-xl` 20px, `text-2xl` 24px, `text-3xl` / `text-4xl` 30-36px). Never use arbitrary pixel classes like `text-[9px]`, `text-[10px]`, or `text-[11px]`.
5. **Analytics & Frequency:** Use compact inline glassmorphism chips instead of tall progress bars.
6. **WCAG 2.2 AA Accessibility:** Ensure all icon buttons, color swatches, and controls have discernible `aria-label`s, keyboard accessibility (`role="region" tabindex="0"`), and clear focus rings.
