import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('AdSense Production Deactivation (Phase 5C.2D)', () => {
  const rootDir = path.resolve(__dirname, '../../..');

  it('confirms AdSense.astro and AdSlot.astro components are deleted', () => {
    const adSensePath = path.join(rootDir, 'src/components/AdSense.astro');
    const adSlotPath = path.join(rootDir, 'src/components/AdSlot.astro');

    expect(fs.existsSync(adSensePath)).toBe(false);
    expect(fs.existsSync(adSlotPath)).toBe(false);
  });

  it('confirms MainLayout.astro contains zero AdSense references or resource hints', () => {
    const layoutPath = path.join(rootDir, 'src/layouts/MainLayout.astro');
    const content = fs.readFileSync(layoutPath, 'utf8');

    expect(content).not.toContain('import AdSense');
    expect(content).not.toContain('<AdSense');
    expect(content).not.toContain('PUBLIC_ADSENSE_ID');
    expect(content).not.toContain('pagead2.googlesyndication.com');
  });

  it('confirms AdUnit.astro contains zero adsbygoogle or AdSense client scripts', () => {
    const adUnitPath = path.join(rootDir, 'src/components/AdUnit.astro');
    const content = fs.readFileSync(adUnitPath, 'utf8');

    expect(content).not.toContain('adsbygoogle');
    expect(content).not.toContain('PUBLIC_ADSENSE_ID');
    expect(content).not.toContain('ca-pub-');
    expect(content).toContain('MonetizationSlot');
  });

  it('confirms MonetizationSlot.astro contains zero adsbygoogle execution', () => {
    const slotPath = path.join(rootDir, 'src/components/MonetizationSlot.astro');
    const content = fs.readFileSync(slotPath, 'utf8');

    expect(content).not.toContain('adsbygoogle');
    expect(content).not.toContain('pagead2.googlesyndication.com');
  });

  it('confirms public/_headers CSP contains zero advertising-specific origins', () => {
    const headersPath = path.join(rootDir, 'public/_headers');
    const content = fs.readFileSync(headersPath, 'utf8');

    // Advertising origins removed
    expect(content).not.toContain('pagead2.googlesyndication.com');
    expect(content).not.toContain('googleads.g.doubleclick.net');

    // Required analytics origins preserved
    expect(content).toContain('https://www.googletagmanager.com');
    expect(content).toContain('https://www.google-analytics.com');
  });

  it('confirms env.d.ts contains zero PUBLIC_ADSENSE_ID type dependency', () => {
    const envPath = path.join(rootDir, 'src/env.d.ts');
    const content = fs.readFileSync(envPath, 'utf8');

    expect(content).not.toContain('PUBLIC_ADSENSE_ID');
  });
});
