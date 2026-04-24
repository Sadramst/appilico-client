import apiClient from "./api-client";
import type { IApiResponse, IQueryParams } from "@/types/api.types";
import type {
  IOrder,
  ICreateOrderRequest,
  IUpdateOrderStatusRequest,
  IOrderStatusHistory,
} from "@/types/order.types";

const ORDERS_BASE = "/orders";

export const orderService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<IOrder[]>> => {
    const response = await apiClient.get<IApiResponse<IOrder[]>>(ORDERS_BASE, { params });
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<IOrder>> => {
    const response = await apiClient.get<IApiResponse<IOrder>>(`${ORDERS_BASE}/${id}`);
    return response.data;
  },

  getMyOrders: async (params?: IQueryParams): Promise<IApiResponse<IOrder[]>> => {
    const response = await apiClient.get<IApiResponse<IOrder[]>>(`${ORDERS_BASE}/my`, { params });
    return response.data;
  },

  create: async (data: ICreateOrderRequest): Promise<IApiResponse<IOrder>> => {
    const response = await apiClient.post<IApiResponse<IOrder>>(ORDERS_BASE, data);
    return response.data;
  },

  updateStatus: async (id: string, data: IUpdateOrderStatusRequest): Promise<IApiResponse<IOrder>> => {
    const response = await apiClient.put<IApiResponse<IOrder>>(`${ORDERS_BASE}/${id}/status`, data);
    return response.data;
  },

  getHistory: async (id: string): Promise<IApiResponse<IOrderStatusHistory[]>> => {
    const response = await apiClient.get<IApiResponse<IOrderStatusHistory[]>>(`${ORDERS_BASE}/${id}/history`);
    return response.data;
  },

  cancel: async (id: string): Promise<IApiResponse<IOrder>> => {
    const response = await apiClient.post<IApiResponse<IOrder>>(`${ORDERS_BASE}/${id}/cancel`);
    return response.data;
  },
};
