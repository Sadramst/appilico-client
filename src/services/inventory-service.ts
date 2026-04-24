import apiClient from "./api-client";
import type { IApiResponse, IPaginatedResponse, IQueryParams } from "@/types/api.types";
import type { IStockItem, IInventoryTransaction, IAdjustStockRequest } from "@/types/inventory.types";

const INVENTORY_BASE = "/inventory";

export const inventoryService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<IPaginatedResponse<IStockItem>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IStockItem>>>(INVENTORY_BASE, { params });
    return response.data;
  },

  getLowStock: async (): Promise<IApiResponse<IStockItem[]>> => {
    const response = await apiClient.get<IApiResponse<IStockItem[]>>(`${INVENTORY_BASE}/low-stock`);
    return response.data;
  },

  getHistory: async (
    productId: string,
    params?: IQueryParams
  ): Promise<IApiResponse<IPaginatedResponse<IInventoryTransaction>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IInventoryTransaction>>>(
      `${INVENTORY_BASE}/${productId}/history`,
      { params }
    );
    return response.data;
  },

  adjustStock: async (data: IAdjustStockRequest): Promise<IApiResponse<IStockItem>> => {
    const response = await apiClient.post<IApiResponse<IStockItem>>(`${INVENTORY_BASE}/adjust`, data);
    return response.data;
  },
};
