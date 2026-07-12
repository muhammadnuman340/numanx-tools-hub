import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://numanx-tools.pages.dev',
  trailingSlash: 'always', // Strictly normalize slashes to prevent Duplicate Content in GSC
  integrations: [
    sitemap({
      changefreq: 'daily',
      priority: 0.8,
    })
  ],
  vite: {
    plugins: [tailwind()],
  },
});
