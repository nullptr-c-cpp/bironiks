export interface CompanyRequisites {
  legalName: string;
  shortName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  okpo: string;
  bankName: string;
  bik: string;
  corrAccount: string;
  checkingAccount: string;
  legalAddress: string;
  actualAddress: string;
  generalDirector?: string;
  founder?: string;
  chiefAccountant?: string;
  paymentMethods?: string[];
}

export interface CompanyInfo {
  name: string;
  brand: string;
  tagline: string;
  description: string;
  foundingYear: number;
  mainPhone: string;
  managerPhone: string;
  whatsappPhone: string;
  telegramContact: string;
  vkUrl?: string;
  emailSales: string;
  emailInfo: string;
  warehouseAddress: string;
  managerName?: string;
  managerRole?: string;
  paymentMethods?: string[];
  workSchedule: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  pickupInfo: {
    steps: string[];
    carTypes: string[];
    loadingTime: string;
    guidelines: string;
  };
  requisites: CompanyRequisites;
  yandexMapCoords: [number, number];
  yandexMapUrl: string;
}

export interface SpecField {
  id: string;
  label: string;
  unit?: string;
  type: 'select' | 'number' | 'text';
  filterable: boolean;
  options?: (string | number)[];
}

export interface SpecClass {
  id: string;
  name: string;
  fields: SpecField[];
}

export type StockStatus = 'in_stock' | 'low_stock' | 'on_order';

export interface AdditionalPrice {
  label?: string; // e.g. "Цена за 1 м²", "Цена за 1 пог. м", "Цена за 1 шт", "Цена за 1 кг", "Цена за упаковку"
  price: number; // e.g. 105
  unit: string;  // e.g. "м²", "пог. м", "шт", "кг", "упак.", "рулон", "плита"
}

export interface ProductVariant {
  sku: string;
  name: string;
  price: number; // Основная цена покупки (например за рулон, упаковку, шт, мешок)
  mainUnit: string; // "рулон", "упак.", "коробка", "мешок", "плита", "шт", "трубка (2м)"
  secondaryPrice?: {
    price: number; // Вторая цена (например за 1 метр, за 1 м², за 1 кг, за 1 плиту)
    unit: string; // "м²", "пог. м", "кг", "шт", "плита", "литр"
    label?: string; // "за 1 м²", "за 1 пог. м", "за 1 кг", "за 1 плиту"
  };
  additionalPrices?: AdditionalPrice[]; // Массив дополнительных цен для гибкой настройки
  prices?: AdditionalPrice[]; // Универсальный список цен
  weightKg?: number;
  volumeM3?: number;
  unitCoverage?: {
    unit: string;
    factor: number; // e.g. 1 pack = 5.48 m2
  };
  minOrder: {
    qty: number;
    unit: string;
    step: number;
    note: string;
  };
  stockStatus: StockStatus;
  stockText?: string;
}

export interface CalcConfig {
  type: 'area' | 'length' | 'volume' | 'perimeter' | 'none';
  coveragePerUnit: number;
  unitName: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  specClassId: string;
  collections: string[];
  brand: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  shortDesc: string;
  fullDescriptionHtml: string;
  features: string[];
  specs: Record<string, string | number>;
  calcConfig?: CalcConfig;
  variants: ProductVariant[];
  relatedProductIds?: string[];
  certificates?: {
    name: string;
    standard: string;
    docNumber: string;
    validUntil: string;
  }[];
  applications: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  readTimeMin: number;
  coverImage: string;
  summary: string;
  contentHtml: string;
  linkedProductIds: string[];
  tags: string[];
}

export interface SpecificationItem {
  productId: string;
  productTitle: string;
  productSlug: string;
  sku: string;
  variantName: string;
  categoryName: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
  weightKg?: number;
  volumeM3?: number;
  step: number;
  minQty: number;
}

export interface FilterState {
  search: string;
  category: string;
  collection: string;
  brand: string;
  stockStatus: string;
  minPrice: number;
  maxPrice: number;
  specFilters: Record<string, string | number>;
}
