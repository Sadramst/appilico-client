"use client";

import { useQuery } from "@tanstack/react-query";
import { discountService } from "@/services/discount-service";
import type { IQueryParams } from "@/types/api.types";

export function useDiscounts(params?: IQueryParams) {
  return useQuery({
    queryKey: ["discounts", params],
    queryFn: () => discountService.getAll(params),
  });
}
