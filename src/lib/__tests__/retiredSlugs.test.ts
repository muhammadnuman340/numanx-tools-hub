import { describe, it, expect, beforeEach } from 'vitest';

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, configurable: true });

import { RETIRED_SLUGS, currentSlug, mapSlugList, mapUsage, migrateStoredSlugs } from '../retiredSlugs';
import { getFavorites, getRecentlyUsed, getToolUsage } from '../storage';

const [oldSlug, newSlug] = Object.entries(RETIRED_SLUGS)[0];

describe('retiredSlugs', () => {
  beforeEach(() => localStorageMock.clear());

  it('maps every retired slug to a different, non-retired slug', () => {
    for (const [from, to] of Object.entries(RETIRED_SLUGS)) {
      expect(to).not.toBe(from);
      expect(RETIRED_SLUGS[to]).toBeUndefined();
    }
  });

  it('leaves current slugs alone', () => {
    expect(currentSlug('qr-generator')).toBe('qr-generator');
    expect(currentSlug(oldSlug)).toBe(newSlug);
  });

  it('maps lists without duplicates and keeps order', () => {
    expect(mapSlugList(['qr-generator', oldSlug, newSlug])).toEqual(['qr-generator', newSlug]);
    expect(mapSlugList('not a list')).toEqual([]);
  });

  it('adds usage counts when an old slug merges into a new one', () => {
    expect(mapUsage({ [oldSlug]: 2, [newSlug]: 3, 'qr-generator': 1 })).toEqual({ [newSlug]: 5, 'qr-generator': 1 });
  });

  it('rewrites saved favorites, recently used and usage counts', () => {
    localStorage.setItem('nt_favorites', JSON.stringify([oldSlug, 'qr-generator']));
    localStorage.setItem('nt_recently_used', JSON.stringify([oldSlug]));
    localStorage.setItem('nt_tool_usage', JSON.stringify({ [oldSlug]: 4 }));
    migrateStoredSlugs();
    expect(JSON.parse(localStorage.getItem('nt_favorites')!)).toEqual([newSlug, 'qr-generator']);
    expect(JSON.parse(localStorage.getItem('nt_recently_used')!)).toEqual([newSlug]);
    expect(JSON.parse(localStorage.getItem('nt_tool_usage')!)).toEqual({ [newSlug]: 4 });
  });

  it('ignores bad JSON', () => {
    localStorage.setItem('nt_favorites', '{oops');
    expect(() => migrateStoredSlugs()).not.toThrow();
  });

  it('storage helpers return current slugs on read', () => {
    localStorage.setItem('nt_favorites', JSON.stringify([oldSlug]));
    localStorage.setItem('nt_recently_used', JSON.stringify([oldSlug, newSlug]));
    localStorage.setItem('nt_tool_usage', JSON.stringify({ [oldSlug]: 1 }));
    expect(getFavorites()).toEqual([newSlug]);
    expect(getRecentlyUsed()).toEqual([newSlug]);
    expect(getToolUsage()).toEqual({ [newSlug]: 1 });
  });
});
