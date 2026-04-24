import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";

const IMAGES_BASE = "/images";

export const uploadService = {
  uploadImage: async (file: File, folder?: string): Promise<IApiResponse<{ url: string; publicId: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<IApiResponse<{ url: string; publicId: string }>>(
      `${IMAGES_BASE}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params: folder ? { folder } : undefined,
      }
    );
    return response.data;
  },

  deleteImage: async (publicId: string): Promise<IApiResponse<null>> => {
    const response = await apiClient.delete<IApiResponse<null>>(IMAGES_BASE, {
      params: { publicId },
    });
    return response.data;
  },
};
