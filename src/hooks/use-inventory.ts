"use client";

import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory-service";
import type { IQueryParams } from "@/types/api.types";

export function useProductInventory(productId: string, params?: IQueryParams) {
  return useQuery({
    queryKey: ["inventory", productId, params],
    queryFn: () => inventoryService.getByProductId(productId, params),
    enabled: !!productId,
  });
}

export function useLowStock(threshold?: number) {
  return useQuery({
    queryKey: ["inventory", "low-stock", threshold],
    queryFn: () => inventoryService.getLowStock(threshold),
  });
}
