export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  icon: string;
  url: string;
  isNew?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  keywords: string[];
  relatedIds: string[];
}

export type ToolCategory =
  | 'image-tools'
  | 'creator-tools'
  | 'utility-tools'
  | 'cricket-tools'
  | 'ai-tools'
  | 'developer-tools';

export interface CategoryInfo {
  id: ToolCategory;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  count: number;
}

function getCategoryCount(categoryId: ToolCategory): number {
  return tools.filter((t) => t.category === categoryId).length;
}

export const categories: CategoryInfo[] = [
  {
    id: 'image-tools',
    title: 'Image Tools',
    description: 'Convert, compress, crop, and resize images inside your browser with zero server uploads.',
    icon: 'image',
    gradient: 'from-purple-500/20 to-pink-500/20 text-purple-400',
    get count() {
      return getCategoryCount('image-tools');
    },
  },
  {
    id: 'creator-tools',
    title: 'Creator Tools',
    description: 'Smart hashtag generators, QR builders, and text processors to scale your social footprint.',
    icon: 'creator',
    gradient: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    get count() {
      return getCategoryCount('creator-tools');
    },
  },
  {
    id: 'utility-tools',
    title: 'Utility Tools',
    description: 'Secure password creation, precise age calculations, and text structure counters.',
    icon: 'utility',
    gradient: 'from-green-500/20 to-emerald-500/20 text-green-400',
    get count() {
      return getCategoryCount('utility-tools');
    },
  },
  {
    id: 'cricket-tools',
    title: 'Cricket Tools',
    description: 'Professional match run rate calculators and batting/bowling strike rate models.',
    icon: 'cricket',
    gradient: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    get count() {
      return getCategoryCount('cricket-tools');
    },
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description:
      'Powerful AI-powered utilities for content generation, translation, and intelligent text processing — all running locally in your browser.',
    icon: 'sparkles',
    gradient: 'from-violet-500/20 to-purple-500/20 text-violet-400',
    get count() {
      return getCategoryCount('ai-tools');
    },
  },
  {
    id: 'developer-tools',
    title: 'Developer Tools',
    description:
      'Essential utilities for developers — JSON formatter, Base64 encoder, UUID generator, color converter, and more.',
    icon: 'utility',
    gradient: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
    get count() {
      return getCategoryCount('developer-tools');
    },
  },
];

