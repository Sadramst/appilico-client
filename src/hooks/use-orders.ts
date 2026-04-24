"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderService } from "@/services/order-service";
import type { ICreateOrderRequest } from "@/types/order.types";
import type { IQueryParams } from "@/types/api.types";

export function useMyOrders(params?: IQueryParams) {
  return useQuery({
    queryKey: ["my-orders", params],
    queryFn: () => orderService.getMyOrders(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useAllOrders(params?: IQueryParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderService.getAll(params),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateOrderRequest) => orderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order placed successfully!");
    },
    onError: () => {
      toast.error("Failed to place order");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Order cancelled");
    },
    onError: () => {
      toast.error("Failed to cancel order");
    },
  });
}
