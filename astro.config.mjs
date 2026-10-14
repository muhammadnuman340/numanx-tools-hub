import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://numanx-tools.pages.dev',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.85,
      filter: (page) =>
        !page.includes('/dashboard/') &&
        !page.includes('/favorites/') &&
        !page.includes('/search/') &&
        !page.includes('/api/') &&
        !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
