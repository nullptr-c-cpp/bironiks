import React from 'react';
import { Clock, Calendar, ArrowLeft, Tag, Share2, BookOpen } from 'lucide-react';
import newsData from '../data/news.json';
import productsData from '../data/products.json';
import companyData from '../data/company.json';
import { NewsItem, Product, CompanyInfo } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';

interface NewsDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ slug, onNavigate }) => {
  const news = newsData as unknown as NewsItem[];
  const products = productsData as unknown as Product[];
  const company = companyData as unknown as CompanyInfo;

  const item = news.find(n => n.slug === slug) || news[0];

  const linkedProducts = (item.linkedProductIds || [])
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // Schema.org Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": item.title,
    "image": [item.coverImage],
    "datePublished": item.date,
    "dateModified": item.date,
    "author": [{
      "@type": "Organization",
      "name": "Инженерный отдел БИРОНИКС",
      "url": "https://bironix.ru"
    }],
    "publisher": {
      "@type": "Organization",
      "name": company.name,
      "logo": {
        "@type": "ImageObject",
        "url": "https://bironix.ru/logo.png"
      }
    },
    "description": item.summary
  };

  const handleLinkClicksInHtml = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        onNavigate(href);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Новости и статьи', path: '/news' },
          { label: item.title }
        ]}
        onNavigate={onNavigate}
      />

      {/* Back button */}
      <button
        onClick={() => onNavigate('/news')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад к списку статей</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold bg-[#18202d] text-amber-400 px-3 py-1 rounded-lg border border-[#273449]">
            {item.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.readTimeMin} мин чтения</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-100 leading-tight">
          {item.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium bg-[#18202d] p-4 rounded-xl border border-[#273449]">
          {item.summary}
        </p>
      </header>

      {/* Hero Cover Image */}
      <div className="h-64 sm:h-96 rounded-2xl overflow-hidden border border-[#273449] shadow-lg bg-[#121824]">
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content with click handler for internal SPA links */}
      <div
        onClick={handleLinkClicksInHtml}
        className="prose prose-invert prose-amber max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 bg-[#18202d] p-6 sm:p-8 rounded-2xl border border-[#273449]"
        dangerouslySetInnerHTML={{ __html: item.contentHtml }}
      />

      {/* Tags */}
      <div className="pt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Теги публикации:</span>
        {item.tags?.map((t, idx) => (
          <span key={idx} className="text-xs bg-[#18202d] text-slate-300 border border-[#273449] px-3 py-1 rounded-lg">
            #{t}
          </span>
        ))}
      </div>

      {/* Linked Products Section */}
      {linkedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#243044] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Материалы, упомянутые в статье
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Вы можете рассчитать объем и добавить товары напрямую в спецификацию
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {linkedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
