# NumanX Tools Hub

Astro site with 65 browser-only tools. Live at https://toolshub.numanxstudio.com (Cloudflare Pages project `numanx-tools`).

## Ship and check

- Every push to `master` deploys (GitHub Actions `deploy.yml`, ~3 min). Work goes through a PR; **the user clicks Merge** (the auto-mode classifier blocks Claude from merging).
- Use the `release-check` skill. It's one command each to release (`release.mjs`), confirm live (`check-live.mjs`) or test forms (`forms-check.mjs`).
- Forms reach email via Cloudflare → Google Apps Script (`scripts/apps-script-combined.gs`, pasted by hand). Details are in memory `form-email-setup`.

## Rules

- Design follows `DESIGN.md` (one amber accent, OKLCH tokens, no gradient text, glass or glow). Product truth is in `PRODUCT.md`.
- Don't commit `docs/` audit reports.
- Several sessions may share this folder. Only commit files you changed; never stash, reset or check out over others' uncommitted work.
- ESLint has 3 old parse errors (lorem-ipsum, ai-code-assistant, MonetizationSlot) and 4 no-set-html-directive warnings (7 problems total). Don't report them as new.
- Files use Windows line endings. Use the Edit tool, not regex rewrites.

## Keep usage low

- Short sessions: one job per session. Start a new one rather than continuing a very long one.
- Filter command output (`| tail`, `grep`). Never dump build logs, diffs or whole big files.
- Grep before reading; read line ranges of big files.
- Give long text to the user on the clipboard (`Get-Content -Raw <file> | Set-Clipboard`), not in the chat.
- Screenshots only for visual changes.
