import apiClient from "./api-client";
import type { IApiResponse, IPaginatedResponse, IQueryParams } from "@/types/api.types";
import type { IDiscount, ICreateDiscountRequest, IUpdateDiscountRequest } from "@/types/discount.types";

const DISCOUNTS_BASE = "/discounts";

export const discountService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<IPaginatedResponse<IDiscount>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IDiscount>>>(DISCOUNTS_BASE, { params });
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<IDiscount>> => {
    const response = await apiClient.get<IApiResponse<IDiscount>>(`${DISCOUNTS_BASE}/${id}`);
    return response.data;
  },

  create: async (data: ICreateDiscountRequest): Promise<IApiResponse<IDiscount>> => {
    const response = await apiClient.post<IApiResponse<IDiscount>>(DISCOUNTS_BASE, data);
    return response.data;
  },

  update: async (id: string, data: IUpdateDiscountRequest): Promise<IApiResponse<IDiscount>> => {
    const response = await apiClient.put<IApiResponse<IDiscount>>(`${DISCOUNTS_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(`${DISCOUNTS_BASE}/${id}`);
    return response.data;
  },
};
