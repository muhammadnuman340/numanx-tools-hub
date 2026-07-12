import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

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

      // GSAP class hooks
      expect(html).toContain('reveal-text');
      expect(html).toContain('reveal');

      // Vertical Glowing Timeline details
      expect(html).toContain('Phase 1 — Live');
      expect(html).toContain('Phase 2 — Next');
      expect(html).toContain('bg-emerald-400');
      expect(html).toContain('animate-pulse');

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
      expect(html).toContain('[24.8607° N, 67.0011° E]'); // Karachi GPS coordinates
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
    it('should satisfy spotlight banner, floating search, category pills, and 3D grid layout', () => {
      const html = readHtml('dist/blog/index.html');

      // Spotlight banner
      expect(html).toContain('card-spotlight');
      expect(html).toContain('Read Article');

      // Search components & KBD placeholder/hints
      expect(html).toContain('id="search-input"');
      expect(html).toContain('placeholder="Search articles..."');
      expect(html).toContain('id="search-clear"');
      expect(html).toContain('id="category-filters"');

      // Category pills
      expect(html).toContain('cat-btn');
      expect(html).toContain('bg-[#0a0a0c]/80');
      expect(html).toContain('text-zinc-400');

      // 3D Grid
      expect(html).toContain('id="cards-container-blog"');
      expect(html).toContain('preserve-3d');
      expect(html).toContain('post-card');

      // Script elements
      expect(html).toContain('cards-container-blog');
    });
  });

  // Tools Page assertions (13 assertions)
  describe('Tools Page (tools/index.astro)', () => {
    it('should satisfy tool cards, category control bar, search kbd hints, and glowing spheres', () => {
      const html = readHtml('dist/tools/index.html');

      // Grid container & 3D classes
      expect(html).toContain('id="cards-container-tools"');
      expect(html).toContain('tool-card');
      expect(html).toContain('card-spotlight');
      expect(html).toContain('preserve-3d');

      // Control panel & search hints
      expect(html).toContain('placeholder="Search tools..."');
      expect(html).toContain('CMD+K'); // KBD Hint
      expect(html).toContain('id="category-filters"');
      expect(html).toContain('category-btn');

      // Glowing Spheres replacing initials text placeholder
      expect(html).toContain('w-12 h-12');
      expect(html).toContain('bg-zinc-950');
      expect(html).toContain('bg-radial-gradient');

      // Script elements
      expect(html).toContain('cards-container-tools');
    });
  });

  // Chat Page assertions (13 assertions)
  describe('Chat Page (chat.astro)', () => {
    it('should satisfy premium chatbot UI, ambient glows, scanlines, and mock messages', () => {
      const html = readHtml('dist/chat/index.html');

      // Main layouts & flows
      expect(html).toContain('Neural');
      expect(html).toContain('Chat Interface');
      expect(html).toContain('id="cards-container-chat"');
      expect(html).toContain('card-spotlight');

      // Chat components & structures
      expect(html).toContain('id="chat-thread"');
      expect(html).toContain('id="chat-form"');
      expect(html).toContain('id="chat-input"');
      expect(html).toContain('id="btn-voice-chat"');
      expect(html).toContain('id="btn-clear-chat"');

      // Content structures & mock conversation
      expect(html).toContain('Jarvis Brain');
      expect(html).toContain('Online');
      expect(html).toContain('Welcome to NumanX AI Chat');

      // Ambient overlays and glows
      expect(html).toContain('blur-[120px]');
      expect(html).toContain('bg-[size:100%_4px,3px_100%]');

      // Script components
      expect(html).toContain('cards-container-chat');
    });
  });
});
