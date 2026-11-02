/**
 * Markdown → PDF engine used by the Markdown Editor's "Export PDF" and "PDF page"
 * preview (moved from the retired Markdown to PDF page, same output).
 *
 * Markdown is parsed with Marked (GFM), sanitized with DOMPurify, Mermaid code
 * blocks become SVG diagrams and $…$ / $$…$$ become KaTeX math. The browser's
 * print dialog then saves the themed page as a PDF. The libraries load from the
 * jsDelivr CDN (allowed by the CSP) the first time PDF features are used.
 */

declare const marked: any;
declare const DOMPurify: any;
declare const renderMathInElement: any;
declare const mermaid: any;

const CDN = 'https://cdn.jsdelivr.net/npm';
const KATEX_CSS = `${CDN}/katex@0.16.9/dist/katex.min.css`;

const loaded = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  let p = loaded.get(src);
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loaded.delete(src);
        s.remove();
        reject(new Error(`Could not load ${src}`));
      };
      document.head.appendChild(s);
    });
    loaded.set(src, p);
  }
  return p;
}

let libs: Promise<void> | null = null;

/** Loads Marked, DOMPurify, Mermaid and KaTeX once. Rejects if the CDN can't be reached. */
export function loadPdfLibs(): Promise<void> {
  if (!libs) {
    if (!document.querySelector(`link[href="${KATEX_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = KATEX_CSS;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    libs = Promise.all([
      loadScript(`${CDN}/marked@11.1.1/marked.min.js`),
      loadScript(`${CDN}/dompurify@3.0.8/dist/purify.min.js`),
      loadScript(`${CDN}/mermaid@10.8.0/dist/mermaid.min.js`),
      // auto-render needs the katex global, so it loads second
      loadScript(`${CDN}/katex@0.16.9/dist/katex.min.js`).then(() =>
        loadScript(`${CDN}/katex@0.16.9/dist/contrib/auto-render.min.js`),
      ),
    ]).then(
      () => undefined,
      (err) => {
        libs = null;
        throw err;
      },
    );
  }
  return libs;
}

let mermaidReady = false;
let renderSeq = 0;

/** Renders markdown into `target` with the GFM + DOMPurify + Mermaid + KaTeX pipeline. */
export async function renderPdfMarkdown(target: HTMLElement, markdown: string): Promise<void> {
  await loadPdfLibs();
  const seq = ++renderSeq;

  const rawHtml = marked.parse(markdown, { gfm: true, breaks: true });
  target.innerHTML = DOMPurify.sanitize(rawHtml);

  const codeNodes = target.querySelectorAll('pre code.language-mermaid');
  if (codeNodes.length > 0) {
    if (!mermaidReady) {
      mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
      mermaidReady = true;
    }
    const nodes: HTMLElement[] = [];
    codeNodes.forEach((node, i) => {
      const container = document.createElement('div');
      container.className = 'mermaid my-4 flex justify-center overflow-x-auto';
      container.id = `mermaid-${target.id || 'pdf'}-${seq}-${i}`;
      container.textContent = node.textContent || '';
      node.parentElement?.replaceWith(container);
      nodes.push(container);
    });
    try {
      await mermaid.run({ nodes });
    } catch (err) {
      console.warn('Mermaid render issue:', err);
    }
  }

  renderMathInElement(target, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    throwOnError: false,
  });
}

export const PDF_TEMPLATES: Record<string, string> = {
  'tech-report': `## NumanX System Architecture & Technical Report
*Date: October 16, 2026 | Author: System Engineering Team*

---

## 1. System Overview
The **NumanX Tools Hub** operates on a zero-server edge architecture. Calculations, barcode generation, and PDF document synthesis occur client-side without remote cloud latency.

### Core Processing Pipeline
\`\`\`mermaid
flowchart LR
    A["Raw Markdown Input"] --> B["GFM Lexical Parser"]
    B --> C["KaTeX LaTeX Math Engine"]
    B --> D["Mermaid Vector Synthesizer"]
    C --> E["Sanitized DOM"]
    D --> E
    E --> F["Vector Print PDF Stream"]
\`\`\`

---

## 2. Mathematical Formalization
Resource decay in the cricket simulation suite follows the standard exponential distribution:

$$R(u, w) = Z_0(w) \\times \\left(1 - e^{-b(w) \\cdot u}\\right)$$

Where $u$ denotes overs remaining, $w$ is wickets fallen, and $Z_0$ represents the asymptotic resource quota:

$$\\text{Target} = \\left\\lfloor S_1 \\times \\frac{R_2}{R_1} \\right\\rfloor + 1$$

<div class="page-break"></div>

## 3. Engineering Benchmark Results

| Metric Dimension | Target SLA | Observed Performance | Conformance |
| :--- | :--- | :--- | :--- |
| **Parsing Latency** | < 100ms | 38ms (V8 Engine) | **PASSED** |
| **Vector Resolution** | 300 DPI | Lossless Vector SVG | **PASSED** |
| **Privacy Leakage** | 0 bytes | 0 outgoing network calls | **COMPLIANT** |

> **Security Note:** All cryptographic operations utilize \`window.crypto.getRandomValues()\` rather than insecure pseudorandom generators.
`,
  academic: `# An Empirical Analysis of Client-Side Web Performance
**Muhammad Numan Usmani**
*Department of Information Technology, NumanX Studio*

---

### Abstract
This paper examines the computational trade-offs of shifting intensive utilities (barcode synthesis, matrix calculations, document generation) from cloud-hosted microservices to client-side Web Workers and Canvas APIs.

### 1. Introduction
Modern browser runtimes afford near-native execution velocities via WebAssembly and modern V8 engines. By eliminating server roundtrips, response latencies fall from hundreds of milliseconds to sub-millisecond execution times.

### 2. Theoretical Methodology
Let $T_{\\text{network}}$ represent server trip latency and $T_{\\text{client}}$ denote execution time in local browser memory. The total time saved $\\Delta T$ is expressed as:

$$\\Delta T = T_{\\text{network}} + T_{\\text{queue}} - T_{\\text{client}}$$

<div class="page-break"></div>

### 3. Conclusion
Client-side processing guarantees zero data leakage, continuous offline availability, and eliminates linear cloud hosting overheads.
`,
  readme: `# Project Documentation
Welcome to the **NumanX Tools Hub** open-source repository.

## Features
- **Zero Configuration**: Runs in any modern web browser.
- **Privacy Guaranteed**: Data never leaves your machine.
- **Free Browser Tools**: Barcodes, Cricket Analytics, Math, Text, and Media.

## Installation
\`\`\`bash
git clone https://github.com/muhammadnuman340/numanx-tools-hub.git
cd numanx-tools-hub
npm install
npm run dev
\`\`\`
`,
  empty: '# Untitled Document\n\nStart typing your markdown here...\n',
};
