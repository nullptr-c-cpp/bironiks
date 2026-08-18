import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw,
  Package
} from 'lucide-react';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface CatalogPageProps {
  initialCategory?: string;
  initialCollection?: string;
  onNavigate: (path: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory,
  initialCollection,
  onNavigate
}) => {
  const products = productsData as unknown as Product[];
  const categories = categoriesData.categories;
  const collections = categoriesData.collections;

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedThickness, setSelectedThickness] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'title'>('popular');

  // Available brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.brand) set.add(p.brand); });
    return Array.from(set);
  }, [products]);

  // Available thicknesses
  const thicknesses = useMemo(() => {
    const set = new Set<number>();
    products.forEach(p => {
      if (p.specs && p.specs.thickness) {
        set.add(Number(p.specs.thickness));
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        const matchesSku = product.variants.some(v => v.sku.toLowerCase().includes(q) || v.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCat && !matchesSku) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Collection
      if (selectedCollection !== 'all' && !product.collections?.includes(selectedCollection)) {
        return false;
      }

      // Brand
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // Thickness
      if (selectedThickness !== 'all' && String(product.specs?.thickness) !== selectedThickness) {
        return false;
      }

      // Stock
      if (inStockOnly && !product.variants.some(v => v.stockStatus === 'in_stock' || v.stockStatus === 'low_stock')) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const getMinPrice = (p: Product) => {
        const prices = p.variants.map(v => v.price);
        return Math.min(...prices);
      };

      if (sortBy === 'price-asc') {
        return getMinPrice(a) - getMinPrice(b);
      }
      if (sortBy === 'price-desc') {
        return getMinPrice(b) - getMinPrice(a);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default: popular
      return b.reviewsCount - a.reviewsCount;
    });
  }, [products, searchQuery, selectedCategory, selectedCollection, selectedBrand, selectedThickness, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedBrand('all');
    setSelectedThickness('all');
    setInStockOnly(false);
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedCollection !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedThickness !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Каталог материалов', path: '/catalog' }]}
        onNavigate={onNavigate}
      />

      {/* Page Title Header */}
      <div className="pb-4 border-b border-[#243044]">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Каталог изоляционных материалов
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          В наличии на складе в Москве (самовывоз). Все цены указаны в рублях.
        </p>
      </div>

      {/* Collections quick chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCollection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCollection === 'all'
              ? 'bg-amber-600 text-white'
              : 'bg-[#18202d] border border-[#273449] text-slate-300 hover:border-slate-500'
          }`}
        >
          Все разделы
        </button>
        {collections.map(col => (
          <button
            type="button"
            key={col.id}
            onClick={() => setSelectedCollection(col.id === selectedCollection ? 'all' : col.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCollection === col.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#18202d] border border-[#273449] text-slate-300 hover:border-slate-500'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* SIDEBAR FILTERS */}
        <aside className="space-y-4">
          {/* Search Box */}
          <div className="bg-[#18202d] border border-[#273449] rounded-xl p-4 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">Поиск по каталогу</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или SKU..."
                className="w-full bg-[#121824] border border-[#2b394e] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-[#18202d] border border-[#273449] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Категории</h3>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#1f2a3a] text-amber-400 font-semibold border border-amber-500/40'
                    : 'text-slate-300 hover:bg-[#1f2a3a]'
                }`}
              >
                <span>Все категории</span>
                <span className="text-[10px] text-slate-400">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#1f2a3a] text-amber-400 font-semibold border border-amber-500/40'
                        : 'text-slate-300 hover:bg-[#1f2a3a]'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[10px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameters Filter */}
          <div className="bg-[#18202d] border border-[#273449] rounded-xl p-4 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#243044]">
              <h3 className="font-semibold uppercase tracking-wider text-slate-300">Параметры</h3>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Сброс ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <label className="text-slate-400 font-medium block mb-1">Производитель:</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#121824] border border-[#2b394e] text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Все производители</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Thickness Filter */}
            {thicknesses.length > 0 && (
              <div>
                <label className="text-slate-400 font-medium block mb-1">Толщина (мм):</label>
                <select
                  value={selectedThickness}
                  onChange={(e) => setSelectedThickness(e.target.value)}
                  className="w-full bg-[#121824] border border-[#2b394e] text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Любая толщина</option>
                  {thicknesses.map(th => (
                    <option key={th} value={String(th)}>{th} мм</option>
                  ))}
                </select>
              </div>
            )}

            {/* In-Stock Toggle */}
            <div className="pt-2 border-t border-[#243044]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#2b394e] bg-[#121824] text-amber-500 focus:ring-amber-500"
                />
                <span className="text-slate-300 font-medium">Только в наличии</span>
              </label>
            </div>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="lg:col-span-3 space-y-4">
          {/* Top Results Bar */}
          <div className="bg-[#18202d] border border-[#273449] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-300 font-medium">
              Найдено товаров: <strong className="text-amber-400">{filteredProducts.length}</strong>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#121824] border border-[#2b394e] text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="popular">По популярности</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="title">По названию (А-Я)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#18202d] border border-[#273449] rounded-xl p-12 text-center space-y-4">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-slate-100 font-semibold text-base">Товары не найдены</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Попробуйте сбросить фильтры или изменить поисковый запрос.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-500 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
