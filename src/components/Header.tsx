import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronRight, 
  Building2,
  FileText
} from 'lucide-react';
import companyData from '../data/company.json';
import productsData from '../data/products.json';
import { useSpecification } from '../context/SpecificationContext';
import { exportCompanyRequisitesPdf } from '../utils/exportUtils';
import { CompanyInfo, Product } from '../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { totalItemsCount, totalSum, setIsDrawerOpen } = useSpecification();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const company = companyData as unknown as CompanyInfo;
  const products = productsData as unknown as Product[];

  // Filtered search results
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()) || v.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchResultClick = (slug: string) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    onNavigate(`/catalog/${slug}`);
  };

  const navLinks = [
    { label: 'Каталог товаров', path: '/catalog' },
    { label: 'Самовывоз и склад', path: '/logistics' },
    { label: 'Полезные статьи', path: '/news' },
    { label: 'Контакты и реквизиты', path: '/contacts' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-slate-950 border-b border-slate-850 text-xs text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-xs sm:max-w-none">г. Омск, ул. 20 лет РККА, д. 183Б, оф. 3 (склад / офис)</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <span>Пн-Пт: 09:00 – 17:00, Сб: 10:00 – 14:00</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://vk.com/bironiks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-amber-400 transition-colors text-[11px]"
            >
              vk.com/bironiks
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => exportCompanyRequisitesPdf(company)}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
              title="Скачать реквизиты ООО «БИРОНИКС» в PDF"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Реквизиты (.PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('/')} 
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
              <img src="/bironiks/image/logo.jpg" alt="БИРОНИКС" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  БИРОНИКС
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ООО «БИРОНИКС» • Склад в Омске
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Поиск по каталогу (фольга, трубки, джут, пена)..."
                className="w-full bg-[#131924] border border-[#2d3b50] rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Quick Live Search Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#18212e] border border-[#2c3a4f] rounded-lg shadow-xl overflow-hidden z-50">
                <div className="p-2 text-[11px] text-slate-400 bg-[#131924] border-b border-[#2c3a4f] font-medium">
                  Найдено товаров ({searchResults.length})
                </div>
                {searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    onMouseDown={() => handleSearchResultClick(prod.slug)}
                    className="p-2.5 hover:bg-[#202c3d] cursor-pointer flex items-center justify-between gap-3 border-b border-[#253245] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.title} className="w-9 h-9 object-cover rounded bg-[#101520]" />
                      <div>
                        <div className="text-xs font-semibold text-white line-clamp-1">{prod.title}</div>
                        <div className="text-[11px] text-slate-400">{prod.categoryName}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-amber-400">
                        {prod.variants[0]?.price.toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="text-[10px] text-slate-400">/ {prod.variants[0]?.mainUnit}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Direct Contacts */}
          <div className="hidden xl:flex items-center gap-3 text-right">
            <div>
              <a 
                href={`tel:${company.mainPhone.replace(/[^+\d]/g, '')}`} 
                className="text-sm font-semibold text-white hover:text-amber-400 transition-colors block"
              >
                {company.mainPhone}
              </a>
              <span className="text-[11px] text-slate-400">
                Отдел продаж
              </span>
            </div>
          </div>

          {/* Specification / Order Drawer Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold leading-tight">Мой заказ</div>
                <div className="text-[10px] text-amber-100 leading-tight">
                  {totalItemsCount > 0 ? `${totalSum.toLocaleString('ru-RU')} ₽` : 'Пусто'}
                </div>
              </div>
              {totalItemsCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#111620] text-amber-300 text-xs font-bold w-5 h-5 rounded-full ml-1 border border-amber-500/30">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white md:hidden bg-[#18212e] border border-[#2b394d] rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Navigation Bar (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 mt-3 pt-2.5 border-t border-[#232f42] text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                type="button"
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`px-3.5 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#1e2838] text-amber-400 font-semibold'
                    : 'hover:bg-[#192230] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по каталогу..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.path}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate(link.path);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-md flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Телефон склад / офис:</span>
              <a href={`tel:${company.mainPhone.replace(/[^+\d]/g, '')}`} className="font-bold text-orange-400">
                {company.mainPhone}
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                exportCompanyRequisitesPdf(company);
              }}
              className="w-full py-2 bg-slate-800 text-slate-200 rounded text-center font-medium"
            >
              Скачать реквизиты компании (.PDF)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
