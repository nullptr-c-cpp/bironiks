import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // Замените на ваш логин и имя репозитория для корректных путей на GitHub Pages:
  // site: 'https://<username>.github.io',
  // base: '/<repository-name>',
  integrations: [tailwind()]
});