export const tools: Tool[] = [
  {
    id: 'qr-generator',
    name: 'QR Generator',
    description: 'Generate QR codes from URLs, text, and messages instantly.',
    longDescription:
      'Generate custom QR codes from URLs, text, and messages instantly with multiple templates and theme presets.',
    category: 'creator-tools',
    icon: 'qr',
    url: '/tools/qr-generator/',
    isFeatured: true,
    isPopular: true,
    keywords: ['qr', 'qr code', 'qr generator', 'barcode', 'scanner'],
    relatedIds: ['hashtag-generator', 'password-generator'],
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text.',
    longDescription:
      'Advanced character, word, sentence, and paragraph counter with readability analysis and keyword density panel.',
    category: 'utility-tools',
    icon: 'word',
    url: '/tools/word-counter/',
    isFeatured: true,
    keywords: ['word counter', 'character count', 'text analyzer', 'readability', 'writing'],
    relatedIds: ['age-calculator', 'password-generator'],
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate exact age in years, months, days, hours, and minutes.',
    longDescription:
      'Calculate exact age in years, months, days, hours, and minutes with life analytics and time alive visualization.',
    category: 'utility-tools',
    icon: 'age',
    url: '/tools/age-calculator/',
    keywords: ['age calculator', 'birthday', 'age', 'date calculator', 'time alive'],
    relatedIds: ['word-counter', 'run-rate-calculator'],
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, secure passwords with custom length and options.',
    longDescription:
      'Generate ultra-secure, randomized passwords with custom parameters, entropy display, and password history.',
    category: 'utility-tools',
    icon: 'password',
    url: '/tools/password-generator/',
    isPopular: true,
    keywords: ['password', 'password generator', 'secure', 'random', 'entropy'],
    relatedIds: ['qr-generator', 'hashtag-generator'],
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    description: 'Generate trending hashtags for social media posts and content.',
    longDescription:
      'Generate trending hashtags for social media posts with popularity scores, favorites, and multi-platform support.',
    category: 'creator-tools',
    icon: 'hashtag',
    url: '/tools/hashtag-generator/',
    isPopular: true,
    keywords: ['hashtag', 'hashtag generator', 'social media', 'trending', 'viral'],
    relatedIds: ['qr-generator', 'password-generator'],
  },
  {
    id: 'run-rate-calculator',
    name: 'Run Rate Calculator',
    description: 'Calculate cricket run rates and required run rates for matches.',
    longDescription:
      'Calculate cricket target run rates, net run rates, and required over formulas with chase difficulty analysis.',
    category: 'cricket-tools',
    icon: 'runrate',
    url: '/tools/run-rate-calculator/',
    isFeatured: true,
    keywords: ['run rate', 'cricket', 'run rate calculator', 'cricket calculator', 'match analysis'],
    relatedIds: ['strike-rate-calculator', 'age-calculator'],
  },
  {
    id: 'strike-rate-calculator',
    name: 'Strike Rate Calculator',
    description: 'Calculate batting and bowling strike rates in cricket.',
    longDescription:
      'Calculate batting and bowling strike rates in cricket with impact rating, match influence score, and player presets.',
    category: 'cricket-tools',
    icon: 'strikerate',
    url: '/tools/strike-rate-calculator/',
    keywords: ['strike rate', 'cricket', 'batting', 'bowling', 'strike rate calculator'],
    relatedIds: ['run-rate-calculator', 'age-calculator'],
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert JPG images to PNG format with high quality preservation.',
    longDescription:
      'Immediate batch JPG to PNG converter with drag-and-drop, analytics bar, and before/after comparison.',
    category: 'image-tools',
    icon: 'jpg2png',
    url: '/tools/jpg-to-png/',
    isPopular: true,
    keywords: ['jpg to png', 'convert', 'image converter', 'jpg', 'png'],
    relatedIds: ['png-to-webp', 'image-compressor', 'image-resizer'],
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images with visual quality presets and batch processing support.',
    longDescription:
      'High-efficiency client-side image compression to reduce file sizes up to 90% with visual quality presets and batch processing.',
    category: 'image-tools',
    icon: 'compress',
    url: '/tools/image-compressor/',
    isFeatured: true,
    isPopular: true,
    keywords: ['image compressor', 'compress', 'image optimizer', 'file size', 'batch'],
    relatedIds: ['jpg-to-png', 'png-to-webp', 'image-resizer'],
  },
  {
    id: 'png-to-webp',
    name: 'PNG to WebP',
    description: 'Convert PNG images to WebP format for smaller file sizes.',
    longDescription:
      'Convert PNG images to WebP format for smaller file sizes with quality presets, analytics, and SEO benefits section.',
    category: 'image-tools',
    icon: 'webp',
    url: '/tools/png-to-webp/',
    keywords: ['png to webp', 'convert', 'webp', 'image converter', 'optimization'],
    relatedIds: ['jpg-to-png', 'image-compressor', 'image-resizer'],
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to any dimension with aspect ratio lock and presets.',
    longDescription:
      'Resize images to any dimension with aspect ratio lock, social media presets, and multiple export formats.',
    category: 'image-tools',
    icon: 'resize',
    url: '/tools/image-resizer/',
    keywords: ['image resizer', 'resize', 'aspect ratio', 'social media', 'dimensions'],
    relatedIds: ['jpg-to-png', 'png-to-webp', 'image-compressor'],
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, mass, volume, temperature, area, speed, time, and data units.',
    longDescription:
      'Convert 100+ units across 8 categories including length, mass, volume, temperature, area, speed, time, and data storage. Real-time conversion with smart category detection.',
    category: 'utility-tools',
    icon: 'unit',
    url: '/tools/unit-converter/',
    isFeatured: true,
    isPopular: true,
    isNew: true,
    keywords: ['unit converter', 'length converter', 'temperature converter', 'metric', 'imperial', 'conversion'],
    relatedIds: ['age-calculator', 'word-counter', 'json-formatter'],
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write and preview markdown in real-time with toolbar and HTML export.',
    longDescription:
      'Live markdown editor with split-pane preview, formatting toolbar, syntax highlighting, and one-click HTML export.',
    category: 'creator-tools',
    icon: 'markdown',
    url: '/tools/markdown-editor/',
    isFeatured: true,
    isNew: true,
    keywords: ['markdown editor', 'markdown preview', 'md editor', 'rich text', 'html export'],
    relatedIds: ['word-counter', 'qr-generator', 'hashtag-generator'],
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data with syntax highlighting.',
    longDescription:
      'Format, validate, and minify JSON data with error highlighting, tree-view indentation, and one-click copy. Perfect for API debugging.',
    category: 'developer-tools',
    icon: 'json',
    url: '/tools/json-formatter/',
    isPopular: true,
    isNew: true,
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'api tools'],
    relatedIds: ['unit-converter', 'word-counter', 'password-generator'],
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    description: 'Convert PNG images to JPG format with quality control.',
    longDescription:
      'Convert PNG images to JPG format with adjustable quality. Client-side conversion with drag-and-drop support and instant download.',
    category: 'image-tools',
    icon: 'jpg2png',
    url: '/tools/png-to-jpg/',
    isNew: true,
    keywords: ['png to jpg', 'convert', 'image converter', 'png', 'jpg', 'jpeg'],
    relatedIds: ['jpg-to-png', 'image-compressor', 'png-to-webp'],
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    description: 'Count characters, words, sentences, and paragraphs with precision.',
    longDescription:
      'Count characters (with/without spaces), words, sentences, paragraphs, and lines in real-time. Includes reading time and speaking time estimates.',
    category: 'utility-tools',
    icon: 'word',
    url: '/tools/character-counter/',
    isNew: true,
    keywords: ['character counter', 'character count', 'word counter', 'letter counter', 'text analyzer'],
    relatedIds: ['word-counter', 'json-formatter', 'age-calculator'],
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images to any dimension with customizable aspect ratios.',
    longDescription:
      'Crop PNG and JPG images with freeform or fixed aspect ratio presets. Drag to adjust crop area, preview in real-time, and download the result.',
    category: 'image-tools',
    icon: 'resize',
    url: '/tools/image-cropper/',
    isNew: true,
    keywords: ['image cropper', 'crop image', 'crop photo', 'aspect ratio', 'image editor'],
    relatedIds: ['image-resizer', 'jpg-to-png', 'image-compressor'],
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages — find X% of Y, percentage change, and more.',
    longDescription:
      'Calculate what is X% of Y, X is what % of Y, percentage increase/decrease, and percentage difference between two numbers. Simple, fast, accurate.',
    category: 'utility-tools',
    icon: 'age',
    url: '/tools/percentage-calculator/',
    isNew: true,
    keywords: ['percentage calculator', 'percent calculator', 'percentage change', 'percent of', 'math calculator'],
    relatedIds: ['age-calculator', 'unit-converter', 'bmi-calculator'],
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index with metric or imperial units.',
    longDescription:
      'Calculate your Body Mass Index using metric (kg/cm) or imperial (lbs/ft/in) units. See your BMI category, healthy weight range, and personalized health insights.',
    category: 'utility-tools',
    icon: 'target',
    url: '/tools/bmi-calculator/',
    isNew: true,
    keywords: ['bmi calculator', 'body mass index', 'bmi', 'health calculator', 'weight calculator'],
    relatedIds: ['percentage-calculator', 'age-calculator', 'unit-converter'],
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, and more.',
    longDescription:
      'Convert any text between uppercase, lowercase, title case, sentence case, alternating case, inverse case, and camelCase. Instant conversion with copy-to-clipboard.',
    category: 'utility-tools',
    icon: 'word',
    url: '/tools/case-converter/',
    isNew: true,
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'sentence case', 'text converter'],
    relatedIds: ['word-counter', 'character-counter', 'markdown-editor'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID v4 and v7 identifiers instantly.',
    longDescription:
      'Generate random UUIDs (v4) and time-ordered UUIDs (v7) in bulk. Copy individual UUIDs or download all as a text file.',
    category: 'developer-tools',
    icon: 'lock',
    url: '/tools/uuid-generator/',
    isNew: true,
    keywords: ['uuid generator', 'uuid', 'guid', 'unique id', 'developer tools', 'random id'],
    relatedIds: ['password-generator', 'json-formatter', 'unit-converter'],
  },
  {
    id: 'sheet-backend-generator',
    name: 'Sheet Backend',
    description: 'Turn any Google Sheet into a REST API database backend.',
    longDescription:
      'Generate the necessary Google Apps Script code to seamlessly convert your Google Spreadsheet into a fully functioning API backend supporting POST and GET operations.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/sheet-backend-generator/',
    isNew: true,
    keywords: [
      'google sheets backend',
      'sheet to api',
      'google sheets database',
      'apps script generator',
      'free backend',
    ],
    relatedIds: ['json-formatter', 'base64-tool', 'uuid-generator'],
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL values.',
    longDescription:
      'Convert colors between HEX, RGB, and HSL formats with a live color preview. Pick colors visually and copy the converted values with a single click.',
    category: 'developer-tools',
    icon: 'target',
    url: '/tools/color-converter/',
    isNew: true,
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'color picker', 'hsl', 'web colors'],
    relatedIds: ['json-formatter', 'unit-converter', 'case-converter'],
  },
  {
    id: 'base64-tool',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings instantly.',
    longDescription:
      'Encode text or files to Base64 and decode Base64 back to text. Supports UTF-8 text and file upload. Fast, private, all in your browser.',
    category: 'developer-tools',
    icon: 'lock',
    url: '/tools/base64-tool/',
    isNew: true,
    keywords: ['base64 encoder', 'base64 decoder', 'base64', 'encode', 'decode', 'developer tools'],
    relatedIds: ['json-formatter', 'uuid-generator', 'password-generator'],
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text in various formats and lengths.',
    longDescription:
      'Generate Lorem Ipsum placeholder text as paragraphs, sentences, words, or bytes. Copy or download the generated text for use in designs and mockups.',
    category: 'creator-tools',
    icon: 'word',
    url: '/tools/lorem-ipsum/',
    isNew: true,
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'generator', 'mockup text'],
    relatedIds: ['markdown-editor', 'hashtag-generator', 'word-counter'],
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Format, minify, and validate HTML code with syntax highlighting.',
    longDescription:
      'Format messy HTML into clean, indented code. Minify for production. Validate tags, detect errors, and copy with one click. All in your browser, zero server uploads.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/html-formatter/',
    isNew: true,
    keywords: [
      'html formatter',
      'html beautifier',
      'html minifier',
      'html validator',
      'code formatter',
      'web developer tools',
    ],
    relatedIds: ['css-formatter', 'json-formatter', 'base64-tool'],
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    description: 'Format, minify, and validate CSS with syntax highlighting and error detection.',
    longDescription:
      'Format messy CSS into clean, readable stylesheets. Minify for production, sort properties alphabetically, and detect syntax errors. All client-side with zero data uploads.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/css-formatter/',
    isNew: true,
    keywords: ['css formatter', 'css beautifier', 'css minifier', 'css validator', 'css prettier', 'web developer'],
    relatedIds: ['html-formatter', 'json-formatter', 'color-converter'],
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with live matching and explanation.',
    longDescription:
      'Test regular expressions against sample text with real-time highlighting of matches. View match groups, replace patterns, and get plain-English explanation of your regex. Fully client-side.',
    category: 'developer-tools',
    icon: 'search',
    url: '/tools/regex-tester/',
    isNew: true,
    keywords: ['regex tester', 'regular expression', 'regex', 'regex debugger', 'pattern matching', 'developer tools'],
    relatedIds: ['json-formatter', 'diff-checker', 'url-encoder'],
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two texts and highlight differences line by line.',
    longDescription:
      'Compare two blocks of text or code side-by-side. Instantly see added, removed, and unchanged lines with color-coded highlighting. Perfect for code reviews and version comparisons.',
    category: 'developer-tools',
    icon: 'columns',
    url: '/tools/diff-checker/',
    isNew: true,
    keywords: [
      'diff checker',
      'text compare',
      'code diff',
      'difference checker',
      'side by side compare',
      'code review',
    ],
    relatedIds: ['regex-tester', 'html-formatter', 'json-formatter'],
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs, query strings, and special characters.',
    longDescription:
      'Encode text for safe URL transmission and decode encoded URLs back to readable text. Supports full URL encoding, component encoding, and base64 variants. Instant results with copy support.',
    category: 'developer-tools',
    icon: 'link',
    url: '/tools/url-encoder/',
    isNew: true,
    keywords: ['url encoder', 'url decoder', 'encode url', 'decode url', 'percent encoding', 'query string'],
    relatedIds: ['base64-tool', 'json-formatter', 'regex-tester'],
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens — header, payload, and signature.',
    longDescription:
      'Decode JSON Web Tokens (JWT) to inspect header claims and payload data. View decoded JSON with syntax highlighting. Check token expiration. All processing happens client-side.',
    category: 'developer-tools',
    icon: 'lock',
    url: '/tools/jwt-decoder/',
    isNew: true,
    keywords: ['jwt decoder', 'jwt inspector', 'json web token', 'token decoder', 'jwt debugger', 'auth tokens'],
    relatedIds: ['base64-tool', 'json-formatter', 'url-encoder'],
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with configurable indentation and case.',
    longDescription:
      'Format raw SQL queries into clean, readable statements. Choose uppercase or lowercase keywords, control indentation, and copy formatted queries with one click. Supports SELECT, INSERT, UPDATE, DELETE, and DDL statements.',
    category: 'developer-tools',
    icon: 'database',
    url: '/tools/sql-formatter/',
    isNew: true,
    keywords: [
      'sql formatter',
      'sql beautifier',
      'sql formatter online',
      'query formatter',
      'sql prettier',
      'database tools',
    ],
    relatedIds: ['json-formatter', 'html-formatter', 'css-formatter'],
  },
  {
    id: 'economy-rate-calculator',
    name: 'Economy Rate Calculator',
    description: 'Calculate bowling economy rate — runs conceded per over.',
    longDescription:
      "Calculate a bowler's economy rate by entering runs conceded and overs bowled. Supports fractional overs (e.g., 7.3 overs). View economy rate, total runs, and comparison with standard benchmarks.",
    category: 'cricket-tools',
    icon: 'target',
    url: '/tools/economy-rate-calculator/',
    isNew: true,
    keywords: ['economy rate', 'bowling economy', 'cricket economy', 'bowling average', 'cricket statistics'],
    relatedIds: ['run-rate-calculator', 'strike-rate-calculator', 'cricket-over-calculator'],
  },
  {
    id: 'cricket-over-calculator',
    name: 'Cricket Over Calculator',
    description: 'Convert balls to overs and calculate bowling figures with precision.',
    longDescription:
      'Convert between balls bowled and overs in cricket. Calculate total overs from balls, balls from overs (including fractional), and analyze bowling figures. Supports all cricket formats including Test, ODI, and T20.',
    category: 'cricket-tools',
    icon: 'runrate',
    url: '/tools/cricket-over-calculator/',
    isNew: true,
    keywords: ['cricket over calculator', 'balls to overs', 'cricket overs', 'bowling figures', 'cricket math'],
    relatedIds: ['run-rate-calculator', 'strike-rate-calculator', 'economy-rate-calculator'],
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a range with count and uniqueness options.',
    longDescription:
      'Generate truly random numbers within any range. Choose how many numbers to generate, allow duplicates or force uniqueness, sort results, and copy with one click. Perfect for giveaways, sampling, and games.',
    category: 'utility-tools',
    icon: 'bolt',
    url: '/tools/random-number-generator/',
    isNew: true,
    keywords: ['random number generator', 'random number', 'randomizer', 'lottery picker', 'number generator'],
    relatedIds: ['password-generator', 'list-randomizer', 'percentage-calculator'],
  },
  {
    id: 'list-randomizer',
    name: 'List Randomizer',
    description: 'Shuffle, randomize, and pick from any list of items.',
    longDescription:
      'Enter any list of items (one per line) and shuffle them randomly, pick random items, or generate random pairings. Copy results, export as text, or re-randomize. Perfect for picking winners and team assignments.',
    category: 'utility-tools',
    icon: 'shuffle',
    url: '/tools/list-randomizer/',
    isNew: true,
    keywords: ['list randomizer', 'shuffle list', 'random picker', 'randomizer', 'raffle picker', 'team generator'],
    relatedIds: ['random-number-generator', 'password-generator', 'hashtag-generator'],
  },
  {
    id: 'color-contrast-checker',
    name: 'Color Contrast Checker',
    description: 'Check WCAG color contrast ratios between foreground and background colors.',
    longDescription:
      'Check the contrast ratio between two colors and see if they pass WCAG AA and AAA standards for normal text, large text, and UI components. Supports HEX, RGB, and HSL color input with live preview.',
    category: 'utility-tools',
    icon: 'target',
    url: '/tools/color-contrast-checker/',
    isNew: true,
    keywords: [
      'color contrast checker',
      'wcag contrast',
      'accessibility checker',
      'color contrast ratio',
      'a11y tools',
    ],
    relatedIds: ['color-converter', 'css-formatter', 'html-formatter'],
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Create countdown timers for any date or event with live updates.',
    longDescription:
      'Set a target date and watch the countdown in real-time — days, hours, minutes, and seconds. Save multiple countdowns locally, customize event names, and share countdown links with others.',
    category: 'creator-tools',
    icon: 'clock',
    url: '/tools/countdown-timer/',
    isNew: true,
    keywords: ['countdown timer', 'event timer', 'countdown', 'days counter', 'event countdown', 'time until'],
    relatedIds: ['age-calculator', 'qr-generator', 'hashtag-generator'],
  },
  {
    id: 'svg-to-png',
    name: 'SVG to PNG',
    description: 'Convert SVG code or files to high-quality PNG images.',
    longDescription:
      'Paste SVG code or upload .svg files and convert them to PNG format. Set custom dimensions, background color, and scale. Download individual PNGs or batch convert multiple SVGs. All processing is client-side.',
    category: 'image-tools',
    icon: 'image',
    url: '/tools/svg-to-png/',
    isNew: true,
    keywords: ['svg to png', 'convert svg', 'svg converter', 'vector to raster', 'image converter', 'svg render'],
    relatedIds: ['jpg-to-png', 'png-to-webp', 'image-compressor'],
  },
  {
    id: 'ai-text-summarizer',
    name: 'AI Text Summarizer',
    description: 'Summarize long articles and text into concise, readable summaries.',
    longDescription:
      'Extract the most important sentences from any text to create a concise summary. Uses intelligent sentence scoring based on keyword frequency, position, and length. Great for articles, papers, and reports.',
    category: 'ai-tools',
    icon: 'message',
    url: '/tools/ai-text-summarizer/',
    isNew: true,
    isFeatured: true,
    keywords: [
      'ai text summarizer',
      'text summarizer',
      'summary generator',
      'article summarizer',
      'ai summary',
      'text analysis',
    ],
    relatedIds: ['ai-keyword-extractor', 'ai-readability-analyzer', 'ai-grammar-checker'],
  },
  {
    id: 'ai-grammar-checker',
    name: 'AI Grammar Checker',
    description: 'Check grammar, spelling, and punctuation with AI-powered suggestions.',
    longDescription:
      'Analyze your text for grammar errors, spelling mistakes, and punctuation issues. Get intelligent suggestions with explanations. Perfect for emails, essays, and professional writing.',
    category: 'ai-tools',
    icon: 'edit',
    url: '/tools/ai-grammar-checker/',
    isNew: true,
    isPopular: true,
    keywords: [
      'ai grammar checker',
      'grammar check',
      'spell checker',
      'writing assistant',
      'proofreading',
      'ai writing',
    ],
    relatedIds: ['ai-text-summarizer', 'ai-paraphraser', 'word-counter'],
  },
  {
    id: 'ai-sentiment-analyzer',
    name: 'AI Sentiment Analyzer',
    description: 'Analyze text sentiment — positive, negative, or neutral with emotion detection.',
    longDescription:
      'Detect the emotional tone of any text. Get sentiment scores for positive, negative, and neutral content with keyword-level breakdown. Understand customer feedback, social media posts, and reviews.',
    category: 'ai-tools',
    icon: 'thumbsup',
    url: '/tools/ai-sentiment-analyzer/',
    isNew: true,
    keywords: [
      'ai sentiment analyzer',
      'sentiment analysis',
      'emotion detection',
      'text tone analyzer',
      'opinion mining',
      'ai text analysis',
    ],
    relatedIds: ['ai-keyword-extractor', 'ai-text-summarizer', 'ai-language-detector'],
  },
  {
    id: 'ai-keyword-extractor',
    name: 'AI Keyword Extractor',
    description: 'Extract key topics and phrases from any text automatically.',
    longDescription:
      'Automatically identify the most important keywords and keyphrases from your text. Uses n-gram frequency analysis and phrase detection. Perfect for SEO, content analysis, and research.',
    category: 'ai-tools',
    icon: 'search',
    url: '/tools/ai-keyword-extractor/',
    isNew: true,
    keywords: [
      'ai keyword extractor',
      'keyword extraction',
      'keyphrase extractor',
      'seo keywords',
      'text analysis',
      'content analysis',
    ],
    relatedIds: ['ai-text-summarizer', 'ai-sentiment-analyzer', 'ai-tag-generator'],
  },
  {
    id: 'ai-language-detector',
    name: 'AI Language Detector',
    description: 'Detect the language of any text with high accuracy.',
    longDescription:
      'Identify the language of any text instantly. Supports 29 languages including English, Spanish, French, German, Chinese, Arabic, and more. Uses character n-gram analysis for accurate detection.',
    category: 'ai-tools',
    icon: 'globe2',
    url: '/tools/ai-language-detector/',
    isNew: true,
    keywords: [
      'ai language detector',
      'language detection',
      'language identifier',
      'text language',
      'language recognition',
      'ai translation',
    ],
    relatedIds: ['ai-sentiment-analyzer', 'ai-text-summarizer', 'ai-keyword-extractor'],
  },
  {
    id: 'ai-readability-analyzer',
    name: 'AI Readability Analyzer',
    description: 'Analyze text readability with Flesch-Kincaid, Gunning Fog, and more scores.',
    longDescription:
      'Measure how readable your text is with industry-standard metrics: Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, and SMOG score. Get actionable insights to improve clarity.',
    category: 'ai-tools',
    icon: 'book',
    url: '/tools/ai-readability-analyzer/',
    isNew: true,
    keywords: [
      'ai readability analyzer',
      'readability score',
      'flesch kincaid',
      'gunning fog',
      'text readability',
      'writing analysis',
    ],
    relatedIds: ['word-counter', 'ai-text-summarizer', 'ai-grammar-checker'],
  },
  {
    id: 'ai-paraphraser',
    name: 'AI Paraphraser',
    description: 'Rewrite any text with different phrasing while preserving meaning.',
    longDescription:
      'Paraphrase sentences and paragraphs to improve clarity, avoid plagiarism, or match a specific tone. Multiple rewriting modes: standard, fluent, formal, and creative. All processing is client-side.',
    category: 'ai-tools',
    icon: 'edit',
    url: '/tools/ai-paraphraser/',
    isNew: true,
    keywords: [
      'ai paraphraser',
      'text rewriter',
      'paraphrasing tool',
      'rewrite text',
      'article rewriter',
      'ai writing',
    ],
    relatedIds: ['ai-grammar-checker', 'ai-text-summarizer', 'case-converter'],
  },
  {
    id: 'ai-tag-generator',
    name: 'AI Tag Generator',
    description: 'Generate relevant tags and hashtags from your content automatically.',
    longDescription:
      'Analyze your content and suggest relevant tags, keywords, and hashtags. Perfect for blog posts, YouTube videos, social media content, and SEO optimization. Extract meaningful topics from any text.',
    category: 'ai-tools',
    icon: 'hashtag',
    url: '/tools/ai-tag-generator/',
    isNew: true,
    keywords: ['ai tag generator', 'tag generator', 'hashtag suggestions', 'content tags', 'seo tags', 'auto tagging'],
    relatedIds: ['ai-keyword-extractor', 'hashtag-generator', 'ai-text-summarizer'],
  },
  {
    id: 'ai-chat',
    name: 'AI Chat Assistant',
    description: 'Chat with an AI assistant about tools, features, and get help with tasks.',
    longDescription:
      'A full-page conversational AI assistant that can answer questions about tools, execute basic transformations (word count, JSON format, base64, etc.), and guide you through the platform. All responses are generated locally — no data sent to servers.',
    category: 'ai-tools',
    icon: 'message',
    url: '/tools/ai-chat/',
    isNew: true,
    isFeatured: true,
    keywords: ['ai chat', 'chatbot', 'ai assistant', 'conversation', 'help', 'ai helper', 'virtual assistant'],
    relatedIds: ['ai-text-summarizer', 'ai-grammar-checker', 'ai-sentiment-analyzer'],
  },
  {
    id: 'ai-code-assistant',
    name: 'Code Formatter & Minifier',
    description: 'Format, minify, and validate code in JavaScript, Python, HTML, CSS, SQL, and more.',
    longDescription:
      'Format, minify, and validate code across multiple languages including JavaScript, TypeScript, Python, HTML, CSS, SQL, and JSON. Get syntax validation, line counts, and character stats. All processing is client-side with zero server uploads.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/ai-code-assistant/',
    isNew: true,
    keywords: [
      'code formatter',
      'code beautifier',
      'code minifier',
      'code validator',
      'javascript formatter',
      'python formatter',
      'html formatter',
      'css formatter',
      'sql formatter',
      'developer tools',
    ],
    relatedIds: ['json-formatter', 'html-formatter', 'css-formatter', 'sql-formatter'],
  },
  {
    id: 'ai-image-generator',
    name: 'Procedural Art Generator',
    description:
      'Generate procedural pixel art, ASCII art, patterns, and geometric visual compositions from text prompts.',
    longDescription:
      'Generate unique visual compositions from text descriptions using procedural client-side algorithms. Choose from Pixel Art, ASCII Art, Pattern, and Geometric styles. All rendering is done in your browser using HTML5 Canvas — no AI API calls, no external models, no server uploads.',
    category: 'image-tools',
    icon: 'image',
    url: '/tools/ai-image-generator/',
    isNew: true,
    isFeatured: true,
    keywords: [
      'ai image generator',
      'pixel art generator',
      'ascii art generator',
      'pattern generator',
      'geometric art',
      'canvas art',
      'text to image',
    ],
    relatedIds: ['svg-to-png', 'image-resizer', 'color-converter'],
  },
  {
    id: 'prompt-generator',
    name: 'AI Prompt Generator',
    description: 'Generate highly effective, optimized prompts for ChatGPT, Midjourney, and Claude.',
    longDescription:
      'Create highly effective, optimized prompts for AI models using proven prompt engineering frameworks like Role-Task-Format and Chain of Thought. Perfect for ChatGPT, Claude, and Midjourney.',
    category: 'ai-tools',
    icon: 'sparkles',
    url: '/tools/prompt-generator/',
    isNew: true,
    isFeatured: true,
    keywords: [
      'prompt generator',
      'ai prompts',
      'chatgpt prompts',
      'midjourney prompts',
      'prompt engineering',
      'ai tools',
    ],
    relatedIds: ['ai-chat', 'ai-text-summarizer', 'ai-image-generator'],
  },
  {
    id: 'ai-background-remover',
    name: 'AI Background Remover',
    description: 'Remove backgrounds from images instantly in your browser with zero server uploads.',
    longDescription:
      'Client-side AI background removal using WebAssembly and neural models running directly in your browser. Complete privacy with zero image uploads.',
    category: 'image-tools',
    icon: 'image',
    url: '/tools/ai-background-remover/',
    isNew: true,
    keywords: ['background remover', 'ai background remover', 'remove bg', 'transparent background', 'photo editor'],
    relatedIds: ['image-compressor', 'image-cropper', 'jpg-to-png'],
  },
  {
    id: 'ai-image-upscaler',
    name: 'AI Image Upscaler',
    description: 'Upscale and enhance low-resolution images directly in your browser using local neural models.',
    longDescription:
      'High-fidelity client-side super-resolution image upscaling powered by WebGL/WASM models. Enhance image sharpness without remote API costs.',
    category: 'image-tools',
    icon: 'image',
    url: '/tools/ai-image-upscaler/',
    isNew: true,
    keywords: ['image upscaler', 'ai upscaler', 'super resolution', 'photo enhancer', 'upscale photo'],
    relatedIds: ['image-compressor', 'image-resizer', 'png-to-webp'],
  },
  {
    id: 'browser-detector',
    name: 'Browser & Hardware Detector',
    description: 'Detect client browser engine, WebGPU/WebGL capabilities, screen resolution, and hardware concurrency.',
    longDescription:
      'Instant browser diagnostics inspecting user agent, GPU renderer, viewport dimensions, color depth, and Web API support with 100% privacy.',
    category: 'utility-tools',
    icon: 'cog',
    url: '/tools/browser-detector/',
    isNew: true,
    keywords: ['browser detector', 'user agent checker', 'webgpu test', 'screen resolution', 'hardware inspector'],
    relatedIds: ['unit-converter', 'epoch-converter', 'color-contrast-checker'],
  },
  {
    id: 'cipher-hash',
    name: 'SHA-256 & Crypto Hash Generator',
    description: 'Compute cryptographic checksums (SHA-256, SHA-512, SHA-1, MD5) for text and files locally.',
    longDescription:
      'High-speed Web Crypto API hash generator for text and binary files. Compute SHA-256, SHA-384, SHA-512, and HMAC signatures with zero cloud uploads.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/cipher-hash/',
    isNew: true,
    keywords: ['sha256 generator', 'crypto hash', 'checksum generator', 'sha512', 'hmac generator'],
    relatedIds: ['base64-tool', 'jwt-decoder', 'uuid-generator'],
  },
  {
    id: 'cricket-dls-calculator',
    name: 'Cricket DLS Calculator',
    description: 'Calculate rain-curtailed revised targets and par scores using the DLS Standard Edition model.',
    longDescription:
      'DLS Standard Edition resource table calculator for rain-curtailed T20 and ODI matches. Compute revised targets and par score estimates.',
    category: 'cricket-tools',
    icon: 'trophy',
    url: '/tools/cricket-dls-calculator/',
    isNew: true,
    isPopular: true,
    keywords: ['cricket dls calculator', 'duckworth lewis calculator', 'dls par score', 'rain rule cricket', 'cricket target'],
    relatedIds: ['cricket-target-calculator', 'net-run-rate-calculator', 'run-rate-calculator'],
  },
  {
    id: 'cricket-target-calculator',
    name: 'Cricket Target Calculator',
    description: 'Project 20-over and 50-over chase targets and compute required run rates for remaining overs.',
    longDescription:
      'Real-time cricket chase simulator predicting target scores based on current run rate, wickets in hand, and required scoring acceleration.',
    category: 'cricket-tools',
    icon: 'trophy',
    url: '/tools/cricket-target-calculator/',
    isNew: true,
    keywords: ['cricket target calculator', 'chase simulator', 'projected score', 'target predictor', 'ipl target calc'],
    relatedIds: ['run-rate-calculator', 'cricket-dls-calculator', 'net-run-rate-calculator'],
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser & Explainer',
    description: 'Parse, validate, and convert standard 5-part and 6-part cron expressions into human-readable schedules.',
    longDescription:
      'Interactive cron schedule inspector showing upcoming execution dates, human-readable descriptions, and common cron presets for devops workflows.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/cron-parser/',
    isNew: true,
    keywords: ['cron parser', 'cron expression', 'cron schedule', 'crontab generator', 'cron validator'],
    relatedIds: ['epoch-converter', 'json-formatter', 'regex-tester'],
  },
  {
    id: 'date-calculator',
    name: 'Business Days & Working Days Calculator',
    description: 'Calculate exact calendar days and business days excluding weekends between dates. 100% private.',
    longDescription:
      'B2B working days and calendar interval calculator. Compute sprint durations, project notice periods, and add/subtract business days with zero tracking.',
    category: 'utility-tools',
    icon: 'clock',
    url: '/tools/date-calculator/',
    isNew: true,
    isPopular: true,
    keywords: ['business days calculator', 'working days calculator', 'days between dates', 'exclude weekends', 'date calculator'],
    relatedIds: ['age-calculator', 'countdown-timer', 'unit-converter'],
  },
  {
    id: 'epoch-converter',
    name: 'Unix Epoch Timestamp Converter',
    description: 'Convert Unix timestamps (seconds & milliseconds) to human dates, UTC, and ISO-8601 strings.',
    longDescription:
      'High-precision Unix timestamp converter supporting seconds, milliseconds, microseconds, and nanoseconds with local timezone and UTC formatting.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/epoch-converter/',
    isNew: true,
    keywords: ['epoch converter', 'unix timestamp', 'timestamp to date', 'iso 8601 converter', 'unix time'],
    relatedIds: ['date-calculator', 'cron-parser', 'jwt-decoder'],
  },
  {
    id: 'instagram-line-break',
    name: 'Instagram Caption Line Break Generator',
    description: 'Format clean Instagram and social captions with invisible spaces and clean paragraph spacing.',
    longDescription:
      'Eliminate collapsed Instagram captions by generating invisible whitespace breaks and clean line spacing with 1-click clipboard copy.',
    category: 'creator-tools',
    icon: 'creator',
    url: '/tools/instagram-line-break/',
    isNew: true,
    keywords: ['instagram line break', 'caption spacer', 'clean captions', 'instagram formatting', 'social line breaker'],
    relatedIds: ['hashtag-generator', 'word-counter', 'character-counter'],
  },
  {
    id: 'markdown-to-pdf',
    name: 'Markdown to PDF Converter',
    description: 'Render markdown into styled documents and export directly to vector PDF in your browser.',
    longDescription:
      'Client-side Markdown to PDF converter with live preview, syntax highlighting, custom page sizing, and zero server uploads.',
    category: 'creator-tools',
    icon: 'creator',
    url: '/tools/markdown-to-pdf/',
    isNew: true,
    isFeatured: true,
    keywords: ['markdown to pdf', 'md to pdf', 'convert markdown pdf', 'pdf exporter', 'markdown document'],
    relatedIds: ['markdown-editor', 'pdf-merger', 'word-counter'],
  },
  {
    id: 'meta-tag-generator',
    name: 'Meta Tag Generator & SERP Previewer',
    description: 'Generate SEO meta tags with live Google Mobile SERP, OpenGraph, X Card, and AI citation previews.',
    longDescription:
      'Comprehensive SEO meta tag builder featuring real-time Google Mobile SERP preview, OpenGraph card previews, and character limits.',
    category: 'developer-tools',
    icon: 'code',
    url: '/tools/meta-tag-generator/',
    isNew: true,
    isPopular: true,
    keywords: ['meta tag generator', 'serp previewer', 'opengraph generator', 'twitter card maker', 'seo meta tags'],
    relatedIds: ['json-formatter', 'character-counter', 'utm-builder'],
  },
  {
    id: 'net-run-rate-calculator',
    name: 'Cricket Net Run Rate (NRR) Calculator',
    description: 'Cricket Net Run Rate calculator following ICC Clause 16.10.2 and tournament playoff qualification simulator.',
    longDescription:
      'Calculate tournament Net Run Rate (NRR) with all-out quota handling following ICC Clause 16.10.2 for PSL, IPL, and World Cup qualification.',
    category: 'cricket-tools',
    icon: 'trophy',
    url: '/tools/net-run-rate-calculator/',
    isNew: true,
    isFeatured: true,
    isPopular: true,
    keywords: ['net run rate calculator', 'cricket nrr', 'icc law 16.10.2', 'playoff scenario simulator', 'cricket standings'],
    relatedIds: ['run-rate-calculator', 'strike-rate-calculator', 'cricket-target-calculator'],
  },
  {
    id: 'pdf-merger',
    name: 'Client-Side PDF Merger',
    description: 'Combine multiple PDF files into a single document in seconds with 100% browser-based privacy.',
    longDescription:
      'Merge PDF documents locally in your browser using pdf-lib. Reorder pages, preserve bookmarks, and combine files without server uploads.',
    category: 'utility-tools',
    icon: 'wrench',
    url: '/tools/pdf-merger/',
    isNew: true,
    isPopular: true,
    keywords: ['pdf merger', 'combine pdfs', 'merge pdf online', 'free pdf joiner', 'join pdf files'],
    relatedIds: ['pdf-splitter', 'pdf-to-image', 'markdown-to-pdf'],
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter & Page Extractor',
    description: 'Split large PDF documents or extract custom page ranges locally inside your browser.',
    longDescription:
      'Extract specific pages or split PDF documents into individual files with zero cloud uploads using client-side pdf-lib.',
    category: 'utility-tools',
    icon: 'wrench',
    url: '/tools/pdf-splitter/',
    isNew: true,
    keywords: ['pdf splitter', 'extract pdf pages', 'split pdf online', 'separate pdf', 'pdf page extractor'],
    relatedIds: ['pdf-merger', 'pdf-to-image', 'markdown-to-pdf'],
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image Converter',
    description: 'Convert PDF document pages into high-resolution PNG or JPG images with zero server uploads.',
    longDescription:
      'Render PDF pages directly to HTML5 Canvas and download high-DPI PNG or JPEG images with complete device privacy.',
    category: 'utility-tools',
    icon: 'wrench',
    url: '/tools/pdf-to-image/',
    isNew: true,
    keywords: ['pdf to image', 'pdf to png', 'pdf to jpg', 'convert pdf to photo', 'extract images from pdf'],
    relatedIds: ['pdf-merger', 'image-compressor', 'jpg-to-png'],
  },
  {
    id: 'strike-rate-average-calculator',
    name: 'Batting Strike Rate & Average Calculator',
    description: 'Calculate batting strike rate and averages with 1-click 1080x1920 mobile Shorts/Reels stat card export.',
    longDescription:
      'Cricket batting statistics calculator computing strike rates, averages, and boundary percentages with high-res vertical social card export.',
    category: 'cricket-tools',
    icon: 'trophy',
    url: '/tools/strike-rate-average-calculator/',
    isNew: true,
    isPopular: true,
    keywords: ['strike rate calculator', 'batting average calculator', 'cricket stat card', 'wws stat card', 'cricket stats'],
    relatedIds: ['strike-rate-calculator', 'run-rate-calculator', 'net-run-rate-calculator'],
  },
  {
    id: 'utm-builder',
    name: 'Campaign UTM Parameter Builder',
    description: 'Build tracking campaign URLs with source, medium, campaign, term, and content tags.',
    longDescription:
      'Marketing URL builder formatting standard Google Analytics UTM tracking parameters with presets, validation, and 1-click copy.',
    category: 'creator-tools',
    icon: 'creator',
    url: '/tools/utm-builder/',
    isNew: true,
    keywords: ['utm builder', 'campaign url builder', 'google analytics utm', 'marketing tracking url', 'utm generator'],
    relatedIds: ['qr-generator', 'meta-tag-generator', 'url-encoder'],
  },
  {
    id: 'youtube-title-generator',
    name: 'YouTube Title & Hook Generator',
    description: 'Generate high-CTR YouTube titles, video hooks, and curiosity headlines using proven viral frameworks.',
    longDescription:
      'Content creator headline engine generating high-CTR YouTube video titles, curiosity hooks, and listicles for creators.',
    category: 'creator-tools',
    icon: 'creator',
    url: '/tools/youtube-title-generator/',
    isNew: true,
    isPopular: true,
    keywords: ['youtube title generator', 'viral video titles', 'video hook generator', 'youtube headline maker', 'creator titles'],
    relatedIds: ['hashtag-generator', 'image-resizer', 'prompt-generator'],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.id === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getRelatedTools(currentId: string, limit = 3): Tool[] {
  const current = getToolBySlug(currentId);
  if (!current) return [];
  const related = current.relatedIds.map((id) => getToolBySlug(id)).filter(Boolean) as Tool[];
  if (related.length < limit) {
    const sameCategory = tools.filter(
      (t) => t.category === current.category && t.id !== currentId && !related.find((r) => r.id === t.id),
    );
    related.push(...sameCategory.slice(0, limit - related.length));
  }
  return related.slice(0, limit);
}

export function getCategoryInfo(categoryId: ToolCategory): CategoryInfo | undefined {
  return categories.find((c) => c.id === categoryId);
}

export function getPopularTools(limit = 5): Tool[] {
  return tools.filter((t) => t.isPopular).slice(0, limit);
}

export function getFeaturedTools(limit = 6): Tool[] {
  return tools.filter((t) => t.isFeatured).slice(0, limit);
}

export function getNewTools(limit = 4): Tool[] {
  return tools.filter((t) => t.isNew).slice(0, limit);
}
