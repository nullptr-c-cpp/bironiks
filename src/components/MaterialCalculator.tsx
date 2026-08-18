import React, { useState } from 'react';
import { Calculator, Check, ShoppingCart, Info } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useSpecification } from '../context/SpecificationContext';

interface MaterialCalculatorProps {
  product: Product;
  selectedVariant: ProductVariant;
}

export const MaterialCalculator: React.FC<MaterialCalculatorProps> = ({
  product,
  selectedVariant
}) => {
  const { addItem } = useSpecification();
  const [targetValue, setTargetValue] = useState<number>(30);
  const [marginPercent, setMarginPercent] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);

  // Coverage of 1 unit of this variant or product
  const coveragePerUnit =
    selectedVariant.unitCoverage?.factor ||
    product.calcConfig?.coveragePerUnit ||
    1;
  const unitName = product.calcConfig?.unitName || 'м²';

  // Calculations
  const effectiveNeed = targetValue * (1 + marginPercent / 100);
  const unitsNeeded = Math.max(1, Math.ceil(effectiveNeed / coveragePerUnit));
  const totalCoverageProvided = unitsNeeded * coveragePerUnit;
  const leftover = Math.max(0, totalCoverageProvided - targetValue);
  const totalCost = unitsNeeded * selectedVariant.price;

  const handleAddCalculated = () => {
    addItem(product, selectedVariant, unitsNeeded);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#243044]">
        <div className="w-8 h-8 rounded-lg bg-[#2b2214] text-amber-400 flex items-center justify-center">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Калькулятор расчета для этого товара
          </h3>
          <p className="text-xs text-slate-400">
            {product.calcConfig?.description || `Рассчитайте необходимое количество (${unitName})`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Input Parameters */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Сколько вам нужно ({unitName}):
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={targetValue || ''}
                onChange={(e) => setTargetValue(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-[#121824] border border-[#2b394e] rounded-lg px-3.5 py-2 text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3.5 top-2 text-xs font-medium text-slate-400">
                {unitName}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              В 1 {selectedVariant.mainUnit} = {coveragePerUnit} {unitName}
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Запас на подрезку и нахлест:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: 0, label: 'Без запаса' },
                { val: 5, label: '+5%' },
                { val: 10, label: '+10%' },
                { val: 15, label: '+15%' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setMarginPercent(opt.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    marginPercent === opt.val
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-[#121824] text-slate-300 border-[#273449] hover:border-slate-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#121824] border border-[#243044] text-slate-400 text-[11px] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-medium">Модификация: </span>
              {selectedVariant.name}
            </div>
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="bg-[#121824] border border-[#243044] rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5 text-xs">
            <div className="text-slate-400 font-medium text-[11px] uppercase tracking-wide border-b border-[#243044] pb-1.5">
              Итог расчета
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Нужно упаковок / штук:</span>
              <span className="text-base font-bold text-amber-400">
                {unitsNeeded} {selectedVariant.mainUnit}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Хватит на:</span>
              <span className="text-slate-200 font-medium">
                {totalCoverageProvided.toFixed(1)} {unitName}
                {leftover > 0 && ` (с запасом +${leftover.toFixed(1)} ${unitName})`}
              </span>
            </div>

            <div className="pt-2 border-t border-[#243044] flex items-baseline justify-between">
              <div>
                <span className="text-slate-500 text-[11px] block">Итоговая стоимость:</span>
                <span className="text-lg font-bold text-slate-100">
                  {totalCost.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {selectedVariant.price.toLocaleString('ru-RU')} ₽ / {selectedVariant.mainUnit}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddCalculated}
            className={`w-full py-2.5 px-3 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Добавлено {unitsNeeded} {selectedVariant.mainUnit} в заявку</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Добавить {unitsNeeded} {selectedVariant.mainUnit} в заявку</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
