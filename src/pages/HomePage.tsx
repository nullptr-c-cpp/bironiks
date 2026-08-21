import React from 'react';
import { 
  Building2, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Truck, 
  Clock,
  MapPin,
  FileText,
  Phone
} from 'lucide-react';
import companyData from '../data/company.json';
import categoriesData from '../data/categories.json';
import productsData from '../data/products.json';
import newsData from '../data/news.json';
import { CompanyInfo, Product, NewsItem } from '../types';
import { ProductCard } from '../components/ProductCard';
import { exportCompanyRequisitesPdf, exportFullCatalogPriceListExcel } from '../utils/exportUtils';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const company = companyData as unknown as CompanyInfo;
  const categories = categoriesData.categories;
  const collections = categoriesData.collections;
  const products = productsData as unknown as Product[];
  const news = newsData as unknown as NewsItem[];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#141b26] border-b border-[#232f42] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Hero Copy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#1b2433] border border-[#2b394e] rounded-md px-3 py-1 text-xs font-medium text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Склад в Омске</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 leading-tight">
                Поставки изоляционных и строительных материалов в Омске
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Торговая фирма <strong>ООО «БИРОНИКС»</strong>: Тепло- и звукоизоляция из вспененного полиэтилена, экструдированный пенополистирол, трубная теплоизоляция, фольга для бань и саун, монтажная пена MARCON, межвенцовый джут. Все позиции в наличии на складе в Омске.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/catalog')}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>Перейти в каталог</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => exportFullCatalogPriceListExcel(products, company)}
                  className="px-4 py-2.5 bg-[#1b2433] hover:bg-[#232e40] border border-[#2c3b50] text-slate-200 font-medium text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Скачать прайс (.XLSX)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/logistics')}
                  className="px-4 py-2.5 bg-[#1b2433] hover:bg-[#232e40] border border-[#2c3b50] text-slate-300 font-medium text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Склад и самовывоз</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#232f42] text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Самовывоз в день заказа</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Сертификаты и ГОСТ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Быстрый ответ по телефону</span>
                </div>
              </div>
            </div>

            {/* Right Col: Quick Pickup Summary */}
            <div className="lg:col-span-5">
              <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-3">
                <div className="border-b border-[#243044] pb-2">
                  <h3 className="font-semibold text-slate-100 text-sm">Информация для покупателей</h3>
                  <p className="text-xs text-slate-400">Отгрузка со склада в Омске</p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-200">Адрес: </span>
                      {company.warehouseAddress}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-200">Режим работы: </span>
                      {company.workSchedule.weekdays}, {company.workSchedule.saturday}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-200">Телефон: </span>
                      <a href={`tel:${company.mainPhone.replace(/[^+\d]/g, '')}`} className="text-amber-400 hover:underline">
                        {company.mainPhone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#243044] flex items-center justify-between text-xs">
                  <span className="text-slate-400">Наличный и безналичный расчёт, оплата по QR-коду.</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('/contacts')}
                    className="text-xs font-medium text-amber-400 hover:underline"
                  >
                    Все контакты →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES AND COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              Популярные разделы и подборки
            </h2>
            <p className="text-xs text-slate-400">
              Быстрый переход к нужным категориям материалов
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/catalog')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Весь каталог</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => onNavigate(`/catalog?collection=${col.id}`)}
              className="bg-[#18202d] border border-[#273449] hover:border-slate-500/50 rounded-xl p-5 cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium bg-[#121824] text-amber-400 px-2.5 py-0.5 rounded border border-[#273449]">
                    {col.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-100">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {col.desc}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#243044] text-[11px] text-amber-400 font-medium">
                Перейти к товарам →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              Популярные товары в наличии
            </h2>
            <p className="text-xs text-slate-400">
              Цены в рублях за единицу товара
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/catalog')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>В каталог ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Grid with generous whitespace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => onNavigate('/catalog')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18202d] hover:bg-[#202b3c] border border-[#2c3b50] text-slate-200 font-medium text-xs sm:text-sm rounded-lg transition-colors"
          >
            <span>Посмотреть все товары каталога</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* 4. DOWNLOAD EXCEL PRICE LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Download className="w-4 h-4" />
                <span>Актуальный прайс-лист ООО «БИРОНИКС»</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                Скачайте полный каталог цен в Excel (.XLSX)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Таблица со всеми артикулами, размерами, единицами измерения и ценами в рублях.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                type="button"
                onClick={() => exportFullCatalogPriceListExcel(products, company)}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Скачать прайс (.XLSX)</span>
              </button>
              <button
                type="button"
                onClick={() => exportCompanyRequisitesPdf(company)}
                className="w-full py-2.5 px-4 bg-[#131924] hover:bg-[#1b2332] border border-[#2c3b50] text-slate-200 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Реквизиты компании (.PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              Полезные статьи и инструкции
            </h2>
            <p className="text-xs text-slate-400">
              Советы по выбору и монтажу материалов
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/news')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Все статьи</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(`/news/${item.slug}`)}
              className="bg-[#18202d] border border-[#273449] hover:border-slate-500/40 rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-colors"
            >
              <div className="h-40 bg-[#121824] overflow-hidden relative border-b border-[#243044]">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-medium bg-[#121824]/90 text-amber-400 px-2 py-0.5 rounded border border-[#2c3b50]">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.readTimeMin} мин
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#243044] text-xs font-medium text-amber-400 flex items-center gap-1">
                  <span>Читать статью</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
