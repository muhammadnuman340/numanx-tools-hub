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
    name: 'Platform Dashboard',
    desc: 'Track live tool compilations, metrics, milestones, and development roadmap.',
    cat: 'Utility',
    searchCat: 'Utility Tools',
    icon: 'utility',
    url: '/dashboard/',
    keywords: ['dashboard', 'metrics', 'platform'],
  },
  {
    name: 'Best AI Tools for Students',
    desc: 'Top AI tools every student should use in 2026 for studying, writing, and research.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/best-ai-tools-for-students/',
    keywords: ['ai', 'students', 'study', 'research', 'writing'],
  },
  {
    name: 'Best Free Image Tools 2026',
    desc: 'The best free image editing and conversion tools available online in 2026.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/best-free-image-tools-2026/',
    keywords: ['image', 'free', 'edit', 'convert'],
  },
  {
    name: 'Best YouTube Tools for Creators',
    desc: 'Essential tools for YouTube creators to grow channels and edit videos.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/best-youtube-tools-for-creators/',
    keywords: ['youtube', 'creators', 'video', 'channel'],
  },
  {
    name: 'How to Compress Images',
    desc: 'Learn how to compress images without losing quality using free online tools.',
    cat: 'Blog',
    searchCat: 'Blog',
    icon: 'creator',
    url: '/blog/how-to-compress-images/',
    keywords: ['compress', 'image', 'quality', 'optimize'],
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

  if (activeCategory && activeCategory !== 'All') {
    filtered = filtered.filter((item) => item.searchCat === activeCategory);
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
