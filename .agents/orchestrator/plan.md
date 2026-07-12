# Plan: NumanX Tools Hub Upgrades (UX, Typography, Cover Images)

This plan outlines the steps to upgrade NumanX Tools Hub with universal tool UX enhancements, blog typography/layout polish, and branded cover images for all 16 blog posts.

## Milestones

1. **Analysis & Design (Explorer)**
   - Analyze existing tool pages in `src/pages/tools/` to determine where and how to integrate:
     - Clipboard copy (on text/code outputs)
     - Download/Export (on file/text/image outputs)
     - Keyboard shortcut hints (e.g. Ctrl+Enter)
     - Live character/word/line counter (for text inputs)
     - Reset/Clear + Undo (state restoration)
     - Fullscreen mode toggle
   - Analyze `src/layouts/BlogLayout.astro` and `src/pages/blog/index.astro` to design typography and layout polish.
   - Design a branded programmatic or asset-based generator for 16 blog cover PNGs.

2. **Universal Tool UX Upgrades (Worker)**
   - Implement the 6 universal UX features in a reusable, modular fashion or directly across all relevant tool pages.
   - Ensure it conforms to the God-Tier aesthetic (purple/black/gold gradients, glassmorphic UI).

3. **Blog Typography & Layout Polish (Worker)**
   - Update `BlogLayout.astro` with premium typography hierarchy, white text, purple accents, gold highlights, and proper spacing.
   - Add styled author info, reading time, tags, date to posts.
   - Update `src/pages/blog/index.astro` to display the cards with cover images, category pills, reading times, and short excerpts.

4. **Branded Blog Cover Images (Worker / Script)**
   - Generate 16 unique PNG images matching the NumanX brand palette (dark, purple gradients, gold accent text) and reflecting post topics.
   - Save to `public/images/blog/<slug>.png`.
   - Update all 16 markdown frontmatter `image` references to these PNG files.

5. **Verification & Audit (Reviewer, Challenger, Forensic Auditor)**
   - Run `npm run build` to ensure successful compilation.
   - Run verification checks to confirm the features are visible on at least 10 tools, and that all 16 blog posts have cover images and required meta info.
   - Perform Forensic Audit to verify no cheating/hardcoding of audit metrics.
