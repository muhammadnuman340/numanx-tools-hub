import { tools, categories } from '../data/tools';

const site = 'https://numanx-tools.pages.dev';
const today = new Date().toISOString().split('T')[0];

function toW3CDate(raw: unknown, fallback: string): string {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return fallback;
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface PostFrontmatter {
  frontmatter?: { date?: string; lastmod?: string };
}

interface SitemapEntry {
  url: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

export async function GET() {
  const staticPages: SitemapEntry[] = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { url: '/tools/', priority: '0.9', changefreq: 'weekly', lastmod: today },
    ...categories.map((c) => ({
      url: `/category/${c.id}/`,
      priority: '0.8',
      changefreq: 'weekly' as const,
      lastmod: today,
    })),
    { url: '/blog/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/guides/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/comparisons/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/recommended/', priority: '0.7', changefreq: 'monthly', lastmod: today },
    { url: '/about/', priority: '0.7', changefreq: 'monthly', lastmod: today },
    { url: '/contact/', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/privacy-policy/', priority: '0.3', changefreq: 'yearly', lastmod: today },
    { url: '/terms-of-service/', priority: '0.3', changefreq: 'yearly', lastmod: today },
  ];

  const toolPages: SitemapEntry[] = tools.map((t) => ({
    url: t.url,
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: today,
  }));

  const blogModules = import.meta.glob('./blog/*.md', { eager: true });
  const blogPages: SitemapEntry[] = Object.entries(blogModules).map(([path, mod]) => {
    const slug = path.replace('./blog/', '').replace('.md', '');
    const post = mod as PostFrontmatter;
    const date = toW3CDate(post?.frontmatter?.lastmod || post?.frontmatter?.date, today);
    return {
      url: `/blog/${slug}/`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: date,
    };
  });

  const guideModules = import.meta.glob('./guides/*.md', { eager: true });
  const guidePages: SitemapEntry[] = Object.entries(guideModules).map(([path, mod]) => {
    const slug = path.replace('./guides/', '').replace('.md', '');
    const guide = mod as PostFrontmatter;
    const date = toW3CDate(guide?.frontmatter?.lastmod || guide?.frontmatter?.date, today);
    return {
      url: `/guides/${slug}/`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: date,
    };
  });

  const comparisonModules = import.meta.glob('./comparisons/*.md', { eager: true });
  const comparisonPages: SitemapEntry[] = Object.entries(comparisonModules).map(([path, mod]) => {
    const slug = path.replace('./comparisons/', '').replace('.md', '');
    const comp = mod as PostFrontmatter;
    const date = toW3CDate(comp?.frontmatter?.lastmod || comp?.frontmatter?.date, today);
    return {
      url: `/comparisons/${slug}/`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: date,
    };
  });

  // Strict deduplication map keyed by canonical URL
  const registry = new Map<string, SitemapEntry>();
  [...staticPages, ...toolPages, ...blogPages, ...guidePages, ...comparisonPages].forEach((entry) => {
    if (!registry.has(entry.url)) {
      registry.set(entry.url, entry);
    }
  });

  const urls = Array.from(registry.values())
    .map((p) => {
      const loc = `${site}${p.url}`;
      const mod = p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>${mod}\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
