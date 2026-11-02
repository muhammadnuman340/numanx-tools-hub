/**
 * Tools that were merged into another tool. Favorites, recently used and usage
 * counts saved under an old slug are mapped to the tool that replaced it, so
 * visitors keep their saved items. The old URLs 301 in public/_redirects.
 */
export const RETIRED_SLUGS: Record<string, string> = {
  'strike-rate-calculator': 'strike-rate-average-calculator',
  'character-counter': 'word-counter',
  'cricket-target-calculator': 'run-rate-calculator',
  'markdown-to-pdf': 'markdown-editor',
};

export function currentSlug(slug: string): string {
  return RETIRED_SLUGS[slug] ?? slug;
}

/** Maps old slugs to their replacements, keeping order and dropping duplicates. */
export function mapSlugList(slugs: unknown): string[] {
  if (!Array.isArray(slugs)) return [];
  const out: string[] = [];
  for (const s of slugs) {
    if (typeof s !== 'string') continue;
    const slug = currentSlug(s);
    if (!out.includes(slug)) out.push(slug);
  }
  return out;
}

/** Maps usage counts to current slugs, adding counts when two slugs merge. */
export function mapUsage(usage: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!usage || typeof usage !== 'object' || Array.isArray(usage)) return out;
  for (const [s, n] of Object.entries(usage as Record<string, unknown>)) {
    if (typeof n !== 'number') continue;
    const slug = currentSlug(s);
    out[slug] = (out[slug] || 0) + n;
  }
  return out;
}

/** Rewrites saved favorites, recently used and usage counts that still hold old slugs. */
export function migrateStoredSlugs(): void {
  try {
    for (const key of ['nt_favorites', 'nt_recently_used']) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const list = JSON.parse(raw);
      if (!Array.isArray(list) || !list.some((s) => typeof s === 'string' && s in RETIRED_SLUGS)) continue;
      localStorage.setItem(key, JSON.stringify(mapSlugList(list)));
    }
    const rawUsage = localStorage.getItem('nt_tool_usage');
    if (rawUsage) {
      const usage = JSON.parse(rawUsage);
      if (usage && typeof usage === 'object' && Object.keys(usage).some((s) => s in RETIRED_SLUGS)) {
        localStorage.setItem('nt_tool_usage', JSON.stringify(mapUsage(usage)));
      }
    }
  } catch {
    // Storage blocked or holds bad JSON: nothing to migrate
  }
}
