import { tools as defaultTools, categories as defaultCategories, type Tool, type CategoryInfo } from '../data/tools';
import { currentSlug, RETIRED_SLUGS } from './retiredSlugs';

export interface SearchItem {
  id?: string;
  name: string;
  desc: string;
  cat: string;
  searchCat: string;
  icon: string;
  url: string;
  keywords: string[];
}

export const SEARCH_EXTRA_ITEMS: SearchItem[] = [
  {
    id: 'dashboard',
    name: 'Platform Dashboard',
    desc: 'Track live tool compilations, metrics, milestones, and development roadmap.',
    cat: 'Utility',
    searchCat: 'Utility Tools',
    icon: 'utility',
    url: '/dashboard/',
    keywords: ['dashboard', 'metrics', 'platform'],
  },
  {
    id: 'best-ai-tools-for-students',
    name: 'Best AI Tools for Students',
    desc: 'Top AI tools every student should use in 2026 for studying, writing, and research.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/best-ai-tools-for-students/',
    keywords: ['ai', 'students', 'study', 'research', 'writing'],
  },
  {
    id: 'best-free-image-tools-2026',
    name: 'Best Free Image Tools 2026',
    desc: 'The best free image editing and conversion tools available online in 2026.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/best-free-image-tools-2026/',
    keywords: ['image', 'free', 'edit', 'convert'],
  },
  {
    id: 'best-youtube-tools-for-creators',
    name: 'Best YouTube Tools for Creators',
    desc: 'Essential tools for YouTube creators to grow channels and edit videos.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/best-youtube-tools-for-creators/',
    keywords: ['youtube', 'creators', 'video', 'channel'],
  },
  {
    id: 'how-to-compress-images',
    name: 'How to Compress Images',
    desc: 'Learn how to compress images without losing quality using free online tools.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/how-to-compress-images/',
    keywords: ['compress', 'image', 'quality', 'optimize'],
  },
  {
    id: 'top-10-ai-tools-content-creators-2026',
    name: 'Top 10 AI Tools for Content Creators in 2026',
    desc: 'Discover the best AI-powered tools revolutionizing content creation in 2026.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/top-10-ai-tools-content-creators-2026/',
    keywords: ['ai', 'content', 'creators', 'tools'],
  },
  {
    id: 'how-to-optimize-images-for-web',
    name: 'How to Optimize Images for Web Performance',
    desc: 'Learn techniques to optimize images for faster website loading without sacrificing visual quality.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/how-to-optimize-images-for-web/',
    keywords: ['optimize', 'images', 'web', 'performance'],
  },
  {
    id: 'cricket-run-rate-beginners-guide',
    name: "Understanding Cricket Run Rate: A Beginner's Guide",
    desc: 'Learn what run rate means in cricket, how to calculate it, and why it matters for match strategy.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/cricket-run-rate-beginners-guide/',
    keywords: ['cricket', 'run rate', 'guide', 'calculator'],
  },
  {
    id: 'complete-guide-password-security',
    name: 'The Complete Guide to Password Security',
    desc: 'Everything you need to know about creating, managing, and storing secure passwords in 2026.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/complete-guide-password-security/',
    keywords: ['password', 'security', 'guide', 'generator'],
  },
  {
    id: 'qr-codes-marketing-best-practices',
    name: 'QR Codes in Marketing: Best Practices for 2026',
    desc: 'How to use QR codes effectively in your marketing campaigns with proven strategies and designs.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/qr-codes-marketing-best-practices/',
    keywords: ['qr codes', 'marketing', 'practices', 'generator'],
  },
  {
    id: 'hashtag-strategy-viral-growth',
    name: 'Hashtag Strategy for Viral Growth on Social Media',
    desc: 'Master the art of hashtag research and strategy to maximize reach and engagement on every platform.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/hashtag-strategy-viral-growth/',
    keywords: ['hashtag', 'strategy', 'social media', 'viral', 'growth'],
  },
  {
    id: 'image-compression-without-losing-quality',
    name: 'Image Compression Without Losing Quality: Complete Guide',
    desc: 'Learn how to dramatically reduce image file sizes while maintaining visual quality for web and print.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/image-compression-without-losing-quality/',
    keywords: ['image', 'compression', 'quality', 'compressor'],
  },
  {
    id: 'webp-vs-png-vs-jpg-which-format-wins',
    name: 'WebP vs PNG vs JPG: Which Image Format Wins in 2026?',
    desc: 'Compare the pros and cons of WebP, PNG, and JPG formats to choose the best one for any use case.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/webp-vs-png-vs-jpg-which-format-wins/',
    keywords: ['webp', 'png', 'jpg', 'format', 'compare'],
  },
  {
    id: 'age-calculator-fun-facts-birthday',
    name: 'Age Calculator: Fun Facts About Your Birthday You Never Knew',
    desc: 'Discover fascinating facts about your birth date, zodiac signs, historical events, and how old you really are.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/age-calculator-fun-facts-birthday/',
    keywords: ['age', 'birthday', 'facts', 'calculator'],
  },
  {
    id: 'how-to-resize-images-social-media',
    name: 'How to Resize Images for Social Media Platforms [2026 Guide]',
    desc: 'Perfect image sizes for Instagram, TikTok, YouTube, Twitter, LinkedIn, and Facebook.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/how-to-resize-images-social-media/',
    keywords: ['resize', 'images', 'social media', 'resizer'],
  },
];

/**
 * Builds the search items list from the official tool registry (src/data/tools.ts).
 * Resolves any retired slugs so no item links to a retired tool URL.
 */
export function buildSearchIndex(
  toolList: Tool[] = defaultTools,
  categoriesList: CategoryInfo[] = defaultCategories,
  includeExtras = true,
): SearchItem[] {
  const catTitleMap = new Map<string, string>();
  for (const c of categoriesList) {
    catTitleMap.set(c.id, c.title);
  }

  const toolItems: SearchItem[] = toolList.map((t) => {
    const slug = currentSlug(t.id);
    const catTitle = catTitleMap.get(t.category) || t.category;

    // Resolve URL to current slug if it referenced a retired one
    let cleanUrl = t.url;
    for (const [retired, replacement] of Object.entries(RETIRED_SLUGS)) {
      if (cleanUrl.includes(`/tools/${retired}/`)) {
        cleanUrl = cleanUrl.replace(`/tools/${retired}/`, `/tools/${replacement}/`);
      }
    }

    return {
      id: slug,
      name: t.name,
      desc: t.description,
      cat: catTitle.replace(/ Tools$/, ''),
      searchCat: catTitle,
      icon: t.icon,
      url: cleanUrl,
      keywords: Array.isArray(t.keywords) ? [...t.keywords] : [],
    };
  });

  return includeExtras ? [...toolItems, ...SEARCH_EXTRA_ITEMS] : toolItems;
}

/**
 * Filters the search index by query string and active category.
 * Matches case-insensitively against name, description, and keywords.
 */
export function filterSearchResults(
  query: string,
  activeCategory = 'All',
  items: SearchItem[] = buildSearchIndex(),
): SearchItem[] {
  let filtered = items;

  if (activeCategory && activeCategory.toLowerCase() !== 'all') {
    filtered = filtered.filter(
      (item) => item.searchCat.toLowerCase() === activeCategory.toLowerCase(),
    );
  }

  const q = query.toLowerCase().trim();
  if (!q) {
    return filtered;
  }

  return filtered.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(q);
    const descMatch = item.desc.toLowerCase().includes(q);
    const keywordMatch = item.keywords?.some((k) => k.toLowerCase().includes(q));
    return nameMatch || descMatch || keywordMatch;
  });
}
