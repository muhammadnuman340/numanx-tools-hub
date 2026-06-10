// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://numanx-tools.pages.dev',
  compressHTML: true,
  scopedStyleStrategy: 'where',
  build: {
    inlineStylesheets: 'auto',
    assetsInlineLimit: 4096,
  },
  prefetch: {
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          assetFileNames: '_astro/[name].[hash][extname]',
          chunkFileNames: '_astro/[name].[hash].js',
          entryFileNames: '_astro/[name].[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules/qrcode')) {
              return 'vendor/qrcode';
            }
          },
        },
      },
    },
  },
});
