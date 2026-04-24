"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: () => categoryService.getTree(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}
