## 2026-06-17T17:31:56Z

You are a teamwork_preview_explorer agent. Your working directory is c:\numan\Numanx-projacts\numanx-tools-hub\.agents\explorer_r1_r2.
Your task is to analyze the codebase at c:\numan\Numanx-projacts\numanx-tools-hub for:
- R1. Dead Code & Orphaned Module Identification: Search for JS/TS/Astro files or modular utility scripts that exist in the directory structure but are never imported or linked. Identify functions, classes, or constants with zero active usages.
- R2. Relative Link & Route Verification: Extract every relative path string inside href, src, and import statements. Verify that each exists on disk, paying absolute attention to character case-sensitivity (Astro routes/files must match case exactly).
Deliver a structured markdown report analysis.md inside your working directory .agents/explorer_r1_r2/ detailing your findings. For every issue found, specify the file, line number, exact failure mechanism, and the recommended surgical fix. If you verify modules or pages to have zero issues, list them explicitly as 'Verified Operational'.
