/**
 * NumanX Tools Hub — Shared Image Format Engine Validation & Security
 * Provides strict format validation, MIME reconciliation, and SVG sanitization.
 */

import type { ImageFormat, TargetFormat, ValidationResult } from './types';

const FORMAT_MIME_MAP: Record<ImageFormat, string[]> = {
  jpeg: ['image/jpeg', 'image/jpg', 'image/pjpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  svg: ['image/svg+xml'],
};

const FORMAT_EXT_MAP: Record<ImageFormat, string[]> = {
  jpeg: ['.jpg', '.jpeg'],
  png: ['.png'],
  webp: ['.webp'],
  svg: ['.svg'],
};

const TARGET_MIME_MAP: Record<TargetFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

const TARGET_EXT_MAP: Record<TargetFormat, string> = {
  jpeg: '.jpg',
  png: '.png',
  webp: '.webp',
};

/**
 * Resolves the primary MIME type for a target format.
 */
export function getMimeForTarget(target: TargetFormat): string {
  return TARGET_MIME_MAP[target] || 'image/png';
}

/**
 * Resolves the primary extension for a target format.
 */
export function getExtensionForTarget(target: TargetFormat): string {
  return TARGET_EXT_MAP[target] || '.png';
}

/**
 * Sanitizes a filename to ensure it cannot break HTML markup, escape attribute quotes,
 * or cause directory traversal.
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return 'image';
  // Strip null bytes, control characters, and path separators
  let clean = filename
    .replace(/[\0-\x1F\x7F]/g, '')
    .replace(/[/\\]/g, '_')
    .replace(/["'<>`]/g, '')
    .trim();

  // Strip leading dots to prevent hidden files or traversal like ../
  clean = clean.replace(/^\.+/, '');

  // Truncate excessively long filenames to protect filesystem and DOM bounds
  if (clean.length > 200) {
    clean = clean.slice(0, 200);
  }

  return clean || 'image';
}

/**
 * Escapes HTML characters for safe attribute or text interpolation.
 */
export function escapeAttr(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Resolves the image format from a given MIME type or file extension.
 */
export function detectFormat(mimeType: string, filename = ''): ImageFormat | null {
  const normalizedMime = mimeType.toLowerCase().trim();
  const normalizedExt = filename.toLowerCase().trim().replace(/^.*(\.[^.]+)$/, '$1');

  for (const [format, mimes] of Object.entries(FORMAT_MIME_MAP) as [ImageFormat, string[]][]) {
    if (mimes.includes(normalizedMime)) {
      return format;
    }
  }

  // Fallback to extension if MIME is generic (e.g. application/octet-stream)
  if (normalizedExt) {
    for (const [format, exts] of Object.entries(FORMAT_EXT_MAP) as [ImageFormat, string[]][]) {
      if (exts.includes(normalizedExt)) {
        return format;
      }
    }
  }

  return null;
}

/**
 * Validates a file against allowed formats and size limits.
 */
export function validateImageFile(
  file: File | Blob,
  allowedFormats: ImageFormat[],
  maxBytes = 50 * 1024 * 1024,
  filenameOverride?: string,
): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes).' };
  }

  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return { valid: false, error: `File exceeds maximum allowed size of ${maxMb}MB.` };
  }

  const name = filenameOverride || ('name' in file ? (file as File).name : '');
  const detected = detectFormat(file.type, name);

  if (!detected || !allowedFormats.includes(detected)) {
    const allowedNames = allowedFormats.map((f) => f.toUpperCase()).join(', ');
    return {
      valid: false,
      error: `Unsupported format. Only ${allowedNames} files are accepted.`,
      format: detected || undefined,
    };
  }

  return {
    valid: true,
    format: detected,
    mimeType: file.type || getMimeForTarget(detected as TargetFormat),
  };
}

export interface SanitizedSvgResult {
  safeSvg: string;
  width?: number;
  height?: number;
}

/**
 * Strips active scripts, event handlers, and dangerous tags from SVG text.
 * Works in both browser DOM and Node/SSR environments.
 */
export function sanitizeSvg(rawSvg: string): SanitizedSvgResult {
  const trimmed = rawSvg.trim();
  if (!trimmed) {
    throw new Error('SVG input is empty.');
  }

  if (!trimmed.toLowerCase().includes('<svg')) {
    throw new Error('Invalid SVG: missing <svg> element.');
  }

  // Browser DOM environment
  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(trimmed, 'image/svg+xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`Malformed SVG syntax: ${parserError.textContent?.slice(0, 100) || 'Parse error'}`);
    }

    const svgEl = doc.documentElement;
    if (svgEl.tagName.toLowerCase() !== 'svg') {
      throw new Error('Invalid SVG root element.');
    }

    // Strip dangerous elements
    const dangerousTags = ['script', 'foreignobject', 'iframe', 'embed', 'object', 'applet', 'meta', 'link'];
    dangerousTags.forEach((tag) => {
      const els = doc.getElementsByTagName(tag);
      while (els.length > 0) {
        els[0].parentNode?.removeChild(els[0]);
      }
    });

    // Strip on* event handlers and javascript: URLs from all attributes
    const allEls = doc.getElementsByTagName('*');
    for (let i = 0; i < allEls.length; i++) {
      const el = allEls[i];
      const attrNames = el.getAttributeNames();
      for (const name of attrNames) {
        const val = el.getAttribute(name) || '';
        // Remove on* inline event handlers (onclick, onload, etc.)
        if (/^on/i.test(name)) {
          el.removeAttribute(name);
        }
        // Remove javascript: URLs or data:text/html
        else if (/(?:javascript:|data:\s*text\/html)/i.test(val)) {
          el.removeAttribute(name);
        }
      }
    }

    // Extract width and height if available
    let width: number | undefined;
    let height: number | undefined;

    const widthAttr = svgEl.getAttribute('width');
    const heightAttr = svgEl.getAttribute('height');
    const viewBoxAttr = svgEl.getAttribute('viewBox');

    if (widthAttr && !widthAttr.includes('%')) {
      const parsed = parseFloat(widthAttr);
      if (!isNaN(parsed) && parsed > 0) width = parsed;
    }
    if (heightAttr && !heightAttr.includes('%')) {
      const parsed = parseFloat(heightAttr);
      if (!isNaN(parsed) && parsed > 0) height = parsed;
    }

    if ((!width || !height) && viewBoxAttr) {
      const parts = viewBoxAttr.trim().split(/[\s,]+/).map(parseFloat);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        if (!width) width = parts[2];
        if (!height) height = parts[3];
      }
    }

    const serializer = new XMLSerializer();
    const safeSvg = serializer.serializeToString(doc);

    return { safeSvg, width, height };
  }

  // Regex fallback for environments without DOMParser (e.g. Node tests without JSDOM)
  let safeSvg = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<foreignobject\b[^<]*(?:(?!<\/foreignobject>)<[^<]*)*<\/foreignobject>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(?:href|xlink:href)\s*=\s*["']\s*(?:javascript:|data:\s*text\/html)[^"']*["']/gi, '');

  return { safeSvg };
}
