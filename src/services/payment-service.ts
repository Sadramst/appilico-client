import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IPayment, ICreatePaymentRequest, IRefund, ICreateRefundRequest } from "@/types/payment.types";

const PAYMENTS_BASE = "/payments";

export const paymentService = {
  getByOrderId: async (orderId: string): Promise<IApiResponse<IPayment>> => {
    const response = await apiClient.get<IApiResponse<IPayment>>(`${PAYMENTS_BASE}/order/${orderId}`);
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<IPayment>> => {
    const response = await apiClient.get<IApiResponse<IPayment>>(`${PAYMENTS_BASE}/${id}`);
    return response.data;
  },

  create: async (data: ICreatePaymentRequest): Promise<IApiResponse<IPayment>> => {
    const response = await apiClient.post<IApiResponse<IPayment>>(PAYMENTS_BASE, data);
    return response.data;
  },

  createRefund: async (paymentId: string, data: ICreateRefundRequest): Promise<IApiResponse<IRefund>> => {
    const response = await apiClient.post<IApiResponse<IRefund>>(`${PAYMENTS_BASE}/${paymentId}/refunds`, data);
    return response.data;
  },

  getRefundsByOrder: async (orderId: string): Promise<IApiResponse<IRefund[]>> => {
    const response = await apiClient.get<IApiResponse<IRefund[]>>(`${PAYMENTS_BASE}/order/${orderId}/refunds`);
    return response.data;
  },
};
