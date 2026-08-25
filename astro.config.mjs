import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // 1. Ссылка на ваш GitHub Pages (замените на ваш логин):
  site: 'https://bironiks.ru',

  // 2. Имя вашего репозитория со слэшем (например: '/my-bironiks-site'):
  base: '/',

  integrations: [tailwind()]
});
