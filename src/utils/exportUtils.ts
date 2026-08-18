import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CompanyInfo, SpecificationItem, Product } from '../types';

// Augment jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function exportSpecificationToExcel(
  items: SpecificationItem[],
  company: CompanyInfo,
  clientName: string = 'Заказчик'
) {
  const wb = XLSX.utils.book_new();

  const totalSum = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalWeight = items.reduce((sum, item) => sum + (item.weightKg || 0) * item.quantity, 0);
  const totalVolume = items.reduce((sum, item) => sum + (item.volumeM3 || 0) * item.quantity, 0);

  const rows: (string | number)[][] = [
    ['ЗАКАЗ МАТЕРИАЛОВ (САМОВЫВОЗ СО СКЛАДА В ОМСКЕ)'],
    [`Поставщик: ${company.requisites.legalName}`],
    [`ИНН/КПП: ${company.requisites.inn} / ${company.requisites.kpp} | ОГРН: ${company.requisites.ogrn}`],
    [`Тел.: ${company.mainPhone} | Email: ${company.emailSales}`],
    [`Склад самовывоза: ${company.warehouseAddress}`],
    [`Заказчик: ${clientName}`],
    [`Дата: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`],
    [],
    ['№', 'Артикул', 'Наименование товара', 'Модификация', 'Кол-во', 'Ед. изм.', 'Цена за ед., руб.', 'Сумма, руб.', 'Вес, кг', 'Объем, м³']
  ];

  items.forEach((item, index) => {
    const rowSum = item.price * item.quantity;
    const rowWeight = (item.weightKg || 0) * item.quantity;
    const rowVolume = (item.volumeM3 || 0) * item.quantity;

    rows.push([
      index + 1,
      item.sku,
      item.productTitle,
      item.variantName,
      item.quantity,
      item.unit,
      item.price,
      rowSum,
      Number(rowWeight.toFixed(2)),
      Number(rowVolume.toFixed(3))
    ]);
  });

  rows.push([]);
  rows.push(['', '', '', 'ИТОГО К ОПЛАТЕ:', items.reduce((s, i) => s + i.quantity, 0), 'ед.', '', totalSum, Number(totalWeight.toFixed(2)), Number(totalVolume.toFixed(3))]);
  rows.push([]);
  rows.push(['Условия получения:', 'Самовывоз со склада Поставщика в г. Омск.']);
  rows.push(['Способы оплаты:', 'Наличный расчёт, безналичный расчёт через банк, оплата по QR-коду']);
  rows.push(['Контакты:', `${company.mainPhone}, ${company.emailSales}`]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 5 },
    { wch: 18 },
    { wch: 42 },
    { wch: 32 },
    { wch: 10 },
    { wch: 10 },
    { wch: 16 },
    { wch: 16 },
    { wch: 12 },
    { wch: 12 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Заказ БИРОНИКС');
  const filename = `Заказ_БИРОНИКС_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportFullCatalogPriceListExcel(products: Product[], company: CompanyInfo) {
  const wb = XLSX.utils.book_new();

  const rows: (string | number)[][] = [
    ['ПРАЙС-ЛИСТ ПРОДУКЦИИ ООО «БИРОНИКС»'],
    [`Поставщик: ${company.requisites.legalName}`],
    [`ИНН: ${company.requisites.inn} | Тел: ${company.mainPhone} | Email: ${company.emailSales}`],
    [`Склад: ${company.warehouseAddress}`],
    [`Дата: ${new Date().toLocaleDateString('ru-RU')}`],
    [],
    ['Категория', 'Артикул', 'Наименование товара', 'Модификация', 'Основная ед. изм.', 'Цена (руб.)', 'Цена за метр / м² / ед.', 'Наличие', 'Примечание к заказу']
  ];

  products.forEach(product => {
    product.variants.forEach(variant => {
      let secondaryPriceText = '';
      if (variant.secondaryPrice) {
        secondaryPriceText = `${variant.secondaryPrice.price} руб. / ${variant.secondaryPrice.unit}`;
      } else if (variant.additionalPrices && variant.additionalPrices.length > 0) {
        secondaryPriceText = `${variant.additionalPrices[0].price} руб. / ${variant.additionalPrices[0].unit}`;
      }

      rows.push([
        product.categoryName,
        variant.sku,
        product.title,
        variant.name,
        variant.mainUnit,
        variant.price,
        secondaryPriceText,
        variant.stockText || (variant.stockStatus === 'in_stock' ? 'В наличии' : variant.stockStatus === 'low_stock' ? 'В наличии мало' : 'Под заказ'),
        variant.minOrder?.note || ''
      ]);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 38 },
    { wch: 32 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
    { wch: 18 },
    { wch: 35 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Прайс-лист БИРОНИКС');
  XLSX.writeFile(wb, `Прайс-лист_БИРОНИКС_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportSpecificationToPdf(
  items: SpecificationItem[],
  company: CompanyInfo,
  clientName: string = 'Заказчик'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const totalSum = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalWeight = items.reduce((sum, item) => sum + (item.weightKg || 0) * item.quantity, 0);
  const totalVolume = items.reduce((sum, item) => sum + (item.volumeM3 || 0) * item.quantity, 0);

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 595, 75, 'F');

  doc.setFillColor(217, 119, 6);
  doc.rect(0, 72, 595, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('ТОРГОВАЯ ФИРМА ООО «БИРОНИКС»', 30, 34);

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Поставки строительной и технической изоляции со склада в Омске', 30, 50);
  doc.text(`Тел: ${company.mainPhone}  |  Email: ${company.emailSales}`, 30, 64);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.text('СПЕЦИФИКАЦИЯ К ЗАКАЗУ (САМОВЫВОЗ В ОМСКЕ)', 30, 105);

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Поставщик: ${company.requisites.legalName} (ИНН: ${company.requisites.inn}, ОГРН: ${company.requisites.ogrn})`, 30, 122);
  doc.text(`Склад самовывоза: ${company.warehouseAddress}`, 30, 134);
  doc.text(`Заказчик: ${clientName}`, 30, 146);
  doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 30, 158);

  // Table
  const tableData = items.map((item, idx) => {
    const sum = item.price * item.quantity;
    return [
      idx + 1,
      item.sku,
      `${item.productTitle}\n(${item.variantName})`,
      item.quantity,
      item.unit,
      `${item.price.toLocaleString('ru-RU')} р.`,
      `${sum.toLocaleString('ru-RU')} р.`
    ];
  });

  doc.autoTable({
    startY: 170,
    head: [['№', 'Артикул', 'Наименование и размер', 'Кол-во', 'Ед.', 'Цена, руб', 'Сумма, руб']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [15, 23, 42],
      lineColor: [226, 232, 240]
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 22, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 230 },
      3: { cellWidth: 42, halign: 'center' },
      4: { cellWidth: 40, halign: 'center' },
      5: { cellWidth: 65, halign: 'right' },
      6: { cellWidth: 65, halign: 'right', fontStyle: 'bold' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  // Summary box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(330, finalY, 235, 65, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(330, finalY, 235, 65, 4, 4, 'D');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Расчетный вес: ~${totalWeight.toFixed(1)} кг`, 340, finalY + 18);
  doc.text(`Расчетный объем: ~${totalVolume.toFixed(2)} м³`, 340, finalY + 32);

  doc.setFontSize(11);
  doc.setTextColor(217, 119, 6);
  doc.text(`ИТОГО: ${totalSum.toLocaleString('ru-RU')} руб.`, 340, finalY + 52);

  doc.save(`Заказ_БИРОНИКС_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportCompanyRequisitesPdf(company: CompanyInfo) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 595, 75, 'F');
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 72, 595, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('КАРТОЧКА ПРЕДПРИЯТИЯ И РЕКВИЗИТЫ', 30, 36);
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(`${company.name}  |  Тел: ${company.mainPhone}  |  Email: ${company.emailSales}`, 30, 54);

  const req = company.requisites;
  const rows: (string | undefined)[][] = [
    ['Полное наименование', req.legalName],
    ['Сокращенное наименование', req.shortName],
    ['ИНН / КПП', `${req.inn} / ${req.kpp}`],
    ['ОГРН', req.ogrn],
    ['ОКПО', req.okpo],
    ['Банк', req.bankName],
    ['БИК', req.bik],
    ['Корреспондентский счет', req.corrAccount],
    ['Расчетный счет', req.checkingAccount],
    ['Юридический / Фактический адрес', req.legalAddress],
    ['Склад самовывоза', company.warehouseAddress],
    ['Способы оплаты', req.paymentMethods?.join(', ') || 'Наличный расчёт, безналичный расчёт через банк, оплата по QR-коду'],
    ['Сайты и соцсети', company.vkUrl ? `ВКонтакте: ${company.vkUrl}` : 'vk.com/bironiks'],
    ['Режим работы', `${company.workSchedule.weekdays}, ${company.workSchedule.saturday}`]
  ];

  doc.autoTable({
    startY: 95,
    head: [['Параметр', 'Значение реквизита']],
    body: rows,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 170, fontStyle: 'bold', fillColor: [248, 250, 252] },
      1: { cellWidth: 365 }
    }
  });

  doc.save(`Реквизиты_ООО_БИРОНИКС.pdf`);
}
