import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IPayment } from "@/types/payment.types";

const PAYMENTS_BASE = "/payments";

export const paymentService = {
  getByOrderId: async (orderId: string): Promise<IApiResponse<IPayment>> => {
    const response = await apiClient.get<IApiResponse<IPayment>>(`${PAYMENTS_BASE}/order/${orderId}`);
    return response.data;
  },

  getMethods: async (): Promise<IApiResponse<string[]>> => {
    const response = await apiClient.get<IApiResponse<string[]>>(`${PAYMENTS_BASE}/methods`);
    return response.data;
  },
};
