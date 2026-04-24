import apiClient from "./api-client";
import type { IApiResponse, IPaginatedResponse, IQueryParams } from "@/types/api.types";
import type {
  IVoucher,
  ICreateVoucherRequest,
  IUpdateVoucherRequest,
  IValidateVoucherRequest,
  IValidateVoucherResponse,
} from "@/types/voucher.types";

const VOUCHERS_BASE = "/vouchers";

export const voucherService = {
  getAll: async (params?: IQueryParams): Promise<IApiResponse<IPaginatedResponse<IVoucher>>> => {
    const response = await apiClient.get<IApiResponse<IPaginatedResponse<IVoucher>>>(VOUCHERS_BASE, { params });
    return response.data;
  },

  getMyVouchers: async (): Promise<IApiResponse<IVoucher[]>> => {
    const response = await apiClient.get<IApiResponse<IVoucher[]>>(`${VOUCHERS_BASE}/my-vouchers`);
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<IVoucher>> => {
    const response = await apiClient.get<IApiResponse<IVoucher>>(`${VOUCHERS_BASE}/${id}`);
    return response.data;
  },

  create: async (data: ICreateVoucherRequest): Promise<IApiResponse<IVoucher>> => {
    const response = await apiClient.post<IApiResponse<IVoucher>>(VOUCHERS_BASE, data);
    return response.data;
  },

  update: async (id: string, data: IUpdateVoucherRequest): Promise<IApiResponse<IVoucher>> => {
    const response = await apiClient.put<IApiResponse<IVoucher>>(`${VOUCHERS_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(`${VOUCHERS_BASE}/${id}`);
    return response.data;
  },

  validate: async (data: IValidateVoucherRequest): Promise<IApiResponse<IValidateVoucherResponse>> => {
    const response = await apiClient.post<IApiResponse<IValidateVoucherResponse>>(`${VOUCHERS_BASE}/validate`, data);
    return response.data;
  },

  redeem: async (data: { code: string; orderId: string }): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(`${VOUCHERS_BASE}/redeem`, data);
    return response.data;
  },
};
