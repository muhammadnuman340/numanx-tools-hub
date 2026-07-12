## 2026-06-15T18:13:02Z

You are the Worker agent. Your working directory is c:\numan\Numanx-projacts\numanx-tools-hub\.agents\worker_remediation.
Your task is to fix the static build failures, lint errors, duplicate event listener initializations, and TypeScript out-of-memory errors.

Please follow these instructions:

1. Fix the static build failure on POST-only API routes by adding a dummy GET handler returning a 405 Method Not Allowed JSON response to:
   - `src/pages/api/contact.ts`
   - `src/pages/api/feedback.ts`
   - `src/pages/api/scan-sheet.ts`
     Example GET handler:

   ```typescript
   export const GET: APIRoute = async () => {
     return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
       status: 405,
       headers: { 'Content-Type': 'application/json' },
     });
   };
   ```

2. Fix the ESLint syntax parsing error in `src/components/blog/FeatureGrid.astro` line 24. Correct the class:list brackets to use an object literal `{}` instead of an array literal `[]` with colons.

3. Fix the TypeScript compile / typecheck heap out-of-memory error by updating `tsconfig.json` to explicitly exclude `"node_modules"` and `".agents"` in the `"exclude"` array.

4. Fix the duplicate script listener initializations across the upgraded pages:
   - `src/pages/about.astro`
   - `src/pages/contact.astro`
   - `src/pages/blog/index.astro`
   - `src/pages/tools/index.astro`
   - `src/pages/chat.astro`
     In the bottom `<script>` tag of each file, locate where the page initialization function is called directly (e.g. `initAboutPage();` or similar) right before the `document.addEventListener('astro:page-load', ...)` line. Remove the direct call to the initialization function, so it is only triggered by the `astro:page-load` listener.

5. Execute and Verify:
   - Run `npm run format` to ensure formatting is correct.
   - Run `npm run typecheck` or `astro check` to verify TypeScript compile checks pass.
   - Run a clean build via `npm run build` and ensure that it finishes successfully with no prerendering chunks or API method warnings/errors.
   - Run `npm run test` (or `vitest run`) to verify that all 30 tests (including the 83 E2E test assertions) pass cleanly.

6. Compile your changes and commands run in `handoff.md` in your working directory.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
