import { tools, categories } from "../data/tools";

const site = 'https://numanx-tools.pages.dev';
const today = new Date().toISOString().split('T')[0];

interface PostFrontmatter {
  frontmatter?: { date?: string; };
}

export async function GET() {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { url: '/tools/', priority: '0.9', changefreq: 'weekly', lastmod: today },
    ...categories.map((c) => ({
      url: `/category/${c.id}/`, priority: '0.8' as const, changefreq: 'weekly' as const, lastmod: today,
    })),
    { url: '/blog/', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/dashboard/', priority: '0.7', changefreq: 'weekly', lastmod: today },
    { url: '/recommended/', priority: '0.7', changefreq: 'monthly' },
    { url: '/about/', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy/', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms-of-service/', priority: '0.3', changefreq: 'yearly' },
  ];

  const toolPages = tools.map((t) => ({
    url: t.url,
    priority: '0.9' as const,
    changefreq: 'monthly' as const,
    lastmod: today,
  }));

  const blogModules = import.meta.glob("./blog/*.md", { eager: true });
  const blogPages = Object.entries(blogModules).map(([path, mod]) => {
    const slug = path.replace("./blog/", "").replace(".md", "");
    const post = mod as PostFrontmatter;
    const date = post?.frontmatter?.date || today;
    return {
      url: `/blog/${slug}/`,
      priority: '0.7' as const,
      changefreq: 'monthly' as const,
      lastmod: date,
    };
  });

  const allPages = [...staticPages, ...toolPages, ...blogPages];

  const urls = allPages
    .map((p) => {
      const loc = `${site}${p.url}`;
      const mod = p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>${mod}\n  </url>`;
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
