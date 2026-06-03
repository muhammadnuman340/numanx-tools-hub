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

export type ToolCategory = "image-tools" | "creator-tools" | "utility-tools" | "cricket-tools" | "ai-tools" | "developer-tools";

export interface CategoryInfo {
  id: ToolCategory;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  count: number;
}

export const categories: CategoryInfo[] = [
  { id: "image-tools", title: "Image Tools", description: "Convert, compress, crop, and resize images inside your browser with zero server uploads.", icon: "image", gradient: "from-purple-500/20 to-pink-500/20 text-purple-400", count: 6 },
  { id: "creator-tools", title: "Creator Tools", description: "Smart hashtag generators, QR builders, and text processors to scale your social footprint.", icon: "creator", gradient: "from-blue-500/20 to-cyan-500/20 text-blue-400", count: 4 },
  { id: "utility-tools", title: "Utility Tools", description: "Secure password creation, precise age calculations, and text structure counters.", icon: "utility", gradient: "from-green-500/20 to-emerald-500/20 text-green-400", count: 12 },
    { id: "cricket-tools", title: "Cricket Tools", description: "Professional match run rate calculators and batting/bowling strike rate models.", icon: "cricket", gradient: "from-amber-500/20 to-orange-500/20 text-amber-400", count: 2 },
    { id: "ai-tools", title: "AI Tools", description: "Powerful AI-powered utilities for content generation, translation, and intelligent text processing — all running locally in your browser.", icon: "creator", gradient: "from-violet-500/20 to-purple-500/20 text-violet-400", count: 0 },
    { id: "developer-tools", title: "Developer Tools", description: "Essential utilities for developers — JSON formatter, Base64 encoder, UUID generator, color converter, and more.", icon: "utility", gradient: "from-cyan-500/20 to-blue-500/20 text-cyan-400", count: 0 },
];

