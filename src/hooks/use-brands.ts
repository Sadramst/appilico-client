"use client";

import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand-service";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.getAll(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: () => brandService.getById(id),
    enabled: !!id,
  });
}
