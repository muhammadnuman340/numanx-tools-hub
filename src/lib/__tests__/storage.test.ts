import { describe, it, expect, beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

import {
  getFavorites,
  toggleFavorite,
  isFavorite,
  addRecentlyUsed,
  getRecentlyUsed,
  addSearchHistory,
  getSearchHistory,
  trackToolUsage,
  getToolUsage,
  getMostUsedTools,
} from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('favorites', () => {
    it('returns empty array initially', () => {
      expect(getFavorites()).toEqual([]);
    });

    it('toggles favorite on', () => {
      const result = toggleFavorite('qr-generator');
      expect(result).toBe(true);
      expect(getFavorites()).toEqual(['qr-generator']);
    });

    it('toggles favorite off', () => {
      toggleFavorite('qr-generator');
      const result = toggleFavorite('qr-generator');
      expect(result).toBe(false);
      expect(getFavorites()).toEqual([]);
    });

    it('isFavorite returns correct state', () => {
      expect(isFavorite('qr-generator')).toBe(false);
      toggleFavorite('qr-generator');
      expect(isFavorite('qr-generator')).toBe(true);
    });

    it('handles multiple favorites', () => {
      toggleFavorite('a');
      toggleFavorite('b');
      toggleFavorite('c');
      expect(getFavorites()).toEqual(['a', 'b', 'c']);
    });

    it('handles corrupted localStorage', () => {
      localStorage.setItem('nt_favorites', 'not-json');
      expect(getFavorites()).toEqual([]);
    });
  });

  describe('recently used', () => {
    it('returns empty array initially', () => {
      expect(getRecentlyUsed()).toEqual([]);
    });

    it('adds items in reverse chronological order', () => {
      addRecentlyUsed('a');
      addRecentlyUsed('b');
      addRecentlyUsed('c');
      expect(getRecentlyUsed()).toEqual(['c', 'b', 'a']);
    });

    it('deduplicates items', () => {
      addRecentlyUsed('a');
      addRecentlyUsed('b');
      addRecentlyUsed('a');
      expect(getRecentlyUsed()).toEqual(['a', 'b']);
    });

    it('limits to 20 items', () => {
      for (let i = 0; i < 25; i++) {
        addRecentlyUsed(`tool-${i}`);
      }
      expect(getRecentlyUsed().length).toBe(20);
    });
  });

  describe('search history', () => {
    it('returns empty array initially', () => {
      expect(getSearchHistory()).toEqual([]);
    });

    it('ignores empty queries', () => {
      addSearchHistory('');
      addSearchHistory('   ');
      expect(getSearchHistory()).toEqual([]);
    });

    it('adds queries in order', () => {
      addSearchHistory('qr');
      addSearchHistory('word');
      expect(getSearchHistory()).toEqual(['word', 'qr']);
    });

    it('limits to 10 items', () => {
      for (let i = 0; i < 15; i++) {
        addSearchHistory(`query-${i}`);
      }
      expect(getSearchHistory().length).toBe(10);
    });
  });

  describe('tool usage', () => {
    it('returns empty object initially', () => {
      expect(getToolUsage()).toEqual({});
    });

    it('tracks usage count', () => {
      trackToolUsage('qr-generator');
      trackToolUsage('qr-generator');
      trackToolUsage('word-counter');
      expect(getToolUsage()).toEqual({ 'qr-generator': 2, 'word-counter': 1 });
    });

    it('getMostUsedTools returns sorted slugs', () => {
      trackToolUsage('c');
      trackToolUsage('a');
      trackToolUsage('a');
      trackToolUsage('b');
      trackToolUsage('b');
      trackToolUsage('b');
      const top = getMostUsedTools(2);
      expect(top).toEqual(['b', 'a']);
    });
  });
});
