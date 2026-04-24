import apiClient from "./api-client";
import type { IApiResponse, IPaginatedResponse } from "@/types/api.types";
import type {
  IProduct,
  IProductFilter,
  ICreateProductRequest,
  IUpdateProductRequest,
} from "@/types/product.types";

const PRODUCTS_BASE = "/products";

export const productService = {
  getAll: async (
    params?: IProductFilter
  ): Promise<IApiResponse<IPaginatedResponse<IProduct>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IProduct>>>(
      PRODUCTS_BASE,
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<IProduct>> => {
    const response = await apiClient.get<IApiResponse<IProduct>>(
      `${PRODUCTS_BASE}/${id}`
    );
    return response.data;
  },

  getBySlug: async (slug: string): Promise<IApiResponse<IProduct>> => {
    const response = await apiClient.get<IApiResponse<IProduct>>(
      `${PRODUCTS_BASE}/slug/${slug}`
    );
    return response.data;
  },

  getFeatured: async (): Promise<IApiResponse<IProduct[]>> => {
    const response = await apiClient.get<IApiResponse<IProduct[]>>(
      `${PRODUCTS_BASE}/featured`
    );
    return response.data;
  },

  getTrending: async (): Promise<IApiResponse<IProduct[]>> => {
    const response = await apiClient.get<IApiResponse<IProduct[]>>(
      `${PRODUCTS_BASE}/trending`
    );
    return response.data;
  },

  getRelated: async (id: string): Promise<IApiResponse<IProduct[]>> => {
    const response = await apiClient.get<IApiResponse<IProduct[]>>(
      `${PRODUCTS_BASE}/${id}/related`
    );
    return response.data;
  },

  search: async (
    query: string,
    page?: number,
    pageSize?: number
  ): Promise<IApiResponse<IPaginatedResponse<IProduct>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IProduct>>>(
      `${PRODUCTS_BASE}/search`,
      { params: { query, page, pageSize } }
    );
    return response.data;
  },

  create: async (data: ICreateProductRequest): Promise<IApiResponse<IProduct>> => {
    const response = await apiClient.post<IApiResponse<IProduct>>(
      PRODUCTS_BASE,
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: IUpdateProductRequest
  ): Promise<IApiResponse<IProduct>> => {
    const response = await apiClient.put<IApiResponse<IProduct>>(
      `${PRODUCTS_BASE}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(
      `${PRODUCTS_BASE}/${id}`
    );
    return response.data;
  },

  uploadImages: async (
    id: string,
    files: File[]
  ): Promise<IApiResponse<{ urls: string[] }>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await apiClient.post<IApiResponse<{ urls: string[] }>>(
      `${PRODUCTS_BASE}/${id}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};
