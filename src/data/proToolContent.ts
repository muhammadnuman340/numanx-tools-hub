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
