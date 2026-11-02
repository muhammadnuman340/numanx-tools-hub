import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://toolshub.numanxstudio.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [],
  vite: {
    plugins: [tailwind()],
    build: {
      // Keep fonts as files: the CSP (public/_headers) has no data: in font-src,
      // so inlined font subsets were blocked in the browser.
      assetsInlineLimit: (filePath) => (/\.(woff2?|ttf|otf)$/i.test(filePath) ? false : undefined),
    },
  },
});
