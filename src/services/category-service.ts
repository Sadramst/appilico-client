import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type {
  ICategory,
  ICategoryTree,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from "@/types/category.types";

const CATEGORIES_BASE = "/categories";

export const categoryService = {
  getAll: async (): Promise<IApiResponse<ICategory[]>> => {
    const response = await apiClient.get<IApiResponse<ICategory[]>>(CATEGORIES_BASE);
    return response.data;
  },

  getTree: async (): Promise<IApiResponse<ICategoryTree[]>> => {
    const response = await apiClient.get<IApiResponse<ICategoryTree[]>>(
      `${CATEGORIES_BASE}/tree`
    );
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<ICategory>> => {
    const response = await apiClient.get<IApiResponse<ICategory>>(
      `${CATEGORIES_BASE}/${id}`
    );
    return response.data;
  },

  create: async (data: ICreateCategoryRequest): Promise<IApiResponse<ICategory>> => {
    const response = await apiClient.post<IApiResponse<ICategory>>(
      CATEGORIES_BASE,
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: IUpdateCategoryRequest
  ): Promise<IApiResponse<ICategory>> => {
    const response = await apiClient.put<IApiResponse<ICategory>>(
      `${CATEGORIES_BASE}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(
      `${CATEGORIES_BASE}/${id}`
    );
    return response.data;
  },

  uploadImage: async (
    id: string,
    file: File
  ): Promise<IApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<IApiResponse<{ url: string }>>(
      `${CATEGORIES_BASE}/${id}/image`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};
