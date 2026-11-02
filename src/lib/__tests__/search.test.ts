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

    // Blog category returns blog entries (14 blog posts)
    const blogEmpty = filterSearchResults('', 'Blog');
    expect(blogEmpty.length).toBe(14);
    expect(blogEmpty.every((i) => i.searchCat === 'Blog')).toBe(true);

    // Case-insensitive category matching ('all' vs 'All')
    const allLower = filterSearchResults('', 'all');
    expect(allLower.length).toBe(allItems.length);
  });

  it('searching by tool description', () => {
    // "syntax highlighting" appears in JSON, HTML, CSS formatter descriptions
    const descResults = filterSearchResults('syntax highlighting');
    expect(descResults.length).toBeGreaterThan(0);
    expect(descResults.some((i) => i.id === 'json-formatter')).toBe(true);

    // "par scores" appears in DLS calculator description
    const cricketDesc = filterSearchResults('par scores');
    expect(cricketDesc.length).toBeGreaterThan(0);
    expect(cricketDesc.some((i) => i.searchCat === 'Cricket Tools')).toBe(true);
  });

  it('empty search results for non-matching queries', () => {
    // "zakat" has no matching tool or blog
    const zakatResults = filterSearchResults('zakat');
    expect(zakatResults).toEqual([]);

    // random gibberish
    const gibberishResults = filterSearchResults('xyznonexistentquery123');
    expect(gibberishResults).toEqual([]);
  });

  it('no duplicate results in search index', () => {
    const urls = allItems.map((i) => i.url);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);

    const ids = allItems.map((i) => i.id).filter(Boolean);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all 65 tools appear in the searchable dataset', () => {
    expect(tools.length).toBe(65);
    const toolIdsInIndex = new Set(allItems.map((i) => i.id).filter(Boolean));
    for (const tool of tools) {
      expect(toolIdsInIndex.has(tool.id)).toBe(true);
    }

    // Verify every tool has name, url, description, and valid category
    const toolItems = allItems.filter((i) => i.url.startsWith('/tools/'));
    expect(toolItems.length).toBe(65);
    for (const item of toolItems) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.desc.length).toBeGreaterThan(0);
      expect(item.url).toMatch(/^\/tools\/[a-z0-9-]+\/$/);
      expect(item.searchCat.length).toBeGreaterThan(0);
    }
  });

  it('preserves non-tool entries (Dashboard and all 14 blog posts)', () => {
    const dashboard = allItems.find((i) => i.id === 'dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard?.url).toBe('/dashboard/');

    const blogItems = allItems.filter((i) => i.searchCat === 'Blog');
    expect(blogItems.length).toBe(14);
    for (const blog of blogItems) {
      expect(blog.url).toMatch(/^\/blog\/[a-z0-9-]+\/$/);
    }
  });
});
