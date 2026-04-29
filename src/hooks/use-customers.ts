"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/services/customer-service";
import type { IQueryParams } from "@/types/api.types";
import type { ICustomerAddress } from "@/types/customer.types";

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

export function useMyCustomerProfile() {
  return useQuery({
    queryKey: ["customer", "me"],
    queryFn: () => customerService.getMe(),
  });
}

export function useMyAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => customerService.getMyAddresses(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ICustomerAddress, "id">) => customerService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "me"] });
      toast.success("Address added");
    },
    onError: () => toast.error("Failed to add address"),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ICustomerAddress, "id"> }) =>
      customerService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "me"] });
      toast.success("Address updated");
    },
    onError: () => toast.error("Failed to update address"),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "me"] });
      toast.success("Address deleted");
    },
    onError: () => toast.error("Failed to delete address"),
  });
}
