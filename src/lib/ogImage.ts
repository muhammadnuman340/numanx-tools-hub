export const SITE_URL = 'https://toolshub.numanxstudio.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default-1200.png`;

/**
 * First usable share image as an absolute URL, or undefined.
 * Social sites need absolute URLs and don't show SVG previews, so SVGs are skipped.
 */
export function usableOgImage(...candidates: Array<string | null | undefined>): string | undefined {
  for (const c of candidates) {
    if (c && !/\.svg([?#]|$)/i.test(c)) return new URL(c, SITE_URL).href;
  }
  return undefined;
}
