import type { ToolCategory } from './tools';

/**
 * Card look per tool category, shared by every list of tools and posts (homepage, /tools/,
 * category pages, related tools, blog). The hue colours only the icon tile, top edge, tags and
 * links; card text stays neutral.
 */
export interface CategoryStyle {
  hue: number; // OKLCH hue
  icon: string; // ToolIcon name
  label: string; // short label for card footers
  short: string; // for "All 10 image tools"
}

export const CATEGORY_STYLE: Record<ToolCategory, CategoryStyle> = {
  'image-tools': { hue: 200, icon: 'image', label: 'Image', short: 'image' },
  'developer-tools': { hue: 255, icon: 'json', label: 'Developer', short: 'developer' },
  'cricket-tools': { hue: 145, icon: 'cricket', label: 'Cricket', short: 'cricket' },
  'utility-tools': { hue: 75, icon: 'utility', label: 'Utility', short: 'utility' },
  'creator-tools': { hue: 25, icon: 'creator', label: 'Creator', short: 'creator' },
  'ai-tools': { hue: 305, icon: 'bolt', label: 'Text & AI', short: 'text & AI' },
};

/** Hue for a free-text label such as a blog category ("Image Tools", "AI", "Cricket"). */
export function hueForLabel(label = ''): number {
  const l = label.toLowerCase();
  if (/image|photo|webp|png|jpg|compress/.test(l)) return CATEGORY_STYLE['image-tools'].hue;
  if (/cricket|sport/.test(l)) return CATEGORY_STYLE['cricket-tools'].hue;
  if (/develop|code|json|seo|web dev/.test(l)) return CATEGORY_STYLE['developer-tools'].hue;
  if (/\bai\b|writing|text|grammar/.test(l)) return CATEGORY_STYLE['ai-tools'].hue;
  if (/creator|youtube|social|hashtag|marketing|qr/.test(l)) return CATEGORY_STYLE['creator-tools'].hue;
  return CATEGORY_STYLE['utility-tools'].hue;
}
