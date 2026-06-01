export async function GET() {
  const body = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /internal/
Disallow: /draft/

Sitemap: https://numanxtools.site/sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
}