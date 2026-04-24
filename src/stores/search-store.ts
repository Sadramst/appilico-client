"use client";

import { create } from "zustand";
import type { ProductSortBy } from "@/types/product.types";

interface SearchState {
  query: string;
  categoryId: string | null;
  brandId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  inStock: boolean;
  sortBy: ProductSortBy;
  setQuery: (query: string) => void;
  setCategoryId: (id: string | null) => void;
  setBrandId: (id: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setMinRating: (rating: number | null) => void;
  setInStock: (inStock: boolean) => void;
  setSortBy: (sortBy: ProductSortBy) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: "",
  categoryId: null,
  brandId: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStock: false,
  sortBy: "newest",

  setQuery: (query) => set({ query }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setBrandId: (brandId) => set({ brandId }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setMinRating: (minRating) => set({ minRating }),
  setInStock: (inStock) => set({ inStock }),
  setSortBy: (sortBy) => set({ sortBy }),

  clearFilters: () =>
    set({
      query: "",
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: false,
      sortBy: "newest",
    }),

  hasActiveFilters: () => {
    const state = get();
    return !!(
      state.query ||
      state.categoryId ||
      state.brandId ||
      state.minPrice !== null ||
      state.maxPrice !== null ||
      state.minRating !== null ||
      state.inStock
    );
  },
}));
