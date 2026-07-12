# NumanX Tools — Advanced Expansion Toolkit (100+ Roadmap)

This document outlines the rigorous technical specifications and feasibility constraints for scaling the NumanX platform from 55 tools to 150+ tools without compromising the "Zero Server Uploads" mandate.

---

## 1. Technical Feasibility & Strategy Constraints

To maintain our privacy-first, zero-cost architecture, every future tool must adhere to the **Client-Side Execution Protocol**.

| Operation Type | Technology Required | Complexity | Bundle Impact | Approved? |
| --- | --- | --- | --- | --- |
| Image Manipulation | `Canvas API` / `FileReader` | Medium | Zero | ✅ Yes |
| Text / Regex | Vanilla JS String Methods | Low | Zero | ✅ Yes |
| Cryptography / Hashing | `WebCrypto API` | Medium | Zero | ✅ Yes |
| File Compression | `fflate` / `pako` (WASM) | High | < 50kb | ✅ Yes |
| PDF Processing | `pdf-lib` (Web Workers) | High | ~500kb | ⚠️ Conditional |
| OCR (Text Extraction) | `Tesseract.js` (WASM) | Extreme | > 2MB | ⚠️ Lazy-Load Only |
| Video/Audio Conversion | `ffmpeg.wasm` | Extreme | > 10MB | ❌ No |

---

## 2. Phase 3 Tools: The Advanced Utility Wave (Month 3-6)

### 2.1 The PDF Manipulation Suite
*Constraint: Must use Web Workers to prevent UI thread blocking.*
*Library:* `pdf-lib`

| Tool Slug | Exact Functionality Requirement | Priority |
| --- | --- | --- |
| `pdf-merger` | Accept `Multiple File` inputs via Drag&Drop. Merge buffers and trigger Blob download. | ★★★★★ |
| `pdf-splitter` | Render PDF pages as Canvas thumbnails. Allow user to select pages to extract into new Blob. | ★★★★☆ |
| `pdf-to-image` | Render PDF buffer via `pdf.js`. Draw to canvas. Export each page as `.zip` of JPEGs using `fflate`. | ★★★★☆ |

### 2.2 Advanced Developer Tools
*Constraint: Must handle massive strings (>1MB) without crashing browser.*

| Tool Slug | Exact Functionality Requirement | Priority |
| --- | --- | --- |
| `jwt-decoder` | Parse Base64 URL strings. Validate expiration. Pretty-print JSON payload. (Do not attempt signature validation without secret). | ★★★★★ |
| `sql-formatter` | Implement syntax highlighting via `Prism.js` or `Shiki`. Apply standard SQL indentation rules. | ★★★★☆ |
| `regex-tester` | Interactive input pane with real-time match highlighting. Must support JS RegExp flags (`g`, `i`, `m`). | ★★★★★ |
| `cron-parser` | Translate standard 5-part Cron strings into human-readable text (e.g., `0 0 * * *` -> "Every day at midnight"). | ★★★☆☆ |

### 2.3 The "Creator/Social" Expansion
*Constraint: Focus on high-volume search terms. Logic is simple string manipulation.*

| Tool Slug | Exact Functionality Requirement | Priority |
| --- | --- | --- |
| `youtube-title-generator` | Array of 50+ proven clickbait title templates. Insert user keyword dynamically. | ★★★★★ |
| `instagram-line-break` | Replace hidden carriage returns with invisible zero-width spaces to fix IG caption formatting. | ★★★★★ |
| `utm-builder` | Form to construct standard Google Analytics tracking URLs (`utm_source`, `utm_medium`, etc.). | ★★★★☆ |

---

## 3. Phase 4 Tools: Machine Learning at the Edge (Month 6-12)

This phase relies on the emerging **Web Neural Network API (WebNN)** and lightweight ONNX models running directly in the browser via WebGL/WebGPU.

### 3.1 Edge AI Tools

| Tool Slug | Technical Approach | Feasibility Status |
| --- | --- | --- |
| `ai-background-remover` | Run `rembg` (or similar MobileNet model) via ONNX Runtime Web. Requires WebGL backend. | Researching |
| `ai-sentiment-analyzer` | Load a quantized 20MB NLP model in the browser to score text positivity. | Possible |
| `ai-image-upscaler` | Run a lightweight Super Resolution (ESRGAN) model via WebGPU. | High Risk (Device limits) |

---

## 4. Standardization Protocol for New Tools

Before a new tool is merged into `main`, it must pass this exact checklist:

### The "4-C" Requirement Checklist
1. **Componentized:** Does it use the standard `MainLayout` and `ToolHeader`?
2. **Canonicalized:** Is the `AppSEO` component correctly configured with an exact-match `canonical` URL?
3. **Client-Side Verified:** If disconnected from Wi-Fi after initial load, does the tool still function 100%?
4. **CLS-Safe:** Is the interactive mount point wrapped in a `min-h-[Xpx]` container to prevent Cumulative Layout Shift during hydration?

### 4.1 Schema Injection Mandate
Every tool MUST inject the `WebApplication` JSON-LD schema into `AppSEO`:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "NumanX [Tool Name]",
  "operatingSystem": "Any",
  "applicationCategory": "UtilitiesApplication",
  "offers": { "@type": "Offer", "price": "0" }
}
```
