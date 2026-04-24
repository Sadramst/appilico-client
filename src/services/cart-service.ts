import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { ICart, IAddToCartRequest, IUpdateCartItemRequest } from "@/types/cart.types";

const CART_BASE = "/cart";

export const cartService = {
  get: async (): Promise<IApiResponse<ICart>> => {
    const response = await apiClient.get<IApiResponse<ICart>>(CART_BASE);
    return response.data;
  },

  addItem: async (data: IAddToCartRequest): Promise<IApiResponse<ICart>> => {
    const response = await apiClient.post<IApiResponse<ICart>>(`${CART_BASE}/items`, data);
    return response.data;
  },

  updateItem: async (itemId: string, data: IUpdateCartItemRequest): Promise<IApiResponse<ICart>> => {
    const response = await apiClient.put<IApiResponse<ICart>>(`${CART_BASE}/items/${itemId}`, data);
    return response.data;
  },

  removeItem: async (itemId: string): Promise<IApiResponse<ICart>> => {
    const response = await apiClient.delete<IApiResponse<ICart>>(`${CART_BASE}/items/${itemId}`);
    return response.data;
  },

  clear: async (): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(CART_BASE);
    return response.data;
  },
};
