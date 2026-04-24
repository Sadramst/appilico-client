import apiClient from "./api-client";
import type { IApiResponse, IPaginatedResponse, IQueryParams } from "@/types/api.types";
import type {
  IProductReview,
  ICreateReviewRequest,
  IUpdateReviewRequest,
  IRatingDistribution,
} from "@/types/review.types";

const REVIEWS_BASE = "/reviews";

export const reviewService = {
  getByProductId: async (
    productId: string,
    params?: IQueryParams
  ): Promise<IApiResponse<IPaginatedResponse<IProductReview>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IProductReview>>>(
      `${REVIEWS_BASE}/product/${productId}`,
      { params }
    );
    return response.data;
  },

  getRatingDistribution: async (
    productId: string
  ): Promise<IApiResponse<IRatingDistribution[]>> => {
    const response = await apiClient.get<IApiResponse<IRatingDistribution[]>>(
      `${REVIEWS_BASE}/product/${productId}/distribution`
    );
    return response.data;
  },

  getMyReviews: async (params?: IQueryParams): Promise<IApiResponse<IPaginatedResponse<IProductReview>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IProductReview>>>(
      `${REVIEWS_BASE}/my-reviews`,
      { params }
    );
    return response.data;
  },

  getAll: async (params?: IQueryParams): Promise<IApiResponse<IPaginatedResponse<IProductReview>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IProductReview>>>(REVIEWS_BASE, { params });
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

  reject: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(`${REVIEWS_BASE}/${id}/reject`);
    return response.data;
  },
};
