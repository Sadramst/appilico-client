import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type {
  IProduct,
  IProductFilter,
  ICreateProductRequest,
  IUpdateProductRequest,
  ICreateVariantRequest,
  IProductVariant,
} from "@/types/product.types";

const PRODUCTS_BASE = "/products";

export const productService = {
  getAll: async (
    params?: IProductFilter
  ): Promise<IApiResponse<IProduct[]>> => {
    const response = await apiClient.get<IApiResponse<IProduct[]>>(
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

  getBySku: async (sku: string): Promise<IApiResponse<IProduct>> => {
    const response = await apiClient.get<IApiResponse<IProduct>>(
      `${PRODUCTS_BASE}/sku/${sku}`
    );
    return response.data;
  },

  getFeatured: async (count?: number): Promise<IApiResponse<IProduct[]>> => {
    const response = await apiClient.get<IApiResponse<IProduct[]>>(
      `${PRODUCTS_BASE}/featured`,
      { params: { count } }
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

  addVariant: async (
    productId: string,
    data: ICreateVariantRequest
  ): Promise<IApiResponse<IProductVariant>> => {
    const response = await apiClient.post<IApiResponse<IProductVariant>>(
      `${PRODUCTS_BASE}/${productId}/variants`,
      data
    );
    return response.data;
  },
};
