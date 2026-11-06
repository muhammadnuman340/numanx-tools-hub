import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  detectFormat,
  sanitizeSvg,
  getMimeForTarget,
  getExtensionForTarget,
  sanitizeFilename,
  escapeAttr,
} from '../validation';
import {
  formatBytes,
  calculateSavings,
  getOutputFilename,
} from '../engine';

describe('Shared Image Format Engine — Validation & Helpers', () => {
  describe('detectFormat', () => {
    it('detects JPEG from MIME types', () => {
      expect(detectFormat('image/jpeg')).toBe('jpeg');
      expect(detectFormat('image/jpg')).toBe('jpeg');
      expect(detectFormat('image/pjpeg')).toBe('jpeg');
    });

    it('detects PNG from MIME types', () => {
      expect(detectFormat('image/png')).toBe('png');
    });

    it('detects WebP from MIME types', () => {
      expect(detectFormat('image/webp')).toBe('webp');
    });

    it('detects SVG from MIME types', () => {
      expect(detectFormat('image/svg+xml')).toBe('svg');
    });

    it('falls back to file extension when MIME is generic', () => {
      expect(detectFormat('application/octet-stream', 'photo.jpg')).toBe('jpeg');
      expect(detectFormat('application/octet-stream', 'icon.png')).toBe('png');
      expect(detectFormat('binary/octet-stream', 'graphic.webp')).toBe('webp');
      expect(detectFormat('', 'vector.svg')).toBe('svg');
    });

    it('returns null for unsupported formats', () => {
      expect(detectFormat('image/gif', 'animation.gif')).toBeNull();
      expect(detectFormat('application/pdf', 'doc.pdf')).toBeNull();
      expect(detectFormat('text/plain', 'notes.txt')).toBeNull();
    });
  });

  describe('validateImageFile', () => {
    it('rejects empty files (0 bytes)', () => {
      const file = new File([], 'empty.png', { type: 'image/png' });
      const result = validateImageFile(file, ['png']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('rejects files exceeding max size', () => {
      const largeContent = new Uint8Array(1024 * 1024);
      const file = new File([largeContent], 'large.png', { type: 'image/png' });
      const result = validateImageFile(file, ['png'], 500 * 1024); // max 500KB
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });

    it('accepts valid files within allowed formats', () => {
      const content = new Uint8Array([1, 2, 3, 4]);
      const file = new File([content], 'sample.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file, ['jpeg']);
      expect(result.valid).toBe(true);
      expect(result.format).toBe('jpeg');
      expect(result.mimeType).toBe('image/jpeg');
    });

    it('rejects files outside allowed formats', () => {
      const content = new Uint8Array([1, 2, 3]);
      const file = new File([content], 'sample.png', { type: 'image/png' });
      const result = validateImageFile(file, ['jpeg']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported format');
    });
  });

  describe('sanitizeSvg', () => {
    it('removes script tags from SVG', () => {
      const malicious = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script><circle cx="5" cy="5" r="5"/></svg>';
      const { safeSvg } = sanitizeSvg(malicious);
      expect(safeSvg).not.toContain('<script');
      expect(safeSvg).not.toContain('alert');
      expect(safeSvg).toContain('<circle');
    });

    it('removes inline event handlers like onload or onclick', () => {
      const malicious = '<svg xmlns="http://www.w3.org/2000/svg" onload="fetch(\'/steal\')"><rect width="10" height="10" onclick="evil()"/></svg>';
      const { safeSvg } = sanitizeSvg(malicious);
      expect(safeSvg).not.toContain('onload');
      expect(safeSvg).not.toContain('onclick');
      expect(safeSvg).not.toContain('fetch');
    });

    it('removes javascript: links', () => {
      const malicious = '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><text>Click</text></a></svg>';
      const { safeSvg } = sanitizeSvg(malicious);
      expect(safeSvg).not.toContain('javascript:');
    });

    it('throws on non-SVG content or empty text', () => {
      expect(() => sanitizeSvg('')).toThrow('SVG input is empty');
      expect(() => sanitizeSvg('<div>not an svg</div>')).toThrow('missing <svg> element');
    });
  });

  describe('formatBytes', () => {
    it('formats bytes, kilobytes, and megabytes correctly', () => {
      expect(formatBytes(500)).toBe('500 B');
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(2048)).toBe('2.0 KB');
      expect(formatBytes(1048576)).toBe('1.0 MB');
      expect(formatBytes(2621440)).toBe('2.5 MB');
    });
  });

  describe('calculateSavings', () => {
    it('calculates size reductions correctly', () => {
      const savings = calculateSavings(1000, 400);
      expect(savings.isReduction).toBe(true);
      expect(savings.percent).toBe(60);
    });

    it('identifies increases when converted file is larger', () => {
      const savings = calculateSavings(500, 1000);
      expect(savings.isReduction).toBe(false);
      expect(savings.percent).toBe(100);
    });
  });

  describe('getOutputFilename', () => {
    it('generates correct extension for each target format', () => {
      expect(getOutputFilename('banner.jpg', 'png')).toBe('banner.png');
      expect(getOutputFilename('photo.jpeg', 'webp')).toBe('photo.webp');
      expect(getOutputFilename('graphic.png', 'jpeg')).toBe('graphic.jpg');
      expect(getOutputFilename('vector.svg', 'png')).toBe('vector.png');
      expect(getOutputFilename('image', 'webp')).toBe('image.webp');
    });

    it('neutralizes quote breakout and attribute injection attempts', () => {
      const malicious = 'photo" download="malicious.exe';
      const output = getOutputFilename(malicious, 'png');
      expect(output).not.toContain('"');
      expect(output).toBe('photo download=malicious.png');
    });

    it('neutralizes script tags and HTML markup in original filenames', () => {
      const malicious = '<img src=x onerror=alert(1)>.jpg';
      const output = getOutputFilename(malicious, 'webp');
      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
      expect(output).toBe('img src=x onerror=alert(1).webp');
    });

    it('neutralizes path traversal attempts in original filenames', () => {
      const malicious = '../../etc/passwd.png';
      const output = getOutputFilename(malicious, 'jpeg');
      expect(output).not.toContain('../');
      expect(output).not.toContain('..\\');
      expect(output).toBe('_.._etc_passwd.jpg');
    });

    it('preserves non-Latin and Unicode filenames', () => {
      expect(getOutputFilename('日本語写真.jpg', 'png')).toBe('日本語写真.png');
      expect(getOutputFilename('صورة_جميلة.png', 'webp')).toBe('صورة_جميلة.webp');
      expect(getOutputFilename('résumé-photo.jpeg', 'png')).toBe('résumé-photo.png');
      expect(getOutputFilename('icon🎨.svg', 'png')).toBe('icon🎨.png');
    });

    it('safely truncates excessively long filenames', () => {
      const veryLong = 'a'.repeat(300) + '.png';
      const output = getOutputFilename(veryLong, 'webp');
      expect(output.length).toBeLessThanOrEqual(130);
      expect(output.endsWith('.webp')).toBe(true);
    });

    it('protects Windows reserved system filenames', () => {
      expect(getOutputFilename('con.png', 'jpeg')).toBe('con_converted.jpg');
      expect(getOutputFilename('PRN.jpg', 'png')).toBe('PRN_converted.png');
      expect(getOutputFilename('nul.webp', 'jpeg')).toBe('nul_converted.jpg');
    });
  });

  describe('sanitizeFilename', () => {
    it('strips quotes, angle brackets, and backticks', () => {
      expect(sanitizeFilename('my"file\'name<test>`safe.png')).toBe('myfilename_testsafe.png'.replace('_', ''));
    });

    it('strips directory separators', () => {
      expect(sanitizeFilename('path/to\\file.jpg')).toBe('path_to_file.jpg');
    });

    it('strips null bytes and control characters', () => {
      expect(sanitizeFilename('test\0file\x1bname.png')).toBe('testfilename.png');
    });

    it('preserves ampersands in filename but escapes them via escapeAttr', () => {
      const filename = sanitizeFilename('Tom & Jerry.png');
      expect(filename).toBe('Tom & Jerry.png');
      expect(escapeAttr(filename)).toBe('Tom &amp; Jerry.png');
    });

    it('defaults to image when given empty or only invalid characters', () => {
      expect(sanitizeFilename('"""')).toBe('image');
      expect(sanitizeFilename('   ')).toBe('image');
      expect(sanitizeFilename('')).toBe('image');
    });
  });

  describe('escapeAttr', () => {
    it('escapes characters that can break attribute boundaries', () => {
      expect(escapeAttr('hello" world')).toBe('hello&quot; world');
      expect(escapeAttr("it's cool")).toBe('it&#039;s cool');
      expect(escapeAttr('<tag> & "more"')).toBe('&lt;tag&gt; &amp; &quot;more&quot;');
    });

    it('handles non-string inputs safely', () => {
      expect(escapeAttr(null as unknown as string)).toBe('');
      expect(escapeAttr(undefined as unknown as string)).toBe('');
    });
  });

  describe('MIME and Extension helpers', () => {
    it('resolves correct MIME types', () => {
      expect(getMimeForTarget('jpeg')).toBe('image/jpeg');
      expect(getMimeForTarget('png')).toBe('image/png');
      expect(getMimeForTarget('webp')).toBe('image/webp');
    });

    it('resolves correct file extensions', () => {
      expect(getExtensionForTarget('jpeg')).toBe('.jpg');
      expect(getExtensionForTarget('png')).toBe('.png');
      expect(getExtensionForTarget('webp')).toBe('.webp');
    });
  });
});
