import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // 1. Ссылка на ваш GitHub Pages (замените на ваш логин):
  site: 'https://nullptr-c-cpp.github.io',

  // 2. Имя вашего репозитория со слэшем (например: '/my-bironiks-site'):
  base: '/bironiks',

  integrations: [tailwind()]
});