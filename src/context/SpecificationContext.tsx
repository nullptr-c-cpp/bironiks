import React, { createContext, useContext, useState, useEffect } from 'react';
import { SpecificationItem, Product, ProductVariant } from '../types';

interface SpecificationContextType {
  items: SpecificationItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, newQuantity: number) => void;
  clearSpecification: () => void;
  totalItemsCount: number;
  totalSum: number;
  totalWeightKg: number;
  totalVolumeM3: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const SpecificationContext = createContext<SpecificationContextType | undefined>(undefined);

const STORAGE_KEY = 'bironix_order_specification_v2';

export const SpecificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<SpecificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (product: Product, variant: ProductVariant, quantity?: number) => {
    const qtyToAdd = quantity !== undefined ? quantity : (variant.minOrder?.qty || 1);

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.sku === variant.sku);
      if (existingIdx >= 0) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += qtyToAdd;
        return updated;
      }

      const newItem: SpecificationItem = {
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        sku: variant.sku,
        variantName: variant.name,
        categoryName: product.categoryName,
        quantity: qtyToAdd,
        unit: variant.mainUnit,
        price: variant.price,
        image: product.images[0] || '',
        weightKg: variant.weightKg || 0,
        volumeM3: variant.volumeM3 || 0,
        step: variant.minOrder?.step || 1,
        minQty: variant.minOrder?.qty || 1
      };

      return [...prevItems, newItem];
    });
  };

  const removeItem = (sku: string) => {
    setItems(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(sku);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.sku === sku) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearSpecification = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalSum = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalWeightKg = items.reduce(
    (sum, item) => sum + (item.weightKg || 0) * item.quantity,
    0
  );

  const totalVolumeM3 = items.reduce(
    (sum, item) => sum + (item.volumeM3 || 0) * item.quantity,
    0
  );

  return (
    <SpecificationContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearSpecification,
        totalItemsCount,
        totalSum,
        totalWeightKg,
        totalVolumeM3,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </SpecificationContext.Provider>
  );
};

export const useSpecification = (): SpecificationContextType => {
  const context = useContext(SpecificationContext);
  if (!context) {
    throw new Error('useSpecification must be used within a SpecificationProvider');
  }
  return context;
};
