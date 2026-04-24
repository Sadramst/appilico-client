import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";

export interface IWishlistItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  imageUrl: string | null;
  addedAt: string;
}

const WISHLIST_BASE = "/wishlist";

export const wishlistService = {
  getAll: async (): Promise<IApiResponse<IWishlistItem[]>> => {
    const response = await apiClient.get<IApiResponse<IWishlistItem[]>>(WISHLIST_BASE);
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

  check: async (productId: string): Promise<IApiResponse<boolean>> => {
    const response = await apiClient.get<IApiResponse<boolean>>(`${WISHLIST_BASE}/check/${productId}`);
    return response.data;
  },
};
