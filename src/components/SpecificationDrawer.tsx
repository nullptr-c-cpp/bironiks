import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Download, 
  FileText, 
  Send, 
  Check, 
  Building, 
  Scale, 
  Box, 
  ShoppingBag,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useSpecification } from '../context/SpecificationContext';
import companyData from '../data/company.json';
import { CompanyInfo } from '../types';
import { exportSpecificationToExcel, exportSpecificationToPdf } from '../utils/exportUtils';

interface SpecificationDrawerProps {
  onNavigate?: (path: string) => void;
}

export const SpecificationDrawer: React.FC<SpecificationDrawerProps> = ({ onNavigate }) => {
  const { 
    items, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeItem, 
    clearSpecification,
    totalSum,
    totalWeightKg,
    totalVolumeM3
  } = useSpecification();

  const company = companyData as unknown as CompanyInfo;

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientInn, setClientInn] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isDrawerOpen) return null;

  const handleExportExcel = () => {
    if (items.length === 0) return;
    exportSpecificationToExcel(items, company, clientName || 'Заказчик');
  };

  const handleExportPdf = () => {
    if (items.length === 0) return;
    exportSpecificationToPdf(items, company, clientName || 'Заказчик');
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone && !clientEmail) {
      alert('Пожалуйста, укажите телефон или E-mail для связи.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      setTimeout(() => {
        setIsSubmittedSuccess(false);
      }, 5000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/80 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#141b26] border-l border-[#243044] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#243044] bg-[#101520] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#2b2214] text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Мой заказ / Спецификация</h2>
                <p className="text-xs text-slate-400">
                  Самовывоз со склада ООО «БИРОНИКС»
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white bg-[#18202d] border border-[#273449] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#18202d] border border-[#273449] flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="text-slate-300 font-medium">Ваш заказ пока пуст</div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Выберите нужные материалы в каталоге и добавьте их в заказ.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (onNavigate) onNavigate('/catalog');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg shadow-sm"
                >
                  <span>Перейти в каталог</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Pickup Info Banner */}
                <div className="p-3 bg-[#101520] rounded-xl border border-[#243044] flex items-start gap-2.5 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-100">Пункт самовывоза: </span>
                    <span>{company.warehouseAddress}. Выдача заказов Пн-Пт 9:00-18:00.</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#243044] pb-2">
                    <span>Позиций в заказе: {items.length}</span>
                    <button
                      type="button"
                      onClick={clearSpecification}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Очистить заказ</span>
                    </button>
                  </div>

                  {items.map((item) => {
                    const itemSum = item.price * item.quantity;
                    return (
                      <div
                        key={item.sku}
                        className="bg-[#18202d] border border-[#273449] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productTitle}
                            className="w-12 h-12 object-cover rounded-lg bg-[#101520] flex-shrink-0"
                          />
                          <div>
                            <div className="text-xs font-semibold text-slate-100 line-clamp-1">
                              {item.productTitle}
                            </div>
                            <div className="text-[11px] text-amber-400 font-medium">
                              {item.variantName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              Арт: {item.sku} • {item.price.toLocaleString('ru-RU')} ₽ / {item.unit}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#243044]">
                          {/* Stepper */}
                          <div className="flex items-center bg-[#101520] border border-[#2b394e] rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.sku, item.quantity - item.step)}
                              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.sku, item.quantity + item.step)}
                              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Sum */}
                          <div className="text-right min-w-[85px]">
                            <div className="text-xs font-bold text-slate-100">
                              {itemSum.toLocaleString('ru-RU')} ₽
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.quantity} {item.unit}
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.sku)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Weight and Volume */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#101520] rounded-xl border border-[#243044] text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Вес для погрузки: <strong className="text-slate-200">~{totalWeightKg.toFixed(1)} кг</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Box className="w-4 h-4 text-amber-300" />
                    <span>Объем: <strong className="text-slate-200">~{totalVolumeM3.toFixed(2)} м³</strong></span>
                  </div>
                </div>

                {/* Contact form */}
                <div className="bg-[#101520] border border-[#243044] rounded-xl p-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>Контакты для подтверждения и бронирования:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Ваше имя / Организация"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-[#18202d] border border-[#2b394e] rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="ИНН (для юр. лиц при оплате по счету)"
                      value={clientInn}
                      onChange={(e) => setClientInn(e.target.value)}
                      className="bg-[#18202d] border border-[#2b394e] rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон для связи *"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="bg-[#18202d] border border-[#2b394e] rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="email"
                      placeholder="E-mail (для копии заказа)"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="bg-[#18202d] border border-[#2b394e] rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-slate-400">Скачать список товаров:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleExportExcel}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-[#18202d] hover:bg-[#202c3d] border border-[#273449] text-slate-200 font-medium text-xs rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>В Excel (.XLSX)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportPdf}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-[#18202d] hover:bg-[#202c3d] border border-[#273449] text-slate-200 font-medium text-xs rounded-xl transition-colors"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>В PDF</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#243044] bg-[#101520] space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">
                    Итоговая сумма заказа:
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    {totalSum.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>Позиций: {items.length}</div>
                </div>
              </div>

              {isSubmittedSuccess ? (
                <div className="p-3 bg-[#102418] border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Заявка принята! Специалист свяжется с вами для подтверждения наличия и времени самовывоза.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuote}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Отправка...' : 'Отправить заявку на самовывоз'}</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
