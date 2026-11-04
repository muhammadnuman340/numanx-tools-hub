# PRODUCT.md — NumanX Tools Hub

Product truth for every page, component and piece of copy. Visual rules live in [DESIGN.md](./DESIGN.md).

## One-line definition

NumanX Tools Hub helps creators, students and developers convert, compress, generate and calculate things in their browser, without uploading files or signing up.

## Primary users and jobs

| User                                                       | Main job                                                                | Typical entry                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------- |
| Creators (YouTube, Shorts, Instagram, TikTok)              | Thumbnails, image sizes, hashtags, titles, QR codes                     | Google search for one task    |
| Students                                                   | Word counts, PDFs, grammar/readability, calculators                     | Google search, shared link    |
| Developers                                                 | Format, decode, encode, convert (JSON, JWT, Base64, regex, cron, epoch) | Google search, bookmarks      |
| Cricket players and organisers (mainly Pakistan and India) | Run rate, NRR, DLS targets, strike/economy rates                        | WhatsApp links, Google search |

**Success in 10 seconds:** a visitor who lands on any tool page can drop a file or type an input without scrolling, and sees a result they can copy, download or share.

## Constraints

- **Devices:** mid-range Android phones and 8 GB RAM laptops. Mobile is the main device for creators and cricket users `[MEASURE: device split from analytics]`.
- **Network:** slow or unstable connections are common; tools must work after the first load, and heavy engines (PDF, ONNX models, rMQR) load only when needed.
- **Privacy:** files and inputs are processed in the browser. Nothing is uploaded, except messages sent through the contact and feedback forms.
- **Cost:** static site on Cloudflare Pages; no server-side processing.
- **Theme:** dark only today (the head script forces `data-theme="dark"`).

## Verified facts (usable in UI copy)

| Fact                                                                                           | Source                                     |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 65 tools across 6 categories (image 10, creator 8, utility 14, cricket 6, AI 10, developer 17) | [src/data/tools.ts](./src/data/tools.ts)   |
| Tool processing runs in the browser (Canvas, Web Workers, WebAssembly, Web Crypto)             | Source review; llms.txt                    |
| No sign-up, no watermark, free                                                                 | Product policy                             |
| Background remover and image upscaler run real ML models in the browser                        | `@imgly/background-removal`, `@upscalerjs` |
| Password generator uses the browser's cryptographic random API                                 | Source                                     |
| NRR calculator follows ICC playing condition 16.10.2 (all-out uses full quota)                 | Tool page and source                       |
| QR tool generates ISO/IEC 23941 rMQR (R7x43 to R17x139) and square QR with SVG export          | Tool page and source                       |
| Image compressor batches up to 20 images                                                       | Tool feature list                          |

## Claims that are NOT verified (don't use until measured)

- "Up to 90% smaller" (image compressor title and homepage card) `[MEASURE: typical savings, test set, method]`
- "Instant", "zero latency", "zero server latency" `[MEASURE: p95 processing time, device]`
- "Enterprise quality", "scales to millions" (no evidence)
- Any user count, rating or testimonial

## Naming truth

Tools named "AI" must use a model. The grammar checker (rule-based), paraphraser (dictionary) and sentiment analyzer (lexicon) don't; show them without the "AI" prefix. URLs stay the same.

## Voice

- Plain, direct, slightly technical where it helps ("runs in your browser", "file never leaves your device").
- Say what happens, not how it feels. "Compress JPG, PNG and WebP in your browser" — not "Supercharge your workflow".
- Buttons name the action: "Compress images", "Copy result", "Download PNG".
- Errors say what happened and what to do next.
- No "next-gen", "god-tier", "neural core", "uncompromising", "enterprise", "magic".

## Business model (affects layout)

- Support links (NayaPay, Easypaisa, JazzCash, crypto) and contextual affiliates (e.g. Canva) — shown **after** a successful result, never before the tool.
- AdSense is deactivated.
- Early-access list for future NumanX products.
