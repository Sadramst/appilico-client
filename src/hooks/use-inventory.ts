"use client";

import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory-service";
import type { IQueryParams } from "@/types/api.types";

export function useInventory(params?: IQueryParams) {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: () => inventoryService.getAll(params),
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: () => inventoryService.getLowStock(),
  });
}
