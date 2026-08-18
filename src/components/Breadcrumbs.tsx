import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  // Schema.org BreadcrumbList microdata
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://bironix.ru/"
      },
      ...items.map((it, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": it.label,
        "item": it.path ? `https://bironix.ru${it.path}` : undefined
      }))
    ]
  };

  return (
    <nav aria-label="Хлебные крошки" className="my-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Главная</span>
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-600" />
              {item.path && !isLast ? (
                <button
                  onClick={() => onNavigate(item.path!)}
                  className="hover:text-amber-400 transition-colors truncate max-w-xs"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-slate-300 font-medium truncate max-w-sm">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
