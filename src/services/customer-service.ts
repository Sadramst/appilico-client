import apiClient from "./api-client";
import type { IApiResponse, IQueryParams } from "@/types/api.types";
import type { ICustomer, IUpdateCustomerRequest, ICustomerLoyalty } from "@/types/customer.types";

const CUSTOMERS_BASE = "/customers";

export const customerService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<ICustomer[]>> => {
    const response = await apiClient.get<IApiResponse<ICustomer[]>>(CUSTOMERS_BASE, { params });
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<ICustomer>> => {
    const response = await apiClient.get<IApiResponse<ICustomer>>(`${CUSTOMERS_BASE}/${id}`);
    return response.data;
  },

  getMe: async (): Promise<IApiResponse<ICustomer>> => {
    const response = await apiClient.get<IApiResponse<ICustomer>>(`${CUSTOMERS_BASE}/me`);
    return response.data;
  },

  update: async (id: string, data: IUpdateCustomerRequest): Promise<IApiResponse<ICustomer>> => {
    const response = await apiClient.put<IApiResponse<ICustomer>>(`${CUSTOMERS_BASE}/${id}`, data);
    return response.data;
  },

  getLoyalty: async (id: string): Promise<IApiResponse<ICustomerLoyalty>> => {
    const response = await apiClient.get<IApiResponse<ICustomerLoyalty>>(`${CUSTOMERS_BASE}/${id}/loyalty`);
    return response.data;
  },

  addLoyaltyPoints: async (id: string, points: number): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(`${CUSTOMERS_BASE}/${id}/loyalty/points`, null, { params: { points } });
    return response.data;
  },
};
