import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IDashboardStats, DashboardPeriod } from "@/types/dashboard.types";

const DASHBOARD_BASE = "/dashboard";

export const dashboardService = {
  getStats: async (period: DashboardPeriod = "monthly"): Promise<IApiResponse<IDashboardStats>> => {
    const response = await apiClient.get<IApiResponse<IDashboardStats>>(DASHBOARD_BASE, {
      params: { period },
    });
    return response.data;
  },
};
