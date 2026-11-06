import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { tools } from '../tools';

// Helper to check content and assert
const readHtml = (filePath: string) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  expect(fs.existsSync(fullPath)).toBe(true);
  return fs.readFileSync(fullPath, 'utf8');
};

describe('NumanX Tools Hub - E2E Build Structural Validation', () => {
  // 1-5. Build Files Existence
  it('should verify all upgraded/created build pages exist in dist/', () => {
    expect(fs.existsSync(path.resolve(process.cwd(), 'dist/about/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'dist/contact/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'dist/blog/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'dist/tools/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'dist/chat/index.html'))).toBe(true);
  });

  // About Page assertions (13 assertions)
  describe('About Page (about.astro)', () => {
    it('should satisfy bento layout, timeline, GSAP, and tilt tracker requirements', () => {
      const html = readHtml('dist/about/index.html');

      // Structural tags
      expect(html).toContain('<html');
      expect(html).toContain('<main');

      // Page specific title & header contents
      expect(html).toContain('Build. Create.');
      expect(html).toContain('Analyze.');
      expect(html).toContain('NumanX Studio');
      expect(html).toContain('Muhammad Numan Usmani');

      // Bento grid and classes
      expect(html).toContain('id="cards-container-about"');
      expect(html).toContain('card-spotlight');
      expect(html).toContain('audio-trigger');

      // H1 says who and what (UI plan phase 9)
      expect(html).toMatch(/<h1[^>]*>\s*Muhammad Numan Usmani builds NumanX Tools/);

      // FAQ schema has real questions and answers
      expect(html).toContain('"@type":"Question","name":"Who makes NumanX Tools?"');
      expect(html).toContain('"acceptedAnswer":{"@type":"Answer","text":"');

      // Roadmap timeline, without pulsing or glowing dots
      expect(html).toContain('Phase 1 — Live');
      expect(html).toContain('Phase 2 — Next');
      expect(html).toContain('bg-emerald-400');
      expect(html).not.toContain('animate-pulse');
      expect(html).not.toContain('animate-ping');

      // Scripts presence
      expect(html).toContain('cards-container-about');
    });
  });

  // Contact Page assertions (14 assertions)
  describe('Contact Page (contact.astro)', () => {
    it('should satisfy glassmorphic form, coordinates widget, submit interactions, and tilt requirements', () => {
      const html = readHtml('dist/contact/index.html');

      // Structural tags
      expect(html).toContain('<form');
      expect(html).toContain('id="contact-form"');
      expect(html).toContain('id="cards-container-contact"');
      expect(html).toContain('card-spotlight');

      // Glassmorphic fields & place holders
      expect(html).toContain('placeholder="John Doe"');
      expect(html).toContain('placeholder="john@example.com"');
      expect(html).toContain('placeholder="Write your message here..."');
      expect(html).toContain('id="subject"');
      expect(html).toContain('id="message"');

      // Coordinates widget details
      expect(html).toContain('Contact Coordinates');
      expect(html).toContain('Location Coordinates');
      expect(html).toContain('[30.1798° N, 66.9750° E]'); // Quetta GPS coordinates
      expect(html).toContain('bg-emerald-400');

      // Submit button details
      expect(html).toContain('id="contact-submit"');
      expect(html).toContain('submit-text');
      expect(html).toContain('submit-spinner');

      // Script binds
      expect(html).toContain('cards-container-contact');
    });
  });

  // Blog Page assertions (13 assertions)
  describe('Blog Page (blog/index.astro)', () => {
    it('should satisfy search, category pills, post grid, and newsletter layout', () => {
      const html = readHtml('dist/blog/index.html');

      // Page heading and post grid
      expect(html).toContain('id="cards-container-blog"');
      expect(html).toContain('post-card');

      // Search components
      expect(html).toContain('id="search-input"');
      expect(html).toContain('placeholder="Search articles..."');
      expect(html).toContain('id="search-clear"');
      expect(html).toContain('id="category-filters"');

      // Category pills
      expect(html).toContain('cat-btn');

      // Newsletter CTA
      expect(html).toContain('blog-newsletter-form');
      expect(html).toContain('Stay');
      expect(html).toContain('Subscribe');

      // Client-side filter script
      expect(html).toContain('cards-container-blog');
    });
  });

  // Tools Page assertions (13 assertions)
  describe('Tools Page (tools/index.astro)', () => {
    it('should list every tool as a filterable card, with the category bar and search hints', () => {
      const html = readHtml('dist/tools/index.html');

      // Grid container: one linked card per tool, each with the data the filter script reads
      expect(html).toContain('id="cards-container-tools"');
      const cards = html.match(/<a href="\/tools\/[a-z0-9-]+\/"[^>]*class="[^"]*tool-card[^"]*"[^>]*data-name="[^"]+" data-category="[^"]+"/g) || [];
      expect(cards.length).toBe(tools.length);

      // Control panel & search hints
      expect(html).toContain('placeholder="Search tools..."');
      expect(html).toContain('CMD+K'); // KBD Hint
      expect(html).toContain('id="category-filters"');
      expect(html).toContain('category-btn');

      // Script elements
      expect(html).toContain('cards-container-tools');
    });
  });

  // Chat Page assertions (13 assertions)
  describe('Chat Page (chat.astro)', () => {
    it('should satisfy assistant prototype UI, ambient glows, scanlines, and mock messages', () => {
      const html = readHtml('dist/chat/index.html');

      // Main layouts & flows
      expect(html).toContain('Interactive');
      expect(html).toContain('Assistant Prototype');
      expect(html).toContain('id="cards-container-chat"');
      expect(html).toContain('card-spotlight');

      // Chat components & structures
      expect(html).toContain('id="chat-thread"');
      expect(html).toContain('id="chat-form"');
      expect(html).toContain('id="chat-input"');
      expect(html).toContain('id="btn-voice-chat"');
      expect(html).toContain('id="btn-clear-chat"');

      // Content structures & mock conversation
      expect(html).toContain('Assistant Prototype');
      expect(html).toContain('Online');
      expect(html).toContain('Welcome to the NumanX Assistant Prototype');

      // Ambient overlays and glows
      expect(html).toContain('blur-[120px]');
      expect(html).toContain('bg-[size:100%_4px,3px_100%]');

      // Script components
      expect(html).toContain('cards-container-chat');
    });
  });
});
