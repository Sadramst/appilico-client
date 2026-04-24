"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { voucherService } from "@/services/voucher-service";
import type { IValidateVoucherRequest } from "@/types/voucher.types";

export function useAllVouchers(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["vouchers", params],
    queryFn: () => voucherService.getAll(params),
  });
}

export function useValidateVoucher() {
  return useMutation({
    mutationFn: (data: IValidateVoucherRequest) => voucherService.validate(data),
    onError: () => {
      toast.error("Invalid or expired voucher code");
    },
  });
}
