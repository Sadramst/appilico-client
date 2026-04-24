import apiClient from "./api-client";
import type { IApiResponse, IPaginatedResponse, IQueryParams } from "@/types/api.types";
import type { ISpecialOffer, ICreateOfferRequest, IUpdateOfferRequest } from "@/types/offer.types";

const OFFERS_BASE = "/offers";

export const offerService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<IPaginatedResponse<ISpecialOffer>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<ISpecialOffer>>>(OFFERS_BASE, { params });
    return response.data;
  },

  getActive: async (): Promise<IApiResponse<ISpecialOffer[]>> => {
    const response = await apiClient.get<IApiResponse<ISpecialOffer[]>>(`${OFFERS_BASE}/active`);
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<ISpecialOffer>> => {
    const response = await apiClient.get<IApiResponse<ISpecialOffer>>(`${OFFERS_BASE}/${id}`);
    return response.data;
  },

  create: async (data: ICreateOfferRequest): Promise<IApiResponse<ISpecialOffer>> => {
    const response = await apiClient.post<IApiResponse<ISpecialOffer>>(OFFERS_BASE, data);
    return response.data;
  },

  update: async (id: string, data: IUpdateOfferRequest): Promise<IApiResponse<ISpecialOffer>> => {
    const response = await apiClient.put<IApiResponse<ISpecialOffer>>(`${OFFERS_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(`${OFFERS_BASE}/${id}`);
    return response.data;
  },

  uploadBanner: async (id: string, file: File): Promise<IApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<IApiResponse<{ url: string }>>(
      `${OFFERS_BASE}/${id}/banner`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};