export const tools: Tool[] = [
  {
    id: "qr-generator",
    name: "QR Generator",
    description: "Generate QR codes from URLs, text, and messages instantly.",
    longDescription: "Generate premium custom QR codes from URLs, text, and messages instantly with multiple templates and theme presets.",
    category: "creator-tools",
    icon: "qr",
    url: "/tools/qr-generator/",
    isFeatured: true,
    isPopular: true,
    keywords: ["qr", "qr code", "qr generator", "barcode", "scanner"],
    relatedIds: ["hashtag-generator", "password-generator"],
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs in your text.",
    longDescription: "Advanced character, word, sentence, and paragraph counter with readability analysis and keyword density panel.",
    category: "utility-tools",
    icon: "word",
    url: "/tools/word-counter/",
    isFeatured: true,
    keywords: ["word counter", "character count", "text analyzer", "readability", "writing"],
    relatedIds: ["age-calculator", "password-generator"],
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, days, hours, and minutes.",
    longDescription: "Calculate exact age in years, months, days, hours, and minutes with life analytics and time alive visualization.",
    category: "utility-tools",
    icon: "age",
    url: "/tools/age-calculator/",
    keywords: ["age calculator", "birthday", "age", "date calculator", "time alive"],
    relatedIds: ["word-counter", "run-rate-calculator"],
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure passwords with custom length and options.",
    longDescription: "Generate ultra-secure, randomized passwords with custom parameters, entropy display, and password history.",
    category: "utility-tools",
    icon: "password",
    url: "/tools/password-generator/",
    isPopular: true,
    keywords: ["password", "password generator", "secure", "random", "entropy"],
    relatedIds: ["qr-generator", "hashtag-generator"],
  },
  {
    id: "hashtag-generator",
    name: "Hashtag Generator",
    description: "Generate trending hashtags for social media posts and content.",
    longDescription: "Generate trending hashtags for social media posts with popularity scores, favorites, and multi-platform support.",
    category: "creator-tools",
    icon: "hashtag",
    url: "/tools/hashtag-generator/",
    isPopular: true,
    keywords: ["hashtag", "hashtag generator", "social media", "trending", "viral"],
    relatedIds: ["qr-generator", "password-generator"],
  },
  {
    id: "run-rate-calculator",
    name: "Run Rate Calculator",
    description: "Calculate cricket run rates and required run rates for matches.",
    longDescription: "Calculate cricket target run rates, net run rates, and required over formulas with chase difficulty analysis.",
    category: "cricket-tools",
    icon: "runrate",
    url: "/tools/run-rate-calculator/",
    isFeatured: true,
    keywords: ["run rate", "cricket", "run rate calculator", "cricket calculator", "match analysis"],
    relatedIds: ["strike-rate-calculator", "age-calculator"],
  },
  {
    id: "strike-rate-calculator",
    name: "Strike Rate Calculator",
    description: "Calculate batting and bowling strike rates in cricket.",
    longDescription: "Calculate batting and bowling strike rates in cricket with impact rating, match influence score, and player presets.",
    category: "cricket-tools",
    icon: "strikerate",
    url: "/tools/strike-rate-calculator/",
    keywords: ["strike rate", "cricket", "batting", "bowling", "strike rate calculator"],
    relatedIds: ["run-rate-calculator", "age-calculator"],
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    description: "Convert JPG images to PNG format with high quality preservation.",
    longDescription: "Immediate batch JPG to PNG converter with drag-and-drop, analytics bar, and before/after comparison.",
    category: "image-tools",
    icon: "jpg2png",
    url: "/tools/jpg-to-png/",
    isPopular: true,
    keywords: ["jpg to png", "convert", "image converter", "jpg", "png"],
    relatedIds: ["png-to-webp", "image-compressor", "image-resizer"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images without losing quality, with batch processing support.",
    longDescription: "Lossless client-side image compression to reduce file sizes up to 90% with quality presets and batch processing.",
    category: "image-tools",
    icon: "compress",
    url: "/tools/image-compressor/",
    isFeatured: true,
    isPopular: true,
    keywords: ["image compressor", "compress", "image optimizer", "file size", "batch"],
    relatedIds: ["jpg-to-png", "png-to-webp", "image-resizer"],
  },
  {
    id: "png-to-webp",
    name: "PNG to WebP",
    description: "Convert PNG images to WebP format for smaller file sizes.",
    longDescription: "Convert PNG images to WebP format for smaller file sizes with quality presets, analytics, and SEO benefits section.",
    category: "image-tools",
    icon: "webp",
    url: "/tools/png-to-webp/",
    keywords: ["png to webp", "convert", "webp", "image converter", "optimization"],
    relatedIds: ["jpg-to-png", "image-compressor", "image-resizer"],
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to any dimension with aspect ratio lock and presets.",
    longDescription: "Resize images to any dimension with aspect ratio lock, social media presets, and multiple export formats.",
    category: "image-tools",
    icon: "resize",
    url: "/tools/image-resizer/",
    keywords: ["image resizer", "resize", "aspect ratio", "social media", "dimensions"],
    relatedIds: ["jpg-to-png", "png-to-webp", "image-compressor"],
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, mass, volume, temperature, area, speed, time, and data units.",
    longDescription: "Convert 100+ units across 8 categories including length, mass, volume, temperature, area, speed, time, and data storage. Real-time conversion with smart category detection.",
    category: "utility-tools",
    icon: "unit",
    url: "/tools/unit-converter/",
    isFeatured: true,
    isPopular: true,
    isNew: true,
    keywords: ["unit converter", "length converter", "temperature converter", "metric", "imperial", "conversion"],
    relatedIds: ["age-calculator", "word-counter", "json-formatter"],
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and preview markdown in real-time with toolbar and HTML export.",
    longDescription: "Live markdown editor with split-pane preview, formatting toolbar, syntax highlighting, and one-click HTML export.",
    category: "creator-tools",
    icon: "markdown",
    url: "/tools/markdown-editor/",
    isFeatured: true,
    isNew: true,
    keywords: ["markdown editor", "markdown preview", "md editor", "rich text", "html export"],
    relatedIds: ["word-counter", "qr-generator", "hashtag-generator"],
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON data with syntax highlighting.",
    longDescription: "Format, validate, and minify JSON data with error highlighting, tree-view indentation, and one-click copy. Perfect for API debugging.",
    category: "utility-tools",
    icon: "json",
    url: "/tools/json-formatter/",
    isPopular: true,
    isNew: true,
    keywords: ["json formatter", "json validator", "json beautifier", "json minifier", "api tools"],
    relatedIds: ["unit-converter", "word-counter", "password-generator"],
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    description: "Convert PNG images to JPG format with quality control.",
    longDescription: "Convert PNG images to JPG format with adjustable quality. Client-side conversion with drag-and-drop support and instant download.",
    category: "image-tools",
    icon: "jpg2png",
    url: "/tools/png-to-jpg/",
    isNew: true,
    keywords: ["png to jpg", "convert", "image converter", "png", "jpg", "jpeg"],
    relatedIds: ["jpg-to-png", "image-compressor", "png-to-webp"],
  },
  {
    id: "character-counter",
    name: "Character Counter",
    description: "Count characters, words, sentences, and paragraphs with precision.",
    longDescription: "Count characters (with/without spaces), words, sentences, paragraphs, and lines in real-time. Includes reading time and speaking time estimates.",
    category: "utility-tools",
    icon: "word",
    url: "/tools/character-counter/",
    isNew: true,
    keywords: ["character counter", "character count", "word counter", "letter counter", "text analyzer"],
    relatedIds: ["word-counter", "json-formatter", "age-calculator"],
  },
  {
    id: "image-cropper",
    name: "Image Cropper",
    description: "Crop images to any dimension with customizable aspect ratios.",
    longDescription: "Crop PNG and JPG images with freeform or fixed aspect ratio presets. Drag to adjust crop area, preview in real-time, and download the result.",
    category: "image-tools",
    icon: "resize",
    url: "/tools/image-cropper/",
    isNew: true,
    keywords: ["image cropper", "crop image", "crop photo", "aspect ratio", "image editor"],
    relatedIds: ["image-resizer", "jpg-to-png", "image-compressor"],
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages — find X% of Y, percentage change, and more.",
    longDescription: "Calculate what is X% of Y, X is what % of Y, percentage increase/decrease, and percentage difference between two numbers. Simple, fast, accurate.",
    category: "utility-tools",
    icon: "age",
    url: "/tools/percentage-calculator/",
    isNew: true,
    keywords: ["percentage calculator", "percent calculator", "percentage change", "percent of", "math calculator"],
    relatedIds: ["age-calculator", "unit-converter", "bmi-calculator"],
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index with metric or imperial units.",
    longDescription: "Calculate your Body Mass Index using metric (kg/cm) or imperial (lbs/ft/in) units. See your BMI category, healthy weight range, and personalized health insights.",
    category: "utility-tools",
    icon: "target",
    url: "/tools/bmi-calculator/",
    isNew: true,
    keywords: ["bmi calculator", "body mass index", "bmi", "health calculator", "weight calculator"],
    relatedIds: ["percentage-calculator", "age-calculator", "unit-converter"],
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text between uppercase, lowercase, title case, sentence case, and more.",
    longDescription: "Convert any text between uppercase, lowercase, title case, sentence case, alternating case, inverse case, and camelCase. Instant conversion with copy-to-clipboard.",
    category: "utility-tools",
    icon: "word",
    url: "/tools/case-converter/",
    isNew: true,
    keywords: ["case converter", "uppercase", "lowercase", "title case", "sentence case", "text converter"],
    relatedIds: ["word-counter", "character-counter", "markdown-editor"],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate UUID v4 and v7 identifiers instantly.",
    longDescription: "Generate random UUIDs (v4) and time-ordered UUIDs (v7) in bulk. Copy individual UUIDs or download all as a text file.",
    category: "utility-tools",
    icon: "lock",
    url: "/tools/uuid-generator/",
    isNew: true,
    keywords: ["uuid generator", "uuid", "guid", "unique id", "developer tools", "random id"],
    relatedIds: ["password-generator", "json-formatter", "unit-converter"],
  },
  {
    id: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, and HSL values.",
    longDescription: "Convert colors between HEX, RGB, and HSL formats with a live color preview. Pick colors visually and copy the converted values with a single click.",
    category: "utility-tools",
    icon: "target",
    url: "/tools/color-converter/",
    isNew: true,
    keywords: ["color converter", "hex to rgb", "rgb to hex", "color picker", "hsl", "web colors"],
    relatedIds: ["json-formatter", "unit-converter", "case-converter"],
  },
  {
    id: "base64-tool",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings instantly.",
    longDescription: "Encode text or files to Base64 and decode Base64 back to text. Supports UTF-8 text and file upload. Fast, private, all in your browser.",
    category: "utility-tools",
    icon: "lock",
    url: "/tools/base64-tool/",
    isNew: true,
    keywords: ["base64 encoder", "base64 decoder", "base64", "encode", "decode", "developer tools"],
    relatedIds: ["json-formatter", "uuid-generator", "password-generator"],
  },
  {
    id: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text in various formats and lengths.",
    longDescription: "Generate Lorem Ipsum placeholder text as paragraphs, sentences, words, or bytes. Copy or download the generated text for use in designs and mockups.",
    category: "creator-tools",
    icon: "word",
    url: "/tools/lorem-ipsum/",
    isNew: true,
    keywords: ["lorem ipsum", "placeholder text", "dummy text", "generator", "mockup text"],
    relatedIds: ["markdown-editor", "hashtag-generator", "word-counter"],
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
    const sameCategory = tools.filter((t) => t.category === current.category && t.id !== currentId && !related.find((r) => r.id === t.id));
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
