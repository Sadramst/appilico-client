import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IAppSetting, IUpdateSettingsRequest } from "@/types/settings.types";

const SETTINGS_BASE = "/settings";

export const settingsService = {
  getAll: async (): Promise<IApiResponse<IAppSetting[]>> => {
    const response = await apiClient.get<IApiResponse<IAppSetting[]>>(SETTINGS_BASE);
    return response.data;
  },

  getByGroup: async (group: string): Promise<IApiResponse<IAppSetting[]>> => {
    const response = await apiClient.get<IApiResponse<IAppSetting[]>>(`${SETTINGS_BASE}/group/${group}`);
    return response.data;
  },

  getByKey: async (key: string): Promise<IApiResponse<IAppSetting>> => {
    const response = await apiClient.get<IApiResponse<IAppSetting>>(`${SETTINGS_BASE}/${key}`);
    return response.data;
  },

  update: async (data: IUpdateSettingsRequest): Promise<IApiResponse<IAppSetting[]>> => {
    const response = await apiClient.put<IApiResponse<IAppSetting[]>>(SETTINGS_BASE, data);
    return response.data;
  },
};
