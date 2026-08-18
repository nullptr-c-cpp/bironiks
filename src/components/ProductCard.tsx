import React, { useState } from 'react';
import { ShoppingCart, Check, Package, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useSpecification } from '../context/SpecificationContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addItem } = useSpecification();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const currentVariant: ProductVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, currentVariant, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const getStockBadge = (status: string, text?: string) => {
    if (status === 'in_stock') {
      return (
        <span className="text-[11px] font-medium bg-[#142920] text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/40">
          {text || 'В наличии'}
        </span>
      );
    }
    if (status === 'low_stock') {
      return (
        <span className="text-[11px] font-medium bg-[#2e2312] text-amber-300 px-2 py-0.5 rounded border border-amber-700/40">
          {text || 'В наличии мало'}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium bg-[#1c2432] text-slate-300 px-2 py-0.5 rounded border border-slate-700/60">
        {text || 'Под заказ'}
      </span>
    );
  };

  return (
    <div className="bg-[#18202d] border border-[#273449] hover:border-slate-500/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200">
      {/* Product Image & Badges */}
      <div 
        onClick={() => onNavigate(`/catalog/${product.slug}`)}
        className="relative h-52 bg-[#121722] overflow-hidden cursor-pointer border-b border-[#243044]"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="text-[11px] font-medium bg-[#121824]/90 text-amber-400 px-2.5 py-0.5 rounded border border-[#2d3b52]">
            {product.brand}
          </span>
          {getStockBadge(currentVariant.stockStatus, currentVariant.stockText)}
        </div>

        {/* SKU tag */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[11px] font-mono text-slate-300 bg-[#121824]/90 px-2 py-0.5 rounded border border-[#2d3b52]">
            Арт: {currentVariant.sku}
          </span>
        </div>
      </div>

      {/* Card Body with Increased Whitespace */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">
            {product.categoryName}
          </div>

          <h3 
            onClick={() => onNavigate(`/catalog/${product.slug}`)}
            className="text-[15px] font-semibold text-slate-100 hover:text-amber-400 cursor-pointer transition-colors line-clamp-2 leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Variant Selector */}
        <div className="pt-3 border-t border-[#243044] space-y-2">
          {product.variants.length > 1 ? (
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-medium">
                Размер / Модификация:
              </label>
              <select
                value={selectedVariantIndex}
                onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                className="w-full bg-[#131924] border border-[#2d3c52] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 transition-colors"
              >
                {product.variants.map((variant, idx) => {
                  let subPrice = '';
                  if (variant.secondaryPrice) {
                    subPrice = ` (${variant.secondaryPrice.price} ₽/${variant.secondaryPrice.unit})`;
                  } else if (variant.unitCoverage) {
                    subPrice = ` (~${(variant.price / variant.unitCoverage.factor).toFixed(0)} ₽/${variant.unitCoverage.unit})`;
                  }
                  return (
                    <option key={variant.sku} value={idx}>
                      {variant.name} — {variant.price.toLocaleString('ru-RU')} ₽ / {variant.mainUnit}{subPrice}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <div className="text-xs text-slate-300 font-medium flex items-center gap-2 py-1">
              <Package className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{currentVariant.name}</span>
            </div>
          )}

          {currentVariant.minOrder?.note && (
            <div className="text-[11px] text-slate-400 bg-[#121824] px-2.5 py-1 rounded border border-[#232f42]">
              {currentVariant.minOrder.note}
            </div>
          )}
        </div>

        {/* Pricing and Action */}
        <div className="pt-3.5 border-t border-[#243044] space-y-3.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-100">
                {currentVariant.price.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-xs text-slate-400">
                / {currentVariant.mainUnit}
              </span>
            </div>

            {/* Secondary unit price (e.g. per m², per meter, per kg, per piece) */}
            {currentVariant.secondaryPrice ? (
              <div className="text-xs text-amber-400 font-semibold bg-[#121824] px-2 py-0.5 rounded border border-[#2d3b50]">
                {currentVariant.secondaryPrice.price.toLocaleString('ru-RU')} ₽ / {currentVariant.secondaryPrice.unit}
              </div>
            ) : currentVariant.additionalPrices && currentVariant.additionalPrices.length > 0 ? (
              <div className="text-xs text-amber-400 font-semibold bg-[#121824] px-2 py-0.5 rounded border border-[#2d3b50]">
                {currentVariant.additionalPrices[0].price.toLocaleString('ru-RU')} ₽ / {currentVariant.additionalPrices[0].unit}
              </div>
            ) : currentVariant.unitCoverage ? (
              <span className="text-[11px] text-slate-400">
                (~{(currentVariant.price / currentVariant.unitCoverage.factor).toFixed(0)} ₽/{currentVariant.unitCoverage.unit})
              </span>
            ) : null}
          </div>

          {/* Quantity and Add Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#131924] border border-[#2d3c52] rounded-lg p-0.5 w-24">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(currentVariant.minOrder.qty, prev - currentVariant.minOrder.step))}
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1e2738] rounded text-sm font-semibold transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || currentVariant.minOrder.qty;
                  setQuantity(Math.max(currentVariant.minOrder.qty, val));
                }}
                className="w-8 bg-transparent text-center text-xs font-semibold text-slate-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + currentVariant.minOrder.step)}
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1e2738] rounded text-sm font-semibold transition-colors"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-colors ${
                isAddedRecently
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Добавлено</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>В заказ</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(`/catalog/${product.slug}`)}
            className="w-full text-center text-[11px] text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-1 pt-0.5"
          >
            <span>Характеристики и цены</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
