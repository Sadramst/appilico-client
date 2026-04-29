"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { discountService } from "@/services/discount-service";
import type { IQueryParams } from "@/types/api.types";
import type { IValidateDiscountRequest } from "@/types/discount.types";

export function useDiscounts(params?: IQueryParams) {
  return useQuery({
    queryKey: ["discounts", params],
    queryFn: () => discountService.getAll(params),
  });
}

export function useActiveDiscounts() {
  return useQuery({
    queryKey: ["discounts", "active"],
    queryFn: () => discountService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useValidateDiscount() {
  return useMutation({
    mutationFn: (data: IValidateDiscountRequest) => discountService.validate(data),
    onError: () => {
      toast.error("Invalid or expired discount code");
    },
  });
}
