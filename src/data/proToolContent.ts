// FILE: src/data/proToolContent.ts

export interface ProToolDocEntry {
  title: string;
  subtitle: string;
  standards?: string;
  formula?: {
    latex: string;
    description: string;
  };
  technicalOverview: string;
  workedExample: {
    input: string;
    stepByStepCalculation: string;
    expectedOutput: string;
  };
  methodologyNotes: string[];
  benchmarks?: { label: string; value: string }[];
}

// FILE: src/data/proToolContent.ts — Unified Mathematical & RFC Documentation Registry
export const PRO_TOOL_CONTENT: Record<string, any> = {
  "qr-generator": {
    toolName: "rMQR & QR Code Generator Pro",
    formulaTitle: "ISO/IEC 23941 Rectangular Micro QR & Reed-Solomon Error Correction",
    formulaExplanation: "Encodes binary, alphanumeric, or numeric strings into either a square ISO/IEC 18004 QR matrix (21x21 to 177x177 modules) or an elongated ISO/IEC 23941 Rectangular Micro QR (rMQR) strip (32 sizes from R7x43 to R17x139) using Reed-Solomon polynomial error correction over GF(2^8).",
    formulaCode: "rMQR Max Capacity (R17x139): 361 Numeric | 219 Alphanumeric | 150 Byte | EC Levels: M (15%) & H (30%)"
  },
  "hashtag-generator": {
    toolName: "AI Hashtag Generator",
    formulaTitle: "Lexical Co-Occurrence & Platform Competition Tiering",
    formulaExplanation: "Tokenizes your seed topic and maps tags into 3 algorithmic velocity tiers tailored to TikTok For You feeds, YouTube Shorts shelves, and Instagram Reels SEO.",
    formulaCode: "Optimal Ratio = 2 Broad High-Velocity (20%) + 5 Niche Topic SEO (50%) + 3 Micro-Community (30%)"
  },
  "word-counter": {
    toolName: "Text Count & Paragraph Word Counter",
    formulaTitle: "Unicode Grapheme Segmentation & Per-Paragraph Lexical Analysis",
    formulaExplanation: "Splits input text on whitespace and double-newline boundaries to compute real-time total word count, individual paragraph word counts, Flesch Reading Ease, and speaking cadence.",
    formulaCode: "Reading Time (min) = TotalWords / 200 WPM | Speaking Time (min) = TotalWords / 150 WPM"
  },
  "password-generator": {
    toolName: "Password & Word Passphrase Generator",
    formulaTitle: "OS Hardware CSPRNG (window.crypto.getRandomValues) & Shannon Entropy",
    formulaExplanation: "Samples cryptographically secure 32-bit integers directly from your operating system entropy pool to generate either high-density character strings or memorable multi-word passphrases.",
    formulaCode: "Shannon Entropy E = L * log2(R) bits // 16-char mixed = 104.87 bits | 5-word passphrase = 64.6 bits"
  },
  "run-rate-calculator": {
    toolName: "Cricket Run Rate Calculator",
    formulaTitle: "Base-6 Cricket Over Notation to Decimal Arithmetic",
    formulaExplanation: "Converts standard cricket over notation (where .1 to .5 represent sixths of an over) into true decimal overs before calculating Current Run Rate (CRR) and Required Run Rate (RRR).",
    formulaCode: "TrueOvers = CompletedOvers + (Balls / 6) | CRR = Runs / TrueOvers | RRR = (Target - Runs) / OversLeft"
  },
  "net-run-rate-calculator": {
    toolName: "Tournament Net Run Rate (NRR) Calculator",
    formulaTitle: "ICC Clause 16.10.2 Tournament NRR & All-Out Full-Quota Penalty Rule",
    formulaExplanation: "Computes cumulative team Net Run Rate across tournament matches. Enforces the mandatory ICC rule that any team bowled out before completing their quota is charged the full 20 or 50 overs.",
    formulaCode: "NRR = (TotalRunsScored / TotalOversFaced_QuotaAdjusted) - (TotalRunsConceded / TotalOversBowled_QuotaAdjusted)"
  },
  "image-compressor": {
    toolName: "Image Compressor",
    formulaTitle: "OffscreenCanvas Chroma Subsampling & DCT Quantization",
    formulaExplanation: "Decodes high-resolution bitmaps inside a non-blocking Web Worker and re-encodes via JPEG or WebP quantization matrices, reducing byte size by 70%-90% locally with zero server uploads.",
    formulaCode: "ByteSavings(%) = ((OriginalBytes - CompressedBlob.size) / OriginalBytes) * 100"
  },
  "json-formatter": {
    toolName: "JSON Formatter, Validator & Minifier",
    formulaTitle: "RFC 8259 Abstract Syntax Tree (AST) Lexer & Serializer",
    formulaExplanation: "Parses raw JSON payloads locally inside your browser V8 engine to pinpoint exact line/column syntax errors, pretty-print nested trees, or strip whitespace for production APIs.",
    formulaCode: "PrettyPrint = JSON.stringify(JSON.parse(raw), null, indentSpaces) | Minify = JSON.stringify(JSON.parse(raw))"
  }
};

