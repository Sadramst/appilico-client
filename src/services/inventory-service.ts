import apiClient from "./api-client";
import type { IApiResponse, IQueryParams } from "@/types/api.types";
import type { IStockItem, IInventoryTransaction, IAdjustStockRequest } from "@/types/inventory.types";

const INVENTORY_BASE = "/inventory";

export const inventoryService = {
  getByProductId: async (
    productId: string,
    params?: IQueryParams
  ): Promise<IApiResponse<IInventoryTransaction[]>> => {
    const response = await apiClient.get<IApiResponse<IInventoryTransaction[]>>(
      `${INVENTORY_BASE}/product/${productId}`,
      { params }
    );
    return response.data;
  },

  adjustStock: async (data: IAdjustStockRequest): Promise<IApiResponse<IInventoryTransaction>> => {
    const response = await apiClient.post<IApiResponse<IInventoryTransaction>>(`${INVENTORY_BASE}/adjust`, data);
    return response.data;
  },

  getLowStock: async (threshold?: number): Promise<IApiResponse<IStockItem[]>> => {
    const response = await apiClient.get<IApiResponse<IStockItem[]>>(`${INVENTORY_BASE}/low-stock`, {
      params: threshold ? { threshold } : undefined,
    });
    return response.data;
  },
};
