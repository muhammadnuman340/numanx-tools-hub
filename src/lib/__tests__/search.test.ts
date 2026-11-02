import { describe, it, expect } from 'vitest';
import { buildSearchIndex, filterSearchResults, SEARCH_EXTRA_ITEMS } from '../search';
import { RETIRED_SLUGS } from '../retiredSlugs';
import { tools } from '../../data/tools';

describe('search functionality', () => {
  const allItems = buildSearchIndex();

  it('a tool outside the old ~14 is found by name', () => {
    // The old searchData had only 11 tools + Dashboard + 4 blog posts.
    // 'Net Run Rate Calculator', 'AI Background Remover', 'Diff Checker', 'Base64 Tool' were not in it.
    const nrrResults = filterSearchResults('Net Run Rate');
    expect(nrrResults.some((item) => item.id === 'net-run-rate-calculator')).toBe(true);

    const bgResults = filterSearchResults('Background Remover');
    expect(bgResults.some((item) => item.id === 'ai-background-remover')).toBe(true);

    const diffResults = filterSearchResults('Diff Checker');
    expect(diffResults.some((item) => item.id === 'diff-checker')).toBe(true);
  });

  it('found by a keyword', () => {
    // 'rrr' is a keyword on run-rate-calculator
    const rrrResults = filterSearchResults('rrr');
    expect(rrrResults.some((item) => item.id === 'run-rate-calculator')).toBe(true);

    // 'vcard' is a keyword on qr-generator
    const vcardResults = filterSearchResults('vcard');
    expect(vcardResults.some((item) => item.id === 'qr-generator')).toBe(true);

    // 'guid' is a keyword on uuid-generator
    const guidResults = filterSearchResults('guid');
    expect(guidResults.some((item) => item.id === 'uuid-generator')).toBe(true);
  });

  it('case-insensitive match', () => {
    const upper = filterSearchResults('NET RUN RATE');
    const lower = filterSearchResults('net run rate');
    const mixed = filterSearchResults('nEt RuN rAtE');

    expect(upper.length).toBeGreaterThan(0);
    expect(upper.map((i) => i.url)).toEqual(lower.map((i) => i.url));
    expect(mixed.map((i) => i.url)).toEqual(lower.map((i) => i.url));
  });

  it('no result links to any retired slug', () => {
    const retiredKeys = Object.keys(RETIRED_SLUGS);

    // Check all items in the built search index
    for (const item of allItems) {
      for (const retired of retiredKeys) {
        expect(item.url).not.toContain(`/tools/${retired}/`);
      }
    }

    // Check results from queries that might mention old tool terms
    const queries = ['character counter', 'strike rate', 'target calculator', 'markdown to pdf', 'list randomizer'];
    for (const q of queries) {
      const results = filterSearchResults(q);
      for (const r of results) {
        for (const retired of retiredKeys) {
          expect(r.url).not.toContain(`/tools/${retired}/`);
        }
      }
    }
  });

  it('an empty query gives the existing default state', () => {
    const emptyResults = filterSearchResults('');
    expect(emptyResults.length).toBe(allItems.length);

    const whitespaceResults = filterSearchResults('   ');
    expect(whitespaceResults.length).toBe(allItems.length);

    // With category filter and empty query, returns all items in that category
    const cricketEmpty = filterSearchResults('', 'Cricket Tools');
    expect(cricketEmpty.length).toBeGreaterThan(0);
    expect(cricketEmpty.every((i) => i.searchCat === 'Cricket Tools')).toBe(true);

    // Blog category returns blog entries
    const blogEmpty = filterSearchResults('', 'Blog');
    expect(blogEmpty.length).toBe(4);
    expect(blogEmpty.every((i) => i.searchCat === 'Blog')).toBe(true);
  });

  it('every tool in tools.ts is present in the search index', () => {
    const toolIdsInIndex = new Set(allItems.map((i) => i.id).filter(Boolean));
    for (const tool of tools) {
      expect(toolIdsInIndex.has(tool.id)).toBe(true);
    }
    expect(tools.length).toBe(65);
  });
});