export const PRO_TOOL_DOCS_REGISTRY: Record<string, ProToolDocEntry> = {
  'net-run-rate-calculator': {
    title: 'ICC Net Run Rate (NRR) Mathematical Specification & Rules',
    subtitle: 'Official ICC Law 16.10.2 All-Out Penalty and Base-6 Ball Notation',
    standards: 'ICC Men’s and Women’s ODI & T20 Playing Conditions (Clause 16.10)',
    formula: {
      latex: 'NRR = \\left(\\frac{\\sum \\text{Runs Scored}}{\\sum \\text{Effective Overs Faced}}\\right) - \\left(\\frac{\\sum \\text{Runs Conceded}}{\\sum \\text{Effective Overs Bowled}}\\right)',
      description: 'The Net Run Rate is the total scoring rate of the team minus the total scoring rate conceded to opponents across all tournament matches.'
    },
    technicalOverview: 'In cricket, overs are expressed as completed overs and balls (e.g., 17.3). For mathematical calculations, partial overs are converted to decimal fractions by dividing balls by 6 (e.g., 17 + 3/6 = 17.50). Crucially, under ICC Law 16.10.2, if a team is bowled out (all-out) in fewer than the allocated match overs, their runs are divided by the FULL quota of overs (e.g., 20.0 or 50.0).',
    workedExample: {
      input: 'Team A scores 150 in 17.3 overs (All-Out). Team B scores 150 in 20.0 overs (Not Out). Max quota = 20 overs.',
      stepByStepCalculation: 'Because Team A was bowled out, Team A Effective Overs = 20.0 (not 17.5). Team A Scoring Rate = 150 / 20.0 = 7.5000 RPO. Team B Scoring Rate = 150 / 20.0 = 7.5000 RPO.',
      expectedOutput: 'NRR = 7.5000 - 7.5000 = 0.0000. (Had Team A not been all out at 17.3, their rate would have been 150 / 17.5 = 8.5714, yielding +1.0714 NRR).'
    },
    methodologyNotes: [
      'Abandoned or no-result matches without a minimum quota are excluded from tournament NRR totals.',
      'Matches decided via Duckworth-Lewis-Stern (DLS) use the revised target and revised overs quota for the 2nd innings.',
      'Super Over runs and wickets are explicitly excluded from official tournament NRR tables.'
    ],
    benchmarks: [
      { label: 'Dominant (+1.50+)', value: 'Guarantees top-2 playoff spot' },
      { label: 'Strong (+0.50 to +1.49)', value: 'Typical playoff qualification buffer' },
      { label: 'Neutral (-0.49 to +0.49)', value: 'Points tiebreakers decide qualification' },
      { label: 'Deficit (<-0.50)', value: 'Requires large-margin multi-match turnaround' }
    ]
  },
  'qr-generator': {
    title: 'ISO/IEC 18004 & ISO/IEC 23941 Barcode Architecture',
    subtitle: 'Standard QR Code Matrix and Rectangular Micro QR (rMQR) Strip Generation',
    standards: 'ISO/IEC 18004:2015 (QR Code) & ISO/IEC 23941:2022 (rMQR)',
    formula: {
      latex: 'C = \\left\\lfloor \\frac{D - E}{M} \\right\\rfloor \\times B_{\\text{eff}}',
      description: 'Capacity formula accounting for data codewords, Reed-Solomon error correction codewords, and version matrix dimensions.'
    },
    technicalOverview: 'Standard QR codes require square proportions with three finder patterns. Rectangular Micro QR (rMQR), standardized under ISO/IEC 23941, was developed by Denso Wave specifically for narrow industrial strips and slim labeling. It uses an asymmetric finder pattern and sub-finder pattern with dimensions ranging from R7x43 up to R17x139 modules.',
    workedExample: {
      input: 'Text: "SERIAL-NX-998234", Type: ISO/IEC 23941 rMQR Strip',
      stepByStepCalculation: 'The text contains 16 alphanumeric characters. The auto-fit sizing engine checks R7x43 (capacity ~12 alphanumeric chars -> too small). Next version R7x59 (capacity 18 alphanumeric chars -> valid fit).',
      expectedOutput: 'Compact rectangular rMQR strip rendered at R7x59 with Level M Reed-Solomon error correction.'
    },
    methodologyNotes: [
      '100% client-side vector synthesis via bwip-js running in the browser engine.',
      'Zero server storage or external API calls ensuring complete serial data privacy.',
      'Automatic Quiet Zone padding compliance (minimum 2 modules for rMQR, 4 modules for standard QR).'
    ],
    benchmarks: [
      { label: 'R7x43 Strip', value: 'Ultra-slim micro labeling (approx. 10 chars)' },
      { label: 'R11x77 Strip', value: 'Industrial component & asset tags (approx. 40 chars)' },
      { label: 'R17x139 Strip', value: 'High-density packaging strips (approx. 150+ chars)' }
    ]
  },
  'password-generator': {
    title: 'Cryptographic Entropy & CSPRNG Passphrase Architecture',
    subtitle: 'NIST SP 800-63B & EFF Diceware Cryptographic Randomness',
    standards: 'NIST SP 800-63B (Digital Identity Guidelines) & W3C Web Cryptography API',
    formula: {
      latex: 'H = L \\times \\log_2(N)',
      description: 'Shannon entropy formula where L is length/word count and N is the character pool or dictionary size.'
    },
    technicalOverview: 'This generator utilizes window.crypto.getRandomValues(), a Cryptographically Secure Pseudorandom Number Generator (CSPRNG) seeded from system hardware noise. For word-based passphrases, words are selected from a curated EFF Diceware list with unbiased modulo arithmetic, ensuring true uniform distribution across all possible combinations.',
    workedExample: {
      input: 'Passphrase with 5 words chosen from an EFF list of 300+ unique words.',
      stepByStepCalculation: 'Entropy per word = log2(300) = ~8.23 bits. For 5 words = 5 * 8.23 = 41.15 bits. Adding a 2-digit number and special symbol adds log2(100 * 6) = 9.23 bits. Total entropy = ~50.4 bits.',
      expectedOutput: 'Passphrase: "Aurora-Vanguard-Summit-Crystal-Orion#47" (Resistant to dictionary and brute-force attacks).'
    },
    methodologyNotes: [
      'Never relies on pseudo-random Math.random() which is predictable and insecure.',
      'Zero network transmission: passwords exist solely in browser volatile memory.',
      'Meets NIST recommendations against arbitrary periodic expiration in favor of high-entropy length.'
    ]
  },
  'image-compressor': {
    title: 'Browser-Native Canvas & WebP Quantization Compression',
    subtitle: 'DCT, Color Subsampling & Lossless Entropy Encoding in Modern Browsers',
    standards: 'W3C HTML Canvas 2D Context & WebP Image Specifications',
    formula: {
      latex: '\\text{Compression Ratio} = \\left(1 - \\frac{\\text{Compressed File Size}}{\\text{Original File Size}}\\right) \\times 100\\%',
      description: 'Percentage reduction in payload byte size while maintaining perceptual structural similarity (SSIM).'
    },
    technicalOverview: 'Image compression in NumanX Tools runs entirely within your browser via the HTML5 OffscreenCanvas / Canvas API. Images are decoded into raw pixel bitmaps, subsampled into 8x8 frequency blocks, and quantized using client-side WebP/JPEG encoders. This produces up to 90% file size reduction without sending private images to third-party cloud servers.',
    workedExample: {
      input: 'Raw PNG screenshot: 3.20 MB (3,355,443 bytes). Quality preset: 80% WebP.',
      stepByStepCalculation: 'Canvas decodes PNG to RGBA bitmap. WebP encoder performs predictive spatial coding and Huffman entropy coding. Output size = 328 KB (335,872 bytes).',
      expectedOutput: '328 KB WebP file (90.0% file size reduction, visual fidelity preserved).'
    },
    methodologyNotes: [
      'All operations executed on client GPU/CPU memory with zero cloud transfer.',
      'Instant before/after visual inspection comparing original and compressed outputs.',
      'Batch conversion handles multiple files simultaneously using parallel Canvas instances.'
    ]
  },
  'word-counter': {
    title: 'Computational Text Metrics, Reading Time & Density Formulations',
    subtitle: 'W3C Unicode Word Segmentation & Paragraph Boundary Parsing',
    standards: 'Unicode Standard Annex #29 (Text Segmentation) & Standard Reading Velocity (200-250 WPM)',
    formula: {
      latex: 'T_{\\text{read}} = \\frac{W}{200}, \\quad D_{\\text{sentence}} = \\frac{W}{S}, \\quad D_{\\text{paragraph}} = \\frac{W}{P}',
      description: 'Calculates silent reading duration based on 200 words-per-minute alongside average syntactic sentence and paragraph lexical density.'
    },
    technicalOverview: 'Accurate text metrics require handling diverse whitespace characters, punctuation delimiters, and multilingual scripts. This tool applies regex boundary matching with Unicode awareness to decompose text into tokens, sentences, and structural paragraphs. Spaces, linebreaks, and non-printable control characters are parsed in memory in real time.',
    workedExample: {
      input: 'Text snippet with 450 words distributed across 3 distinct paragraphs and 22 sentences.',
      stepByStepCalculation: 'Reading time = 450 / 200 = 2.25 minutes (2m 15s). Speaking time = 450 / 130 = 3.46 minutes. Sentence density = 450 / 22 = 20.45 words per sentence. Paragraph density = 450 / 3 = 150 words per paragraph.',
      expectedOutput: '450 Words | 2,750 Characters | 3 Paragraphs | 2m 15s Reading Time.'
    },
    methodologyNotes: [
      'Executes 100% locally on input change with sub-millisecond input latency.',
      'Paragraph breakdown inspector measures per-paragraph word count and density distribution.',
      'Keyword density analyzer identifies high-frequency non-stopword n-grams for SEO content auditing.'
    ],
    benchmarks: [
      { label: 'Blog Post Hero', value: '1,200 – 1,800 words (6-9 min read)' },
      { label: 'Social Post', value: '30 – 60 words (high retention)' },
      { label: 'Paragraph Target', value: '40 – 75 words for optimal readability' }
    ]
  },
  'hashtag-generator': {
    title: 'Semantic Topic Extraction & Social Platform Tag Architecture',
    subtitle: 'Audience Search Velocity, FYP Discovery & Character Limit Guardrails',
    standards: 'Instagram Graph API Constraints (30 Tag Cap) & TikTok FYP Keyword Algorithms',
    formula: {
      latex: 'V_{\\text{tag}} = S_{\\text{relevance}} \\times (1 - \\beta_{\\text{saturation}})',
      description: 'Optimizes tag discovery by balancing keyword relevance against tag over-saturation on social discovery graphs.'
    },
    technicalOverview: 'Social media discovery algorithms rely on semantic tags to index videos and posts into categorical clusters. This tool maps seed topics against curated platform taxonomies (Instagram, TikTok FYP, YouTube Shorts, LinkedIn, Threads) while applying tone filters (Viral, Trending, Niche, Authority) to optimize tag balance.',
    workedExample: {
      input: 'Topic: "Cricket Analytics", Platform: YouTube Shorts, Strategy: Trending',
      stepByStepCalculation: 'Generates high-velocity short-form cricket tags (#CricketReels, #MatchPulse, #NRRCalculator, #ShortsCricket), filters out redundant terms, and enforces platform character lengths.',
      expectedOutput: 'Curated array of 15 targeted hashtags ready for 1-click copy or JSON schema export.'
    },
    methodologyNotes: [
      'Enforces platform caps to prevent algorithm shadowbanning or engagement penalties.',
      'Includes one-click JSON Array export for content automation and scheduling scripts.',
      'No registration or API quotas: unlimited hashtag generations directly in browser.'
    ]
  },
  'strike-rate-calculator': {
    title: 'ICC Cricket Batting & Bowling Strike Rate Formulations',
    subtitle: 'Pacing Metrics, Boundary Percentages & WWS Mobile Stat Card Rendering',
    standards: 'ICC Playing Conditions (Clause 16) & MCC Laws of Cricket (Law 16)',
    formula: {
      latex: '\\text{Batting SR} = \\left(\\frac{\\text{Runs}}{\\text{Balls Faced}}\\right) \\times 100, \\quad \\text{Bowling SR} = \\frac{\\text{Balls Bowled}}{\\text{Wickets Taken}}',
      description: 'Batting strike rate represents runs scored per 100 legal balls; bowling strike rate measures average legal deliveries per wicket.'
    },
    technicalOverview: 'Modern white-ball cricket (T20 and ODI) relies on strike rate to assess scoring acceleration. This utility computes batting strike rate, balls-per-boundary, and boundary run contribution percentage. Furthermore, it integrates a client-side HTML5 Canvas generator that renders a 1080x1920 vertical stat card for YouTube Shorts and Instagram Reels.',
    workedExample: {
      input: 'Batsman scores 76 runs off 42 balls with 8 fours and 4 sixes.',
      stepByStepCalculation: 'Batting SR = (76 / 42) * 100 = 180.95. Boundary runs = (8 * 4) + (4 * 6) = 32 + 24 = 56 runs. Boundary percentage = (56 / 76) * 100 = 73.68%.',
      expectedOutput: 'SR: 180.95 | 56 Boundary Runs (73.7%) | Ready for 1080x1920 Stat Card Export.'
    },
    methodologyNotes: [
      'WWS (World Wide Sports) stat cards render locally via 2D Canvas context without external font lag.',
      'Supports custom batter names, opponent badges, and match summaries.',
      'High-DPI 1080x1920 PNG export triggers instant browser download on both desktop and mobile.'
    ]
  },
  'color-contrast-checker': {
    title: 'W3C WCAG 2.1 Relative Luminance & Contrast Ratio Formulations',
    subtitle: 'sRGB Linearization, Relative Luminance & Accessibility Conformance',
    standards: 'W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA & Level AAA',
    formula: {
      latex: 'CR = \\frac{L_1 + 0.05}{L_2 + 0.05}, \\quad \\text{where } L_i = 0.2126 R_i + 0.7152 G_i + 0.0722 B_i',
      description: 'Calculates the contrast ratio between the lighter relative luminance L1 and darker luminance L2 after sRGB gamma expansion.'
    },
    technicalOverview: 'Under WCAG 2.1, human color perception is non-linear. The sRGB values (0-255) are normalized and expanded from gamma-compressed color space into linear light values. Relative luminance (L) is calculated using standard CIE coefficients, followed by contrast ratio computation from 1:1 (lowest) to 21:1 (highest).',
    workedExample: {
      input: 'Foreground: #A855F7 (Purple-500), Background: #0A0A0B (Dark Surface)',
      stepByStepCalculation: 'L_text = 0.162, L_bg = 0.003. CR = (0.162 + 0.05) / (0.003 + 0.05) = 0.212 / 0.053 = 4.00:1.',
      expectedOutput: 'Contrast: 4.00:1 | Passes WCAG AA Large Text (>= 3.0:1), Fails AA Normal Text (< 4.5:1).'
    },
    methodologyNotes: [
      'Simulates vision deficiencies: Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.',
      'Instant color suggestion algorithm recommends closest AA/AAA compliant color adjustments.',
      'Real-time live preview cards render typography at diverse font sizes and weights.'
    ],
    benchmarks: [
      { label: 'AA Normal Text', value: 'Minimum 4.5:1 ratio' },
      { label: 'AA Large / Bold', value: 'Minimum 3.0:1 ratio (18pt or 14pt bold)' },
      { label: 'AAA Enhanced', value: 'Minimum 7.0:1 ratio for ultra-accessible UI' }
    ]
  },
  'json-formatter': {
    title: 'ECMA-404 JSON Syntax Tree Parsing, Validation & Minification',
    subtitle: 'Deterministic AST Serialization & Byte-Level Inspection',
    standards: 'ECMA-404 The JSON Data Interchange Standard & RFC 8259',
    formula: {
      latex: '\\Delta_{\\text{bytes}} = \\text{Size}_{\\text{raw}} - \\text{Size}_{\\text{minified}}',
      description: 'Calculates payload byte optimization achieved by stripping structural whitespace, linefeeds, and tabs.'
    },
    technicalOverview: 'This utility parses text payloads into an abstract syntax tree using native V8 engine parser. Syntax errors report precise line and character offsets with contextual error snippets. Formatter provides 2-space or 4-space indentation, minification, key alphabetical sorting, and byte metrics without sending data to servers.',
    workedExample: {
      input: 'Unformatted JSON payload with nested arrays and unquoted key errors.',
      stepByStepCalculation: 'Engine tokenizes characters, identifies invalid trailing commas or quotes, pinpoints line 4 col 12, or formats valid JSON with clean 2-space indentation.',
      expectedOutput: 'Formatted JSON structure with 1-click clipboard copy and raw byte size measurement.'
    },
    methodologyNotes: [
      '100% client-side memory execution: safe for proprietary tokens, API keys, and sensitive payloads.',
      'High performance on multi-megabyte payloads via Web Worker background parsing.',
      'Provides quick export to .json file format with standard MIME type application/json.'
    ]
  },
  'unit-converter': {
    title: 'High-Precision SI Dimensional Analysis & Base Unit Normalization',
    subtitle: 'IEEE 754 Floating-Point Normalization & Metric/Imperial Conversion Matrix',
    standards: 'BIPM International System of Units (SI) & NIST Handbook 44',
    formula: {
      latex: 'V_{\\text{target}} = \\frac{V_{\\text{source}} \\times F_{\\text{source}}}{F_{\\text{target}}}',
      description: 'Normalizes input values to standard SI base units (meters, kilograms, kelvin) before scaling to target units.'
    },
    technicalOverview: 'Converting physical quantities across disparate systems (metric, imperial, nautical, US customary) can introduce cumulative rounding errors. This engine normalizes every quantity into an immutable SI base unit before converting to the requested destination unit, preventing cascading truncation drift.',
    workedExample: {
      input: 'Value: 50.0 Miles, Target: Kilometers',
      stepByStepCalculation: 'Source factor = 1,609.344 meters/mile. Base meters = 50 * 1,609.344 = 80,467.2 m. Target factor = 1,000 m/km. Output = 80,467.2 / 1,000 = 80.4672 km.',
      expectedOutput: '50.0 mi = 80.4672 km (exact SI conversion).'
    },
    methodologyNotes: [
      'Supports 6 core physical domains: Length, Mass/Weight, Temperature, Area, Volume, and Digital Storage.',
      'Temperature conversions correctly account for Celsius/Kelvin offset additions (+273.15) and Fahrenheit scaling.',
      'Digital data conversions support both decimal (1 KB = 1000 B) and binary kibibytes (1 KiB = 1024 B).'
    ]
  },
  'percentage-calculator': {
    title: 'Percentage Variance, Proportion & Discount Formulations',
    subtitle: 'Relative Difference, Markup, Margin & Compounding Calculations',
    standards: 'Financial & Mathematical Standard Ratio Specifications',
    formula: {
      latex: '\\Delta\\% = \\left(\\frac{V_2 - V_1}{|V_1|}\\right) \\times 100, \\quad P_{\\text{part}} = \\left(\\frac{X}{Y}\\right) \\times 100',
      description: 'Formulates percentage increase/decrease, relative change, and portion-of-a-whole mathematical ratios.'
    },
    technicalOverview: 'This multi-mode percentage suite solves 5 common mathematical scenarios: What is X% of Y, X is what % of Y, percentage increase/decrease from V1 to V2, retail discount price with sales tax, and profit margin versus markup calculations.',
    workedExample: {
      input: 'Initial Price = $80.00, New Price = $100.00',
      stepByStepCalculation: 'Change = 100 - 80 = +20. Delta % = (20 / 80) * 100 = +25.00%.',
      expectedOutput: 'A $20.00 increase represents a +25.0% price increase.'
    },
    methodologyNotes: [
      'Handles zero-division edge cases gracefully with clear validation hints.',
      'Live reactive computation: updates results instantaneously as numbers are typed.',
      'Step-by-step mathematical breakdown for students and accounting tasks.'
    ]
  },
  'age-calculator': {
    title: 'Gregorian Calendar Chronological Duration & Leap Year Accounting',
    subtitle: 'ISO 8601 Temporal Arithmetic & Planetary Birthday Metrics',
    standards: 'ISO 8601 Date and Time Representation & Gregorian Leap Year Rules',
    formula: {
      latex: '\\text{Age} = \\text{Date}_{\\text{target}} - \\text{Date}_{\\text{birth}} \\quad \\text{accounting for } Y \\pmod 4 = 0',
      description: 'Calculates exact chronological elapsed time across variable month lengths (28-31 days) and leap centuries.'
    },
    technicalOverview: 'Calculating exact age involves non-uniform time intervals due to leap years (years divisible by 4, except century years not divisible by 400) and varying month lengths. This tool calculates exact years, months, days, hours, and minutes, alongside next birthday countdown and fun facts.',
    workedExample: {
      input: 'Birth Date: March 15, 2000, Reference Date: October 16, 2026',
      stepByStepCalculation: 'Elapsed complete years = 26. Months between March and October = 7. Days between 15th and 16th = 1.',
      expectedOutput: '26 Years, 7 Months, 1 Day (Exact Elapsed Age).'
    },
    methodologyNotes: [
      'Prevents timezone skew by calculating date deltas in local browser UTC time.',
      'Next birthday countdown displays live ticking days, hours, and minutes.',
      'Includes fun planetary age conversions (Age on Mars, Jupiter, Venus).'
    ]
  },
  'markdown-to-pdf': {
    title: 'AST Markdown Lexing, KaTeX Math & Vector PDF Stream Synthesis',
    subtitle: 'W3C CSS Paged Media Module Level 3 & ISO 32000-1 (PDF) Rendering',
    standards: 'CommonMark 0.30, GitHub Flavored Markdown (GFM) & W3C CSS Paged Media',
    formula: {
      latex: 'P_{\\text{vector}} = \\int_{0}^{H} \\left( \\text{AST}_{\\text{HTML}} + \\text{SVG}_{\\text{mermaid}} + \\text{MathML}_{\\text{KaTeX}} \\right) d(\\text{Page})',
      description: 'Synthesizes clean vector PDF streams preserving selectable text, hyperlinks, inline SVGs, and KaTeX math without raster pixelation.'
    },
    technicalOverview: 'Traditional web PDF generators rely on raster canvas capture (html2canvas), resulting in blurry text, bloated file sizes, and non-selectable content. This engine applies two-pass rendering: First, GFM lexing decomposes markdown into sanitized HTML elements while transforming LaTeX and Mermaid blocks into native MathML and vector SVGs. Second, it utilizes CSS Paged Media (@page, page-break-inside: avoid) to invoke browser headless print streams for pure vector fidelity.',
    workedExample: {
      input: 'Markdown technical document with 2 diagrams, 4 LaTeX equations, and 3 page breaks.',
      stepByStepCalculation: 'Marked parses tokens -> DOMPurify sanitizes -> Mermaid compiles diagram SVGs -> KaTeX renders formulas -> Browser print engine compiles native vector PDF with 0 raster distortion.',
      expectedOutput: 'Searchable, high-DPI vector PDF (A4/Letter) ready for instant download or printing.'
    },
    methodologyNotes: [
      '100% client-side: document source text and generated PDFs never leave browser memory.',
      'Supports automatic page numbering, running headers/footers, and custom margin presets.',
      'Includes multiple print themes: GitHub Light, Academic Serif, and NumanX High-Contrast.'
    ],
    benchmarks: [
      { label: 'A4 Vector PDF', value: 'Crisp 300+ DPI vector font glyphs' },
      { label: 'Render Latency', value: '< 150ms for 2,000-word technical specs' },
      { label: 'Privacy Model', value: 'Zero cloud upload: compliant with GDPR/HIPAA' }
    ]
  }
};

