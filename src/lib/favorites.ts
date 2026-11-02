import { tools as defaultTools, categories as defaultCategories, type Tool } from '../data/tools';
import { mapSlugList } from './retiredSlugs';
import { getFavorites } from './storage';

export interface FavoriteToolItem {
  id: string;
  name: string;
  desc: string;
  cat: string;
  icon: string;
  url: string;
}

/**
 * Resolves favorite slugs into validated, deduplicated Tool items
 * mapped against the official tools registry (src/data/tools.ts) and retiredSlugs.
 *
 * @param storedInput Optional raw storage string (JSON), parsed array, or undefined to read from storage.
 * @param toolList Tool registry to resolve against (defaults to all tools).
 */
export function resolveFavoriteTools(
  storedInput?: unknown,
  toolList: Tool[] = defaultTools,
): FavoriteToolItem[] {
  let rawSlugs: unknown = storedInput;

  if (rawSlugs === undefined) {
    try {
      rawSlugs = getFavorites();
    } catch {
      return [];
    }
  } else if (typeof rawSlugs === 'string') {
    try {
      rawSlugs = JSON.parse(rawSlugs);
    } catch {
      return [];
    }
  }

  const validSlugs = mapSlugList(rawSlugs);
  if (validSlugs.length === 0) return [];

  const toolMap = new Map<string, Tool>();
  for (const t of toolList) {
    toolMap.set(t.id, t);
  }

  const categoryTitleMap = new Map<string, string>();
  for (const c of defaultCategories) {
    categoryTitleMap.set(c.id, c.title);
  }

  const result: FavoriteToolItem[] = [];
  for (const slug of validSlugs) {
    const tool = toolMap.get(slug);
    if (!tool) {
      // Unknown or removed slug: skip safely, no crash, no blank card
      continue;
    }
    result.push({
      id: tool.id,
      name: tool.name,
      desc: tool.description,
      cat: categoryTitleMap.get(tool.category) || tool.category,
      icon: tool.icon,
      url: tool.url,
    });
  }

  return result;
}
