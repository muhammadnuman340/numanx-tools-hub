import { describe, it, expect } from 'vitest';
import {
  tools,
  categories,
  getToolBySlug,
  getToolsByCategory,
  getCategoryInfo,
  getNewTools,
  getPopularTools,
  getFeaturedTools,
} from '../tools';

describe('tools data', () => {
  it('has at least 20 tools', () => {
    expect(tools.length).toBeGreaterThanOrEqual(20);
  });

  it('every tool has required fields', () => {
    for (const t of tools) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.icon).toBeTruthy();
      expect(t.url).toMatch(/^\/tools\//);
      expect(Array.isArray(t.keywords)).toBe(true);
      expect(Array.isArray(t.relatedIds)).toBe(true);
    }
  });

  it('all relatedIds point to valid tools', () => {
    for (const t of tools) {
      for (const rid of t.relatedIds) {
        expect(getToolBySlug(rid)).toBeDefined();
      }
    }
  });

  it('all categories have correct counts', () => {
    for (const cat of categories) {
      const categoryTools = getToolsByCategory(cat.id);
      expect(categoryTools.length).toBe(cat.count);
    }
  });

  it('getToolBySlug returns correct tool', () => {
    const t = getToolBySlug('qr-generator');
    expect(t).toBeDefined();
    expect(t!.name).toBe('QR Generator');
  });

  it('getNewTools returns only isNew tools', () => {
    const newTools = getNewTools(10);
    expect(newTools.every((t) => t.isNew)).toBe(true);
  });

  it('getCategoryInfo returns correct info', () => {
    const info = getCategoryInfo('utility-tools');
    expect(info).toBeDefined();
    expect(info!.title).toBe('Utility Tools');
  });
});
