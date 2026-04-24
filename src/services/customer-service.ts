import apiClient from "./api-client";
import type { IApiResponse, IPaginatedResponse, IQueryParams } from "@/types/api.types";
import type { ICustomer, ICustomerAddress, ICreateAddressRequest, IUpdateAddressRequest } from "@/types/customer.types";

const CUSTOMERS_BASE = "/customers";

export const customerService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<IPaginatedResponse<ICustomer>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<ICustomer>>>(CUSTOMERS_BASE, { params });
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<ICustomer>> => {
    const response = await apiClient.get<IApiResponse<ICustomer>>(`${CUSTOMERS_BASE}/${id}`);
    return response.data;
  },

  getAddresses: async (): Promise<IApiResponse<ICustomerAddress[]>> => {
    const response = await apiClient.get<IApiResponse<ICustomerAddress[]>>(`${CUSTOMERS_BASE}/addresses`);
    return response.data;
  },

  addAddress: async (data: ICreateAddressRequest): Promise<IApiResponse<ICustomerAddress>> => {
    const response = await apiClient.post<IApiResponse<ICustomerAddress>>(`${CUSTOMERS_BASE}/addresses`, data);
    return response.data;
  },

  updateAddress: async (id: string, data: IUpdateAddressRequest): Promise<IApiResponse<ICustomerAddress>> => {
    const response = await apiClient.put<IApiResponse<ICustomerAddress>>(`${CUSTOMERS_BASE}/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(`${CUSTOMERS_BASE}/addresses/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(`${CUSTOMERS_BASE}/addresses/${id}/default`);
    return response.data;
  },

  toggleActive: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(`${CUSTOMERS_BASE}/${id}/toggle-active`);
    return response.data;
  },
};
