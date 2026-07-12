import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: string) => `
User-agent: *
Allow: /

# Block internal build and processing endpoints
Disallow: /api/
Disallow: /_astro/
Disallow: /_server/

Sitemap: ${sitemapURL}
`.trim();

export const GET: APIRoute = ({ site }) => {
  // Read Astro.site to dynamically append absolute path to sitemap
  // The @astrojs/sitemap integration defaults to 'sitemap-index.xml'
  const sitemapURL = new URL('sitemap-index.xml', site || 'https://numanx-tools.pages.dev');

  return new Response(getRobotsTxt(sitemapURL.href), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    },
  });
};
