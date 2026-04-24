"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productService } from "@/services/product-service";
import type { IProductFilter, ICreateProductRequest, IUpdateProductRequest } from "@/types/product.types";

export function useProducts(filters?: IProductFilter) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useFeaturedProducts(count?: number) {
  return useQuery({
    queryKey: ["products", "featured", count],
    queryFn: () => productService.getFeatured(count),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductBySku(sku: string) {
  return useQuery({
    queryKey: ["product", "sku", sku],
    queryFn: () => productService.getBySku(sku),
    enabled: !!sku,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateProductRequest) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: () => {
      toast.error("Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateProductRequest }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });
}