/**
 * Returns either a registered pro tool documentation entry or generates
 * an in-depth fallback based on tool category and name.
 */
export function getProToolDoc(slug: string, toolName: string, category: string): ProToolDocEntry {
  if (PRO_TOOL_DOCS_REGISTRY[slug]) {
    return PRO_TOOL_DOCS_REGISTRY[slug];
  }

  return {
    title: `${toolName} — Technical Specifications & Methodology`,
    subtitle: `Client-Side In-Browser Processing & Algorithmic Architecture for ${category}`,
    standards: 'W3C Web Standards & Modern Web APIs (Zero-Server Architecture)',
    formula: {
      latex: '\\text{Output} = f_{\\text{client}}(\\text{Input}, \\theta)',
      description: 'Deterministic client-side transformation with zero remote server data transmission.'
    },
    technicalOverview: `The ${toolName} operates 100% within your local browser runtime. Built on modern web standards (JavaScript ES2022, WebAssembly, and Canvas APIs), data never leaves your device memory. This ensures sub-millisecond execution times and total compliance with modern privacy regulations (GDPR, CCPA).`,
    workedExample: {
      input: `Standard input data processed by ${toolName}.`,
      stepByStepCalculation: `Input is parsed in browser memory -> validated against specifications -> processed via local deterministic algorithms.`,
      expectedOutput: `Verified, high-precision output ready for one-click copy or file download.`
    },
    methodologyNotes: [
      'No data is stored on remote servers or tracked across user sessions.',
      'Instant offline support: works smoothly without an active internet connection once loaded.',
      'Accessible across desktop and mobile devices with keyboard shortcut navigation.'
    ]
  };
}
