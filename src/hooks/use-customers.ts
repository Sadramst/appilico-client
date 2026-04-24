"use client";

import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customer-service";
import type { IQueryParams } from "@/types/api.types";

export function useCustomers(params?: IQueryParams) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerService.getAll(params),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => customerService.getAddresses(),
  });
}
