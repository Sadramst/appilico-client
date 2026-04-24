import apiClient from "./api-client";
import type { IApiResponse, IQueryParams } from "@/types/api.types";
import type { IDiscount, ICreateDiscountRequest, IUpdateDiscountRequest, IValidateDiscountRequest, IValidateDiscountResponse } from "@/types/discount.types";

const DISCOUNTS_BASE = "/discounts";

export const discountService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<IDiscount[]>> => {
    const response = await apiClient.get<IApiResponse<IDiscount[]>>(DISCOUNTS_BASE, { params });
    return response.data;
  },

  getActive: async (): Promise<IApiResponse<IDiscount[]>> => {
    const response = await apiClient.get<IApiResponse<IDiscount[]>>(`${DISCOUNTS_BASE}/active`);
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

  validate: async (data: IValidateDiscountRequest): Promise<IApiResponse<IValidateDiscountResponse>> => {
    const response = await apiClient.post<IApiResponse<IValidateDiscountResponse>>(`${DISCOUNTS_BASE}/validate`, data);
    return response.data;
  },
};
