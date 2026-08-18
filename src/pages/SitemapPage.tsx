import React, { useState } from 'react';
import { FileCode, Download, Check, ExternalLink, Globe, Shield } from 'lucide-react';
import productsData from '../data/products.json';
import newsData from '../data/news.json';
import categoriesData from '../data/categories.json';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  const products = productsData;
  const news = newsData;
  const categories = categoriesData.categories;

  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Generate sitemap XML string
  const staticPages = [
    { url: 'https://bironix.ru/', priority: '1.0', changefreq: 'daily' },
    { url: 'https://bironix.ru/catalog', priority: '0.9', changefreq: 'daily' },
    { url: 'https://bironix.ru/news', priority: '0.7', changefreq: 'weekly' },
    { url: 'https://bironix.ru/logistics', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://bironix.ru/contacts', priority: '0.8', changefreq: 'monthly' }
  ];

  const productPages = products.map(p => ({
    url: `https://bironix.ru/catalog/${p.slug}`,
    priority: '0.9',
    changefreq: 'weekly'
  }));

  const newsPages = news.map(n => ({
    url: `https://bironix.ru/news/${n.slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const allUrls = [...staticPages, ...productPages, ...newsPages];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://bironix.ru/sitemap.xml
Host: https://bironix.ru`;

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[{ label: 'Карта сайта и SEO файлы' }]}
        onNavigate={onNavigate}
      />

      <div className="border-b border-[#243044] pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Карта сайта (Sitemap.xml) и поисковая оптимизация
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Сгенерированные файлы карты сайта для индексации в Яндекс.Вебмастер и Google Search Console.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sitemap.xml block */}
        <div className="bg-[#18202d] border border-[#273449] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold text-slate-100 text-base">sitemap.xml</h2>
            </div>
            <span className="text-xs text-slate-500">{allUrls.length} страниц</span>
          </div>

          <pre className="bg-[#121824] p-4 rounded-xl border border-[#243044] text-[11px] font-mono text-slate-300 h-64 overflow-y-auto">
            {sitemapXml}
          </pre>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadFile(sitemapXml, 'sitemap.xml', 'application/xml')}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Скачать sitemap.xml</span>
            </button>
            <button
              onClick={() => copyToClipboard(sitemapXml, 'sitemap')}
              className="px-4 py-2.5 bg-[#121824] hover:bg-[#1f2a3c] border border-[#273449] text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              {copiedType === 'sitemap' ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
        </div>

        {/* Robots.txt block */}
        <div className="bg-[#18202d] border border-[#273449] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="font-semibold text-slate-100 text-base">robots.txt</h2>
            </div>
            <span className="text-xs text-slate-500">Конфиг поисковых роботов</span>
          </div>

          <pre className="bg-[#121824] p-4 rounded-xl border border-[#243044] text-[11px] font-mono text-slate-300 h-64 overflow-y-auto">
            {robotsTxt}
          </pre>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadFile(robotsTxt, 'robots.txt', 'text/plain')}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Скачать robots.txt</span>
            </button>
            <button
              onClick={() => copyToClipboard(robotsTxt, 'robots')}
              className="px-4 py-2.5 bg-[#121824] hover:bg-[#1f2a3c] border border-[#273449] text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              {copiedType === 'robots' ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
