const FAVORITES_KEY = "nt_favorites";
const RECENTLY_USED_KEY = "nt_recently_used";
const SEARCH_HISTORY_KEY = "nt_search_history";
const TOOL_USAGE_KEY = "nt_tool_usage";

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(slug);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false;
  } else {
    favorites.push(slug);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function addRecentlyUsed(slug: string): void {
  try {
    let recent: string[] = JSON.parse(localStorage.getItem(RECENTLY_USED_KEY) || "[]");
    recent = recent.filter((id) => id !== slug);
    recent.unshift(slug);
    if (recent.length > 20) recent = recent.slice(0, 20);
    localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(recent));
  } catch {}
}

export function getRecentlyUsed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_USED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addSearchHistory(query: string): void {
  try {
    if (!query.trim()) return;
    let history: string[] = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
    history = history.filter((q) => q !== query);
    history.unshift(query);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function getSearchHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function trackToolUsage(slug: string): void {
  try {
    const usage: Record<string, number> = JSON.parse(localStorage.getItem(TOOL_USAGE_KEY) || "{}");
    usage[slug] = (usage[slug] || 0) + 1;
    localStorage.setItem(TOOL_USAGE_KEY, JSON.stringify(usage));
  } catch {}
}

export function getToolUsage(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(TOOL_USAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getMostUsedTools(limit = 5): string[] {
  const usage = getToolUsage();
  return Object.entries(usage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([slug]) => slug);
}
