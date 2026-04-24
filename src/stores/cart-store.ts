"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ICartItem } from "@/types/cart.types";
import { config } from "@/lib/config";

interface CartState {
  items: ICartItem[];
  voucherCode: string | null;
  voucherDiscount: number;
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  addItem: (item: ICartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setVoucher: (code: string, discount: number) => void;
  removeVoucher: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setItems: (items: ICartItem[]) => void;
}

function calculateTotals(items: ICartItem[], voucherDiscount: number) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = voucherDiscount;
  const taxRate = 0.08;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const shippingAmount = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal - discountAmount + taxAmount + shippingAmount;

  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discountAmount,
    taxAmount: Math.max(0, taxAmount),
    shippingAmount,
    total: Math.max(0, total),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      voucherCode: null,
      voucherDiscount: 0,
      isOpen: false,
      itemCount: 0,
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      total: 0,

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        let newItems: ICartItem[];
        if (existingIndex >= 0) {
          newItems = items.map((i, idx) =>
            idx === existingIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          newItems = [...items, item];
        }

        const totals = calculateTotals(newItems, get().voucherDiscount);
        set({ items: newItems, ...totals });
      },

      removeItem: (itemId) => {
        const newItems = get().items.filter((i) => i.id !== itemId);
        const totals = calculateTotals(newItems, get().voucherDiscount);
        set({ items: newItems, ...totals });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const newItems = get().items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        const totals = calculateTotals(newItems, get().voucherDiscount);
        set({ items: newItems, ...totals });
      },

      clearCart: () => {
        set({
          items: [],
          voucherCode: null,
          voucherDiscount: 0,
          itemCount: 0,
          subtotal: 0,
          discountAmount: 0,
          taxAmount: 0,
          shippingAmount: 0,
          total: 0,
        });
      },

      setVoucher: (code, discount) => {
        const totals = calculateTotals(get().items, discount);
        set({ voucherCode: code, voucherDiscount: discount, ...totals });
      },

      removeVoucher: () => {
        const totals = calculateTotals(get().items, 0);
        set({ voucherCode: null, voucherDiscount: 0, ...totals });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setItems: (items) => {
        const totals = calculateTotals(items, get().voucherDiscount);
        set({ items, ...totals });
      },
    }),
    {
      name: config.cart.storageKey,
      partialize: (state) => ({
        items: state.items,
        voucherCode: state.voucherCode,
        voucherDiscount: state.voucherDiscount,
      }),
    }
  )
);
