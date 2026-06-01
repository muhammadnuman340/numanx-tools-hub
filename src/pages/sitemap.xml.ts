import { tools, categories } from "../data/tools";

const site = 'https://numanxtools.site';
const today = new Date().toISOString().split('T')[0];

export async function GET() {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { url: '/tools/', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/category/image-tools/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/category/creator-tools/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/category/utility-tools/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/category/cricket-tools/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/blog/', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/search/', priority: '0.6', changefreq: 'monthly' },
    { url: '/dashboard/', priority: '0.7', changefreq: 'weekly', lastmod: today },
    { url: '/favorites/', priority: '0.4', changefreq: 'monthly' },
    { url: '/about/', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy/', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms-of-service/', priority: '0.3', changefreq: 'yearly' },
  ];

  const toolPages = tools.map((t) => ({
    url: t.url,
    priority: '0.9',
    changefreq: 'monthly' as const,
    lastmod: today,
  }));

  const categoryPages = categories.map((c) => ({
    url: `/category/${c.id}/`,
    priority: '0.8',
    changefreq: 'weekly' as const,
    lastmod: today,
  }));

  const blogPosts = [
    { slug: 'best-ai-tools-for-students', date: '2026-05-15' },
    { slug: 'best-free-image-tools-2026', date: '2026-05-20' },
    { slug: 'best-youtube-tools-for-creators', date: '2026-05-10' },
    { slug: 'how-to-compress-images', date: '2026-05-25' },
    { slug: 'top-10-ai-tools-content-creators-2026', date: '2026-05-28' },
    { slug: 'how-to-optimize-images-for-web', date: '2026-05-28' },
    { slug: 'cricket-run-rate-beginners-guide', date: '2026-05-28' },
    { slug: 'complete-guide-password-security', date: '2026-05-28' },
    { slug: 'qr-codes-marketing-best-practices', date: '2026-05-29' },
    { slug: 'hashtag-strategy-viral-growth', date: '2026-05-29' },
    { slug: 'image-compression-without-losing-quality', date: '2026-05-29' },
    { slug: 'webp-vs-png-vs-jpg-which-format-wins', date: '2026-05-29' },
    { slug: 'age-calculator-fun-facts-birthday', date: '2026-05-30' },
    { slug: 'how-to-resize-images-social-media', date: '2026-05-30' },
  ];

  const blogPages = blogPosts.map((p) => ({
    url: `/blog/${p.slug}/`,
    priority: '0.7',
    changefreq: 'monthly' as const,
    lastmod: p.date,
  }));

  const allPages = [...staticPages, ...toolPages, ...categoryPages, ...blogPages];

  const urls = allPages
    .map((p) => {
      const loc = `${site}${p.url}`;
      const freq = p.changefreq;
      const pri = p.priority;
      const mod = (p as any).lastmod ? `\n    <lastmod>${(p as any).lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>${mod}\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
