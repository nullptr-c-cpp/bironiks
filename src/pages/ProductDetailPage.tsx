import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShoppingCart, 
  Check, 
  FileText, 
  Download, 
  Package, 
  Scale, 
  Box, 
  Info, 
  CheckCircle2,
  MapPin,
  Tag
} from 'lucide-react';
import productsData from '../data/products.json';
import specClassesData from '../data/spec-classes.json';
import companyData from '../data/company.json';
import { Product, ProductVariant, SpecClass, CompanyInfo } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { useSpecification } from '../context/SpecificationContext';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const products = productsData as unknown as Product[];
  const specClasses = specClassesData as unknown as SpecClass[];
  const company = companyData as unknown as CompanyInfo;
  const { addItem } = useSpecification();

  const product = products.find(p => p.slug === slug) || products[0];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'docs' | 'pickup'>('specs');
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const currentVariant: ProductVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const currentSpecClass = specClasses.find(sc => sc.id === product.specClassId);

  // Related products
  const relatedProducts = (product.relatedProductIds || [])
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleAddToCart = () => {
    addItem(product, currentVariant, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 2000);
  };

  const getStockBadge = (status: string, text?: string) => {
    if (status === 'in_stock') {
      return (
        <span className="text-xs font-medium bg-[#102619] text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/30">
          {text || 'В наличии на складе'}
        </span>
      );
    }
    if (status === 'low_stock') {
      return (
        <span className="text-xs font-medium bg-[#2a2012] text-amber-300 px-2.5 py-1 rounded border border-amber-500/30">
          {text || 'В наличии мало'}
        </span>
      );
    }
    return (
      <span className="text-xs font-medium bg-[#18202d] text-slate-300 px-2.5 py-1 rounded border border-[#273449]">
        {text || 'Под заказ'}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Каталог', path: '/catalog' },
          { label: product.categoryName, path: `/catalog?category=${product.category}` },
          { label: product.title }
        ]}
        onNavigate={onNavigate}
      />

      {/* Main Top Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (Gallery) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative h-80 sm:h-96 bg-[#18202d] rounded-xl overflow-hidden border border-[#273449] shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {/* Badges on image */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="text-xs font-medium bg-[#101520]/90 text-amber-400 px-2.5 py-1 rounded border border-[#273449]">
                {product.brand}
              </span>
              {getStockBadge(currentVariant.stockStatus, currentVariant.stockText)}
            </div>

            <div className="absolute bottom-3 left-3 bg-[#101520]/90 text-slate-300 font-mono text-xs px-2.5 py-1 rounded border border-[#273449]">
              SKU: {currentVariant.sku}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-amber-500 scale-105'
                      : 'border-[#273449] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Pickup / Weight Box */}
          <div className="bg-[#18202d] border border-[#273449] rounded-xl p-4 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Самовывоз со склада:</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              {company.warehouseAddress} (Пн-Пт 9:00 - 18:00)
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#243044]">
              <div>Вес 1 ед.: <strong className="text-slate-200">{currentVariant.weightKg || '—'} кг</strong></div>
              <div>Объем 1 ед.: <strong className="text-slate-200">{currentVariant.volumeM3 || '—'} м³</strong></div>
            </div>
          </div>
        </div>

        {/* Right Col (Configuration & Order) */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="text-xs font-semibold text-amber-400 mb-1">
              {product.categoryName}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {product.shortDesc}
            </p>
          </div>

          {/* Key Advantages Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#18202d] p-3.5 rounded-xl border border-[#273449]">
            {product.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* SKU Modification Selector */}
          <div className="space-y-3 bg-[#18202d] border border-[#273449] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Модификация / Размер:
              </label>
              <span className="text-xs text-slate-400 font-mono">
                Артикул: <strong className="text-amber-400">{currentVariant.sku}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.variants.map((v, idx) => {
                const isSelected = selectedVariantIndex === idx;
                let secondaryInfo = '';
                if (v.secondaryPrice) {
                  secondaryInfo = `${v.secondaryPrice.price} ₽/${v.secondaryPrice.unit}`;
                } else if (v.additionalPrices && v.additionalPrices.length > 0) {
                  secondaryInfo = `${v.additionalPrices[0].price} ₽/${v.additionalPrices[0].unit}`;
                } else if (v.unitCoverage) {
                  secondaryInfo = `~${(v.price / v.unitCoverage.factor).toFixed(0)} ₽/${v.unitCoverage.unit}`;
                }
                return (
                  <button
                    key={v.sku}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setQuantity(v.minOrder?.qty || 1);
                    }}
                    className={`p-3 rounded-xl text-left border transition-colors flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1f2a3a] border-amber-500/60 ring-1 ring-amber-500/30'
                        : 'bg-[#121824] border-[#273449] hover:border-slate-500'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-100 line-clamp-1">{v.name}</div>
                    <div className="mt-2 flex items-baseline justify-between gap-1">
                      <span className="text-[11px] text-slate-400">{v.sku}</span>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                          {v.price.toLocaleString('ru-RU')} ₽ / {v.mainUnit}
                        </div>
                        {secondaryInfo && (
                          <div className="text-[10px] text-amber-300 font-medium">
                            ({secondaryInfo})
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {currentVariant.minOrder?.note && (
              <div className="text-xs text-slate-400 bg-[#121824] px-3 py-2 rounded-lg border border-[#243044] flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{currentVariant.minOrder.note}</span>
              </div>
            )}
          </div>

          {/* Pricing & Order Box */}
          <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121824] p-4 rounded-xl border border-[#243044]">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-medium tracking-wider">
                  Стоимость заказа:
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-100">
                    {currentVariant.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    / {currentVariant.mainUnit}
                  </span>
                </div>
              </div>

              {/* Secondary / Unit Price Highlights */}
              {currentVariant.secondaryPrice ? (
                <div className="bg-[#18202d] px-4 py-2.5 rounded-lg border border-[#2e3e57] text-left sm:text-right">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {currentVariant.secondaryPrice.label || `Цена за единицу (${currentVariant.secondaryPrice.unit}):`}
                  </div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">
                    {currentVariant.secondaryPrice.price.toLocaleString('ru-RU')} ₽ <span className="text-xs font-normal text-slate-300">/ {currentVariant.secondaryPrice.unit}</span>
                  </div>
                </div>
              ) : currentVariant.additionalPrices && currentVariant.additionalPrices.length > 0 ? (
                <div className="bg-[#18202d] px-4 py-2.5 rounded-lg border border-[#2e3e57] text-left sm:text-right">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {currentVariant.additionalPrices[0].label || `Цена за ${currentVariant.additionalPrices[0].unit}:`}
                  </div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">
                    {currentVariant.additionalPrices[0].price.toLocaleString('ru-RU')} ₽ <span className="text-xs font-normal text-slate-300">/ {currentVariant.additionalPrices[0].unit}</span>
                  </div>
                </div>
              ) : currentVariant.unitCoverage ? (
                <div className="bg-[#18202d] px-4 py-2.5 rounded-lg border border-[#2e3e57] text-left sm:text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Пересчет за {currentVariant.unitCoverage.unit}</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">
                    {(currentVariant.price / currentVariant.unitCoverage.factor).toFixed(0)} ₽ <span className="text-xs font-normal text-slate-300">/ {currentVariant.unitCoverage.unit}</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* If there are multiple additional prices configured, show them */}
            {currentVariant.additionalPrices && currentVariant.additionalPrices.length > 1 && (
              <div className="bg-[#121824] p-3 rounded-lg border border-[#243044] space-y-1.5 text-xs">
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Варианты цен по единицам измерения:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentVariant.additionalPrices.map((ap, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-[#18202d] border border-[#273449]">
                      <span className="text-slate-300">{ap.label || `За 1 ${ap.unit}`}</span>
                      <span className="font-bold text-amber-400">{ap.price.toLocaleString('ru-RU')} ₽ / {ap.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Order */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div className="flex items-center justify-between sm:justify-start bg-[#121824] border border-[#2b394e] rounded-xl p-1 w-full sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(currentVariant.minOrder?.qty || 1, prev - (currentVariant.minOrder?.step || 1)))}
                  className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#18202d] rounded-lg text-lg font-bold"
                >
                  -
                </button>
                <div className="text-center px-2">
                  <span className="text-sm font-bold text-white">{quantity}</span>
                  <span className="block text-[10px] text-slate-500 leading-none">{currentVariant.mainUnit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + (currentVariant.minOrder?.step || 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#18202d] rounded-lg text-lg font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                  isAddedRecently
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                }`}
              >
                {isAddedRecently ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Добавлено в заказ!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>В заказ ({(currentVariant.price * quantity).toLocaleString('ru-RU')} ₽)</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="pt-4">
        <div className="flex items-center gap-1 border-b border-[#243044] overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-t-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'specs'
                ? 'bg-[#18202d] text-amber-400 border-t-2 border-amber-500 border-x border-[#273449]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Характеристики и цены</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`px-4 py-2 rounded-t-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'desc'
                ? 'bg-[#18202d] text-amber-400 border-t-2 border-amber-500 border-x border-[#273449]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Описание</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-t-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'docs'
                ? 'bg-[#18202d] text-amber-400 border-t-2 border-amber-500 border-x border-[#273449]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Сертификаты</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pickup')}
            className={`px-4 py-2 rounded-t-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'pickup'
                ? 'bg-[#18202d] text-amber-400 border-t-2 border-amber-500 border-x border-[#273449]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Самовывоз со склада</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="bg-[#18202d] border-x border-b border-[#273449] rounded-b-xl p-5 shadow-sm">
          
          {/* TAB 1: SPECIFICATIONS & PRICES */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#243044] pb-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Технические характеристики и цены
                </h3>
                <span className="text-xs text-slate-400">
                  Класс: {currentSpecClass?.name || 'Изоляционные материалы'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-[#243044]">
                    <tr className="hover:bg-[#121824]">
                      <td className="py-2 px-3 font-medium text-slate-400 w-1/3">Производитель / Торговая марка</td>
                      <td className="py-2 px-3 text-slate-100 font-semibold">{product.brand}</td>
                    </tr>
                    <tr className="hover:bg-[#121824]">
                      <td className="py-2 px-3 font-medium text-slate-400">Артикул</td>
                      <td className="py-2 px-3 text-slate-100 font-mono text-amber-400 font-bold">{currentVariant.sku}</td>
                    </tr>
                    <tr className="hover:bg-[#121824]">
                      <td className="py-2 px-3 font-medium text-slate-400">Основная цена</td>
                      <td className="py-2 px-3 text-slate-100 font-bold">{currentVariant.price.toLocaleString('ru-RU')} ₽ / {currentVariant.mainUnit}</td>
                    </tr>
                    {currentVariant.secondaryPrice && (
                      <tr className="hover:bg-[#121824]">
                        <td className="py-2 px-3 font-medium text-slate-400">Цена за {currentVariant.secondaryPrice.unit}</td>
                        <td className="py-2 px-3 text-amber-400 font-bold">{currentVariant.secondaryPrice.price.toLocaleString('ru-RU')} ₽ / {currentVariant.secondaryPrice.unit}</td>
                      </tr>
                    )}
                    {currentSpecClass?.fields.map((field) => {
                      const val = product.specs?.[field.id];
                      if (val === undefined) return null;
                      return (
                        <tr key={field.id} className="hover:bg-[#121824]">
                          <td className="py-2 px-3 font-medium text-slate-400">{field.label}</td>
                          <td className="py-2 px-3 text-slate-200">
                            {String(val)} {field.unit}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="hover:bg-[#121824]">
                      <td className="py-2 px-3 font-medium text-slate-400">Вес упаковки/рулона</td>
                      <td className="py-2 px-3 text-slate-200">{currentVariant.weightKg || '—'} кг</td>
                    </tr>
                    <tr className="hover:bg-[#121824]">
                      <td className="py-2 px-3 font-medium text-slate-400">Объем упаковки/рулона</td>
                      <td className="py-2 px-3 text-slate-200">{currentVariant.volumeM3 || '—'} м³</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* All variants and prices table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Сводная таблица модификаций и цен:
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#121824] text-slate-400 border-b border-[#243044]">
                      <tr>
                        <th className="py-2 px-3">Артикул</th>
                        <th className="py-2 px-3">Наименование</th>
                        <th className="py-2 px-3">Цена за упаковку/рулон</th>
                        <th className="py-2 px-3">Цена за метр / м² / ед.</th>
                        <th className="py-2 px-3">Наличие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#243044]">
                      {product.variants.map(v => (
                        <tr key={v.sku} className={`hover:bg-[#121824] ${v.sku === currentVariant.sku ? 'bg-[#141e2c]' : ''}`}>
                          <td className="py-2 px-3 font-mono font-medium text-amber-400">{v.sku}</td>
                          <td className="py-2 px-3 text-slate-200 font-medium">{v.name}</td>
                          <td className="py-2 px-3 text-slate-100 font-bold">{v.price.toLocaleString('ru-RU')} ₽ / {v.mainUnit}</td>
                          <td className="py-2 px-3 text-amber-300 font-medium">
                            {v.secondaryPrice ? `${v.secondaryPrice.price} ₽ / ${v.secondaryPrice.unit}` : v.additionalPrices && v.additionalPrices[0] ? `${v.additionalPrices[0].price} ₽ / ${v.additionalPrices[0].unit}` : '—'}
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-[11px] text-emerald-400 font-medium">
                              {v.stockText || (v.stockStatus === 'in_stock' ? 'В наличии' : 'Под заказ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {product.applications && product.applications.length > 0 && (
                <div className="pt-3 border-t border-[#243044]">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Области применения:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((app, idx) => (
                      <span key={idx} className="bg-[#121824] text-slate-300 border border-[#273449] px-3 py-1 rounded text-xs">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FULL DESCRIPTION */}
          {activeTab === 'desc' && (
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              <div 
                className="space-y-3"
                dangerouslySetInnerHTML={{ __html: product.fullDescriptionHtml }}
              />
            </div>
          )}

          {/* TAB 4: CERTIFICATES */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#243044] pb-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Сертификаты и паспорта качества
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.certificates?.map((cert, idx) => (
                  <div key={idx} className="p-3.5 bg-[#121824] rounded-xl border border-[#273449] flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-100">{cert.name}</div>
                      <div className="text-[11px] text-slate-400">Стандарт: {cert.standard}</div>
                      <div className="text-[10px] font-mono text-slate-500">№ {cert.docNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PICKUP & WAREHOUSE */}
          {activeTab === 'pickup' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="text-sm font-semibold text-slate-100">Условия самовывоза</h3>
              <div className="space-y-2 text-slate-300">
                <p>
                  <strong>Адрес склада:</strong> {company.warehouseAddress}
                </p>
                <p>
                  <strong>Режим работы:</strong> {company.workSchedule.weekdays}
                </p>
                <p>
                  <strong>Телефон кладовщика/менеджера:</strong> {company.mainPhone}
                </p>
                <p className="text-slate-400 text-[11px] pt-2">
                  Отгрузка осуществляется только самовывозом. Погрузка ручная и вилочным погрузчиком (для паллет). При себе необходимо иметь номер заказа или реквизиты плательщика.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-6 border-t border-[#243044] space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Сопутствующие материалы
            </h2>
            <p className="text-xs text-slate-400">
              Часто приобретают вместе
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
