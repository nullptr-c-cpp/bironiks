// src/utils/paths.ts
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Функция, которая сама подставляет префикс к любому пути
export function getUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}