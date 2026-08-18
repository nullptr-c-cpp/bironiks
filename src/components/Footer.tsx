import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  Download, 
  ShieldCheck, 
  Truck
} from 'lucide-react';
import companyData from '../data/company.json';
import categoriesData from '../data/categories.json';
import productsData from '../data/products.json';
import { CompanyInfo, Product } from '../types';
import { exportCompanyRequisitesPdf, exportFullCatalogPriceListExcel } from '../utils/exportUtils';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const company = companyData as unknown as CompanyInfo;
  const categories = categoriesData.categories;
  const products = productsData as unknown as Product[];

  return (
    <footer className="bg-[#0e131b] text-slate-400 border-t border-[#212b3b] text-xs">
      {/* Upper Info Strip */}
      <div className="border-b border-[#212b3b] py-6 bg-[#131924]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#18202d] border border-[#243044]">
              <div className="p-2 rounded-md bg-[#2d2214] text-amber-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-xs">Склад в Омске (самовывоз)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ул. 20 лет РККА, д. 183Б, офис 3. Быстрая комплектация и отгрузка.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#18202d] border border-[#243044]">
              <div className="p-2 rounded-md bg-[#162b20] text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-xs">Способы оплаты</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Наличный расчет, безналичный через банк, оплата по QR-коду.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#18202d] border border-[#243044]">
              <div className="p-2 rounded-md bg-[#2b2416] text-amber-300">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-xs">ООО «БИРОНИКС» (ИНН 5504217210)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Прямые поставки изоляционных материалов со склада в Омске.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-3">
            <div 
              onClick={() => onNavigate('/')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                БИРОНИКС
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {company.description}
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => exportCompanyRequisitesPdf(company)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors text-left"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Скачать реквизиты (.PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => exportFullCatalogPriceListExcel(products, company)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors text-left"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Скачать весь прайс (.XLSX)</span>
              </button>
            </div>
          </div>

          {/* Column 2: Catalog Sections */}
          <div>
            <h3 className="text-slate-100 font-semibold text-xs mb-3 border-l-2 border-amber-600 pl-2">
              Каталог материалов
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/catalog?category=${cat.id}`)}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation & Tools */}
          <div>
            <h3 className="text-slate-100 font-semibold text-xs mb-3 border-l-2 border-amber-600 pl-2">
              Информация
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button type="button" onClick={() => onNavigate('/logistics')} className="hover:text-amber-400 transition-colors">
                  Склад и самовывоз
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/news')} className="hover:text-amber-400 transition-colors">
                  Полезные статьи
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/contacts')} className="hover:text-amber-400 transition-colors">
                  Контакты и реквизиты
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/sitemap')} className="hover:text-amber-400 transition-colors">
                  Карта сайта
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Warehouse & Contacts */}
          <div className="space-y-2.5 text-[11px]">
            <h3 className="text-slate-100 font-semibold text-xs mb-3 border-l-2 border-amber-600 pl-2">
              Склад в Омске
            </h3>
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <a href={`tel:${company.mainPhone.replace(/[^+\d]/g, '')}`} className="text-white font-semibold hover:text-amber-400">
                  {company.mainPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <a href={`mailto:${company.emailSales}`} className="text-slate-300 hover:text-white">
                {company.emailSales}
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <span className="text-slate-300">{company.warehouseAddress}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-slate-300">
                <div>{company.workSchedule.weekdays}</div>
                <div>{company.workSchedule.saturday}</div>
              </div>
            </div>
            <div className="pt-1">
              <a
                href="https://vk.com/bironiks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:underline"
              >
                <span>Группа ВКонтакте: vk.com/bironiks</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-8 pt-4 border-t border-[#212b3b] flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {company.requisites.legalName}. Только самовывоз со склада.
          </div>
          <div className="flex items-center gap-3">
            <span>ИНН {company.requisites.inn}</span>
            <span>•</span>
            <span>ОГРН {company.requisites.ogrn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
