import apiClient from "./api-client";
import type { IApiResponse, IQueryParams } from "@/types/api.types";
import type {
  IProductReview,
  ICreateReviewRequest,
  IUpdateReviewRequest,
} from "@/types/review.types";

const REVIEWS_BASE = "/reviews";

export const reviewService = {
  getByProductId: async (
    productId: string,
    params?: IQueryParams
  ): Promise<IApiResponse<IProductReview[]>> => {
    const response = await apiClient.get<IApiResponse<IProductReview[]>>(
      `${REVIEWS_BASE}/product/${productId}`,
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<IProductReview>> => {
    const response = await apiClient.get<IApiResponse<IProductReview>>(`${REVIEWS_BASE}/${id}`);
    return response.data;
  },

  create: async (data: ICreateReviewRequest): Promise<IApiResponse<IProductReview>> => {
    const response = await apiClient.post<IApiResponse<IProductReview>>(REVIEWS_BASE, data);
    return response.data;
  },

  update: async (id: string, data: IUpdateReviewRequest): Promise<IApiResponse<IProductReview>> => {
    const response = await apiClient.put<IApiResponse<IProductReview>>(`${REVIEWS_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(`${REVIEWS_BASE}/${id}`);
    return response.data;
  },

  approve: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(`${REVIEWS_BASE}/${id}/approve`);
    return response.data;
  },
};
