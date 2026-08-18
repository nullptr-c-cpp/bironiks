import React, { useState } from 'react';
import { Clock, Tag, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import newsData from '../data/news.json';
import { NewsItem } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface NewsListPageProps {
  onNavigate: (path: string) => void;
}

export const NewsListPage: React.FC<NewsListPageProps> = ({ onNavigate }) => {
  const news = newsData as unknown as NewsItem[];
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = Array.from(new Set(news.flatMap(n => n.tags || [])));

  const filteredNews = selectedTag === 'all'
    ? news
    : news.filter(n => n.tags?.includes(selectedTag));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Новости и статьи' }]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="border-b border-[#243044] pb-6">
        <div className="inline-flex items-center gap-2 bg-[#18202d] text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold border border-[#273449] mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Инженерная база знаний «БИРОНИКС»</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Статьи, теплотехнические расчеты и новости отрасли
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Практические инструкции по монтажу фольгированной изоляции в банях, расчеты толщины XPS для фундаментов УШП и устранение конденсата на трубах.
        </p>
      </div>

      {/* Tag filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selectedTag === 'all'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-[#18202d] border border-[#273449] text-slate-300 hover:border-slate-600'
          }`}
        >
          Все темы
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#18202d] border border-[#273449] text-slate-300 hover:border-amber-500/40'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map(item => (
          <article
            key={item.id}
            onClick={() => onNavigate(`/news/${item.slug}`)}
            className="group bg-[#18202d] border border-[#273449] hover:border-amber-500/50 rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-200"
          >
            <div className="h-48 bg-[#121824] overflow-hidden relative">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-semibold bg-[#18202d]/90 text-amber-400 px-2.5 py-1 rounded-lg border border-[#273449]">
                {item.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.readTimeMin} мин чтения
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-100 group-hover:text-amber-400 transition-colors leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#243044] flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-[#121824] text-slate-400 px-2 py-0.5 rounded border border-[#243044]">
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Читать</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
