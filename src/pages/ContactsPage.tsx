import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  Download, 
  Send, 
  Check, 
  Copy,
  ExternalLink,
  CreditCard,
  UserCheck,
  Globe
} from 'lucide-react';
import companyData from '../data/company.json';
import { CompanyInfo } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { exportCompanyRequisitesPdf } from '../utils/exportUtils';

interface ContactsPageProps {
  onNavigate: (path: string) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ onNavigate }) => {
  const company = companyData as unknown as CompanyInfo;
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Контакты и реквизиты' }]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="border-b border-[#243044] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#18202d] text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold border border-[#273449] mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>ООО «БИРОНИКС» • г. Омск</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Карточка компании и реквизиты
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Официальные реквизиты, контактные данные, склад в Омске и варианты оплаты.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportCompanyRequisitesPdf(company)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-2 self-start md:self-auto transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Скачать реквизиты (.PDF)</span>
        </button>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#2b2214] text-amber-400 flex items-center justify-center mb-3">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Телефон для заявок</h3>
          <p className="text-xs text-slate-400">Склад и отдел отгрузок</p>
          <div className="pt-1">
            <a 
              href={`tel:${company.mainPhone.replace(/[^+\d]/g, '')}`} 
              className="text-base font-bold text-slate-100 hover:text-amber-400"
            >
              {company.mainPhone}
            </a>
          </div>
        </div>

        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#102619] text-emerald-400 flex items-center justify-center mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Электронная почта</h3>
          <p className="text-xs text-slate-400">Для заявок и выставления счетов</p>
          <div className="pt-1">
            <a 
              href={`mailto:${company.emailSales}`} 
              className="text-base font-semibold text-amber-400 hover:underline"
            >
              {company.emailSales}
            </a>
          </div>
        </div>

        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#122234] text-sky-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Режим работы</h3>
          <div className="text-xs text-slate-300 space-y-0.5 pt-1">
            <div>{company.workSchedule.weekdays}</div>
            <div>{company.workSchedule.saturday}</div>
            <div className="text-slate-500">{company.workSchedule.sunday}</div>
          </div>
        </div>

        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#27182e] text-purple-400 flex items-center justify-center mb-3">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Соцсети и сообщество</h3>
          <p className="text-xs text-slate-400">Новости и ассортимент</p>
          <div className="pt-1">
            <a 
              href="https://vk.com/bironiks" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>vk.com/bironiks</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Company Status & Payment Methods Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-slate-100 font-semibold text-sm border-b border-[#243044] pb-2.5">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Статус и профиль организации</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#243044]/60">
              <span className="text-slate-400">Организационная форма:</span>
              <span className="font-semibold text-slate-100">{company.requisites.legalName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Работа с клиентами:</span>
              <span className="font-semibold text-slate-100">Физлица, ИП, строительные и оптовые компании</span>
            </div>
          </div>
        </div>

        <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-slate-100 font-semibold text-sm border-b border-[#243044] pb-2.5">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Способы оплаты</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <span className="px-3 py-1.5 bg-[#121824] border border-[#273449] rounded-lg text-slate-200">
              💵 Наличный расчёт
            </span>
            <span className="px-3 py-1.5 bg-[#121824] border border-[#273449] rounded-lg text-slate-200">
              🏛️ Безналичный расчёт через банк
            </span>
            <span className="px-3 py-1.5 bg-[#121824] border border-[#273449] rounded-lg text-slate-200">
              📱 Оплата по QR-коду
            </span>
          </div>
        </div>
      </div>

      {/* Warehouse & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Warehouse Access Specs */}
        <div className="lg:col-span-7 bg-[#18202d] border border-[#273449] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#243044]">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Адрес склада и пункта самовывоза
            </h2>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 bg-[#121824] rounded-lg border border-[#243044] space-y-1">
              <span className="text-slate-400 block text-[11px]">Юридический и фактический адрес:</span>
              <p className="text-slate-100 font-medium">{company.warehouseAddress}</p>
            </div>

            <div className="p-3.5 bg-[#121824] rounded-lg border border-[#243044] space-y-1">
              <span className="text-slate-400 block text-[11px]">Складской самовывоз:</span>
              <p className="text-slate-300 leading-relaxed">
                Бесплатный асфальтированный въезд прямо к складским воротам в Омске. Пожалуйста, перед приездом оформите заказ на сайте или согласуйте номенклатуру по телефону {company.mainPhone}, чтобы мы заблаговременно укомплектовали товар к погрузке.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={company.yandexMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121824] hover:bg-[#1a2332] text-slate-200 text-xs font-medium rounded-lg border border-[#273449] transition-colors"
            >
              <span>Посмотреть склад на Яндекс.Картах</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-5 bg-[#18202d] border border-[#273449] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-[#243044] pb-3">
            <h2 className="text-base font-semibold text-slate-100">Быстрая заявка</h2>
            <p className="text-xs text-slate-400">Напишите нам для расчета стоимости или выставления счета</p>
          </div>

          {isSubmitted ? (
            <div className="p-5 bg-[#102619] border border-emerald-500/50 rounded-lg text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-slate-100 font-semibold text-sm">Заявка отправлена!</div>
              <p className="text-xs text-emerald-200">
                Мы свяжемся с вами в ближайшее рабочее время.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ваше имя или организация *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ваше имя / ООО «Организация»"
                  className="w-full bg-[#121824] border border-[#2b394e] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Телефон *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-[#121824] border border-[#2b394e] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mail@example.ru"
                    className="w-full bg-[#121824] border border-[#2b394e] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Сообщение или перечень материалов</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Необходим XPS 50мм (10 упаковок), пена MARCON (6 баллонов)..."
                  className="w-full bg-[#121824] border border-[#2b394e] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Отправка...' : 'Отправить заявку'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Company Requisites Table */}
      <div className="bg-[#18202d] border border-[#273449] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#243044] pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Полные реквизиты ООО «БИРОНИКС»</h2>
            <p className="text-xs text-slate-400">Для оформления счетов, договоров и спецификаций</p>
          </div>
          <button
            type="button"
            onClick={() => exportCompanyRequisitesPdf(company)}
            className="px-3.5 py-1.5 bg-[#121824] hover:bg-[#1a2332] border border-[#273449] text-slate-200 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Скачать карточку предприятия (.PDF)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-2.5">
            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Полное наименование:</span>
                <span className="font-semibold text-slate-100">{company.requisites.legalName}</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(company.requisites.legalName, 'name')}
                className="p-1 text-slate-400 hover:text-white"
                title="Копировать"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">ИНН / КПП:</span>
                <span className="font-mono font-semibold text-amber-400">{company.requisites.inn} / {company.requisites.kpp}</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(`${company.requisites.inn}`, 'inn')}
                className="p-1 text-slate-400 hover:text-white"
                title="Копировать ИНН"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">ОГРН:</span>
                <span className="font-mono font-semibold text-slate-200">{company.requisites.ogrn}</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(company.requisites.ogrn, 'ogrn')}
                className="p-1 text-slate-400 hover:text-white"
                title="Копировать ОГРН"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">ОКПО:</span>
                <span className="font-mono font-semibold text-slate-200">{company.requisites.okpo}</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(company.requisites.okpo, 'okpo')}
                className="p-1 text-slate-400 hover:text-white"
                title="Копировать ОКПО"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Банк:</span>
                <span className="font-semibold text-slate-100">{company.requisites.bankName} (БИК {company.requisites.bik})</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(company.requisites.bankName, 'bank')}
                className="p-1 text-slate-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Расчетный счет:</span>
                <span className="font-mono font-semibold text-slate-200">{company.requisites.checkingAccount}</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(company.requisites.checkingAccount, 'acc')}
                className="p-1 text-slate-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Корр. счет:</span>
                <span className="font-mono font-semibold text-slate-200">{company.requisites.corrAccount}</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(company.requisites.corrAccount, 'corr')}
                className="p-1 text-slate-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-[#121824] rounded-lg border border-[#243044] flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Юридический / Фактический адрес:</span>
                <span className="text-slate-200 font-medium">{company.warehouseAddress}</span>
              </div>
              <button 
                type="button"
                onClick={() => handleCopy(company.warehouseAddress, 'addr')}
                className="p-1 text-slate-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {copiedField && (
          <div className="text-xs text-emerald-400 font-semibold text-right">
            ✓ Реквизит скопирован в буфер обмена
          </div>
        )}
      </div>

    </div>
  );
};
