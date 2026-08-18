import React from 'react';
import { MapPin, Clock, Box, FileText, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import companyData from '../data/company.json';
import { CompanyInfo } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { exportCompanyRequisitesPdf } from '../utils/exportUtils';

interface LogisticsPageProps {
  onNavigate: (path: string) => void;
}

export const LogisticsPage: React.FC<LogisticsPageProps> = ({ onNavigate }) => {
  const company = companyData as unknown as CompanyInfo;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[{ label: 'Самовывоз и склад' }]}
        onNavigate={onNavigate}
      />

      <div className="border-b border-[#243044] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#18202d] text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold border border-[#273449] mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Пункт самовывоза продукции</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Склад и правила самовывоза
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Отгрузка всех строительных и изоляционных материалов осуществляется <strong>исключительно путем самовывоза</strong> с нашего склада в Омске.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportCompanyRequisitesPdf(company)}
          className="px-4 py-2 bg-[#18202d] hover:bg-[#1f2a3c] text-slate-200 border border-[#273449] text-xs font-medium rounded-lg flex items-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Карточка с реквизитами (.PDF)</span>
        </button>
      </div>

      {/* Warehouse Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#2b2214] text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">График отгрузки</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {company.workSchedule.weekdays}<br />
            {company.workSchedule.saturday}<br />
            {company.workSchedule.sunday}
          </p>
        </div>

        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#102619] text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Удобный подъезд</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Бесплатный въезд на территорию складского комплекса. Подъезд для легковых авто, Газелей, фургонов и грузового транспорта.
          </p>
        </div>

        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#122234] text-sky-400 flex items-center justify-center">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Погрузка материалов</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ручная погрузка розничных заказов и механизированная погрузка паллет вилочным погрузчиком.
          </p>
        </div>
      </div>

      {/* Pickup Steps */}
      <div className="bg-[#18202d] border border-[#273449] rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-100">
          Порядок оформления и получения заказа:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#121824] rounded-lg border border-[#243044] space-y-1.5">
            <div className="text-amber-400 font-semibold text-sm">Шаг 1. Оформление</div>
            <p className="text-slate-300">
              Сформируйте заказ на сайте или свяжитесь с сотрудником по телефону <strong className="text-white">{company.mainPhone}</strong> для согласования нужного количества.
            </p>
          </div>

          <div className="p-4 bg-[#121824] rounded-lg border border-[#243044] space-y-1.5">
            <div className="text-amber-400 font-semibold text-sm">Шаг 2. Подтверждение</div>
            <p className="text-slate-300">
              Сотрудник подтверждает бронь товара на складе и ориентировочное время вашего приезда.
            </p>
          </div>

          <div className="p-4 bg-[#121824] rounded-lg border border-[#243044] space-y-1.5">
            <div className="text-amber-400 font-semibold text-sm">Шаг 3. Получение</div>
            <p className="text-slate-300">
              Приезжаете на склад ({company.warehouseAddress}), производите оплату (или забираете по оплаченному счету) и загружаете материал.
            </p>
          </div>
        </div>
      </div>

      {/* Warehouse Address & Coordinates */}
      <div className="bg-[#18202d] border border-[#273449] rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Адрес склада самовывоза</h2>
            <p className="text-xs text-slate-300 mt-1">{company.warehouseAddress}</p>
            <p className="text-xs text-slate-400 mt-0.5">Телефон для связи перед выездом: <span className="text-amber-400 font-medium">{company.mainPhone}</span></p>
          </div>
          <a
            href={company.yandexMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-sm"
          >
            <span>Открыть в Яндекс.Картах</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
