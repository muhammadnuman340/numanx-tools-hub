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

import { resolveFavoriteTools } from '../favorites';
import { tools } from '../../data/tools';

describe('favorites resolution logic', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('a favorite for a tool that was NOT in the old 14 appears', () => {
    // Old 14 list: qr-generator, word-counter, age-calculator, password-generator,
    // hashtag-generator, run-rate-calculator, strike-rate-average-calculator, jpg-to-png,
    // image-compressor, png-to-webp, image-resizer, unit-converter, markdown-editor, json-formatter.
    // 'ai-background-remover' and 'cricket-over-calculator' were NOT in the old 14.
    const resolvedDirect = resolveFavoriteTools(['ai-background-remover']);
    expect(resolvedDirect).toHaveLength(1);
    expect(resolvedDirect[0].id).toBe('ai-background-remover');
    expect(resolvedDirect[0].name).toBe('AI Background Remover');
    expect(resolvedDirect[0].url).toBe('/tools/ai-background-remover/');

    // Also verify resolution when reading from localStorage
    localStorage.setItem('nt_favorites', JSON.stringify(['cricket-over-calculator']));
    const resolvedFromStorage = resolveFavoriteTools();
    expect(resolvedFromStorage).toHaveLength(1);
    expect(resolvedFromStorage[0].id).toBe('cricket-over-calculator');
    expect(resolvedFromStorage[0].cat).toBe('Cricket Tools');
  });

  it('a retired slug maps to its new tool', () => {
    // character-counter was retired and merged into word-counter
    const fromCharacterCounter = resolveFavoriteTools(['character-counter']);
    expect(fromCharacterCounter).toHaveLength(1);
    expect(fromCharacterCounter[0].id).toBe('word-counter');
    expect(fromCharacterCounter[0].name).toBe('Word & Character Counter');

    // strike-rate-calculator was retired and merged into strike-rate-average-calculator
    const fromStrikeRate = resolveFavoriteTools(['strike-rate-calculator']);
    expect(fromStrikeRate).toHaveLength(1);
    expect(fromStrikeRate[0].id).toBe('strike-rate-average-calculator');

    // cricket-target-calculator was retired and merged into run-rate-calculator
    const fromTarget = resolveFavoriteTools(['cricket-target-calculator']);
    expect(fromTarget).toHaveLength(1);
    expect(fromTarget[0].id).toBe('run-rate-calculator');

    // list-randomizer was retired and merged into random-number-generator
    const fromList = resolveFavoriteTools(['list-randomizer']);
    expect(fromList).toHaveLength(1);
    expect(fromList[0].id).toBe('random-number-generator');

    // markdown-to-pdf was retired and merged into markdown-editor
    const fromMd = resolveFavoriteTools(['markdown-to-pdf']);
    expect(fromMd).toHaveLength(1);
    expect(fromMd[0].id).toBe('markdown-editor');
  });

  it('unknown slug is ignored', () => {
    // Single unknown slug returns empty list
    expect(resolveFavoriteTools(['totally-unknown-tool-slug'])).toEqual([]);

    // Unknown slug mixed with valid tool only includes the valid tool
    const mixed = resolveFavoriteTools(['unknown-slug-1', 'qr-generator', 'unknown-slug-2']);
    expect(mixed).toHaveLength(1);
    expect(mixed[0].id).toBe('qr-generator');
  });

  it('duplicates collapse to one', () => {
    // Direct duplicates
    const directDupes = resolveFavoriteTools(['qr-generator', 'qr-generator', 'qr-generator']);
    expect(directDupes).toHaveLength(1);
    expect(directDupes[0].id).toBe('qr-generator');

    // Duplicates created via retired slug mapping (e.g. character-counter and word-counter)
    const retiredDupes = resolveFavoriteTools(['character-counter', 'word-counter']);
    expect(retiredDupes).toHaveLength(1);
    expect(retiredDupes[0].id).toBe('word-counter');
  });

  it('empty storage gives the empty state', () => {
    // Calling with empty array
    expect(resolveFavoriteTools([])).toEqual([]);

    // Calling with undefined when localStorage is empty
    expect(resolveFavoriteTools()).toEqual([]);

    // Calling with empty string
    expect(resolveFavoriteTools('')).toEqual([]);

    // Calling with null or non-array
    expect(resolveFavoriteTools(null)).toEqual([]);
    expect(resolveFavoriteTools({})).toEqual([]);
  });

  it('corrupted storage value (invalid JSON) gives the empty state, no crash', () => {
    // Corrupted string passed directly
    expect(() => resolveFavoriteTools('{bad-json:')).not.toThrow();
    expect(resolveFavoriteTools('{bad-json:')).toEqual([]);

    // Corrupted string in localStorage
    localStorage.setItem('nt_favorites', 'not-valid-json-content{{{');
    expect(() => resolveFavoriteTools()).not.toThrow();
    expect(resolveFavoriteTools()).toEqual([]);

    localStorage.setItem('nt_favorites', '{ "broken": true }');
    expect(resolveFavoriteTools()).toEqual([]);
  });
});
