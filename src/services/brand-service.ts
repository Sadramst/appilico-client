import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IBrand, ICreateBrandRequest, IUpdateBrandRequest } from "@/types/brand.types";

const BRANDS_BASE = "/brands";

export const brandService = {
  getAll: async (): Promise<IApiResponse<IBrand[]>> => {
    const response = await apiClient.get<IApiResponse<IBrand[]>>(BRANDS_BASE);
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<IBrand>> => {
    const response = await apiClient.get<IApiResponse<IBrand>>(`${BRANDS_BASE}/${id}`);
    return response.data;
  },

  create: async (data: ICreateBrandRequest): Promise<IApiResponse<IBrand>> => {
    const response = await apiClient.post<IApiResponse<IBrand>>(BRANDS_BASE, data);
    return response.data;
  },

  update: async (id: string, data: IUpdateBrandRequest): Promise<IApiResponse<IBrand>> => {
    const response = await apiClient.put<IApiResponse<IBrand>>(`${BRANDS_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(`${BRANDS_BASE}/${id}`);
    return response.data;
  },

  uploadLogo: async (id: string, file: File): Promise<IApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<IApiResponse<{ url: string }>>(
      `${BRANDS_BASE}/${id}/logo`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};
