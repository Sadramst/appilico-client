import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";

const UPLOAD_BASE = "/images";

export const uploadService = {
  uploadImage: async (file: File, folder?: string): Promise<IApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);
    const response = await apiClient.post<IApiResponse<{ url: string }>>(
      `${UPLOAD_BASE}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  uploadMultiple: async (files: File[], folder?: string): Promise<IApiResponse<{ urls: string[] }>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folder) formData.append("folder", folder);
    const response = await apiClient.post<IApiResponse<{ urls: string[] }>>(
      `${UPLOAD_BASE}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  deleteImage: async (url: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(UPLOAD_BASE, {
      data: { url },
    });
    return response.data;
  },
};
