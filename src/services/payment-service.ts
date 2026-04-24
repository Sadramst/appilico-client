import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IPayment } from "@/types/payment.types";

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

  create: async (data: Record<string, unknown>): Promise<IApiResponse<IPayment>> => {
    const response = await apiClient.post<IApiResponse<IPayment>>(PAYMENTS_BASE, data);
    return response.data;
  },

  getMethods: async (): Promise<IApiResponse<string[]>> => {
    // Backend doesn't have a dedicated methods endpoint; return default methods
    return { success: true, data: ["CreditCard", "DebitCard", "PayPal", "BankTransfer"], message: "Payment methods", errors: [], timestamp: new Date().toISOString() };
  },
};
