import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Ваш полный адрес на GitHub Pages:
  site: 'https://nullptr-c-cpp.github.io',
  base: '/',

  integrations: [
    tailwind(),
    sitemap()
  ]
});
