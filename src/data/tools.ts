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

export type ToolCategory = "image-tools" | "creator-tools" | "utility-tools" | "cricket-tools";

export interface CategoryInfo {
  id: ToolCategory;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  count: number;
}

export const categories: CategoryInfo[] = [
  { id: "image-tools", title: "Image Tools", description: "Convert, compress, and resize images inside your browser with zero server uploads.", icon: "image", gradient: "from-purple-500/20 to-pink-500/20 text-purple-400", count: 4 },
  { id: "creator-tools", title: "Creator Tools", description: "Smart hashtag generators, QR builders, and text processors to scale your social footprint.", icon: "creator", gradient: "from-blue-500/20 to-cyan-500/20 text-blue-400", count: 3 },
  { id: "utility-tools", title: "Utility Tools", description: "Secure password creation, precise age calculations, and text structure counters.", icon: "utility", gradient: "from-green-500/20 to-emerald-500/20 text-green-400", count: 5 },
  { id: "cricket-tools", title: "Cricket Tools", description: "Professional match run rate calculators and batting/bowling strike rate models.", icon: "cricket", gradient: "from-amber-500/20 to-orange-500/20 text-amber-400", count: 2 },
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
