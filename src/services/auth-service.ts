import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type {
  IAuthResponse,
  ILoginRequest,
  IRegisterRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IUpdateProfileRequest,
  IUser,
} from "@/types/auth.types";

const AUTH_BASE = "/auth";

export const authService = {
  login: async (data: ILoginRequest): Promise<IApiResponse<IAuthResponse>> => {
    const response = await apiClient.post<IApiResponse<IAuthResponse>>(
      `${AUTH_BASE}/login`,
      data
    );
    return response.data;
  },

  register: async (data: IRegisterRequest): Promise<IApiResponse<IAuthResponse>> => {
    const response = await apiClient.post<IApiResponse<IAuthResponse>>(
      `${AUTH_BASE}/register`,
      data
    );
    return response.data;
  },

  forgotPassword: async (data: IForgotPasswordRequest): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(
      `${AUTH_BASE}/forgot-password`,
      data
    );
    return response.data;
  },

  resetPassword: async (data: IResetPasswordRequest): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(
      `${AUTH_BASE}/reset-password`,
      data
    );
    return response.data;
  },

  getProfile: async (): Promise<IApiResponse<IUser>> => {
    const response = await apiClient.get<IApiResponse<IUser>>(
      `${AUTH_BASE}/profile`
    );
    return response.data;
  },

  updateProfile: async (data: IUpdateProfileRequest): Promise<IApiResponse<IUser>> => {
    const response = await apiClient.put<IApiResponse<IUser>>(
      `${AUTH_BASE}/profile`,
      data
    );
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<IApiResponse<IAuthResponse>> => {
    const response = await apiClient.post<IApiResponse<IAuthResponse>>(
      `${AUTH_BASE}/refresh`,
      { refreshToken }
    );
    return response.data;
  },

  revokeToken: async (token: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.post<IApiResponse<null>>(
      `${AUTH_BASE}/revoke`,
      { token }
    );
    return response.data;
  },
};
