import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IProduct } from "@/types/product.types";

const WISHLIST_BASE = "/wishlist";

export const wishlistService = {
  getAll: async (): Promise<IApiResponse<IProduct[]>> => {
    const response = await apiClient.get<IApiResponse<IProduct[]>>(WISHLIST_BASE);
    return response.data;
  },

  add: async (productId: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(`${WISHLIST_BASE}/${productId}`);
    return response.data;
  },

  remove: async (productId: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(`${WISHLIST_BASE}/${productId}`);
    return response.data;
  },

  check: async (productId: string): Promise<IApiResponse<{ isInWishlist: boolean }>> => {
    const response = await apiClient.get<IApiResponse<{ isInWishlist: boolean }>>(`${WISHLIST_BASE}/check/${productId}`);
    return response.data;
  },
};
