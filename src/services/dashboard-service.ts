import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IDashboardStats, ISalesSummary, ITopProduct, IRevenueData, ICustomerStats, IDashboardDateParams } from "@/types/dashboard.types";

const DASHBOARD_BASE = "/dashboard";

export const dashboardService = {
  getSalesSummary: async (params?: IDashboardDateParams): Promise<IApiResponse<ISalesSummary>> => {
    const response = await apiClient.get<IApiResponse<ISalesSummary>>(`${DASHBOARD_BASE}/sales-summary`, { params });
    return response.data;
  },

  getTopProducts: async (params?: IDashboardDateParams): Promise<IApiResponse<ITopProduct[]>> => {
    const response = await apiClient.get<IApiResponse<ITopProduct[]>>(`${DASHBOARD_BASE}/top-products`, { params });
    return response.data;
  },

  getRevenueChart: async (params?: IDashboardDateParams): Promise<IApiResponse<IRevenueData[]>> => {
    const response = await apiClient.get<IApiResponse<IRevenueData[]>>(`${DASHBOARD_BASE}/revenue-chart`, { params });
    return response.data;
  },

  getCustomerStats: async (): Promise<IApiResponse<ICustomerStats>> => {
    const response = await apiClient.get<IApiResponse<ICustomerStats>>(`${DASHBOARD_BASE}/customer-stats`);
    return response.data;
  },

  getStats: async (params?: IDashboardDateParams): Promise<IApiResponse<IDashboardStats>> => {
    const [salesRes, topProductsRes, revenueRes, customerStatsRes] = await Promise.all([
      apiClient.get<IApiResponse<ISalesSummary>>(`${DASHBOARD_BASE}/sales-summary`, { params }),
      apiClient.get<IApiResponse<ITopProduct[]>>(`${DASHBOARD_BASE}/top-products`, { params }),
      apiClient.get<IApiResponse<IRevenueData[]>>(`${DASHBOARD_BASE}/revenue-chart`, { params }),
      apiClient.get<IApiResponse<ICustomerStats>>(`${DASHBOARD_BASE}/customer-stats`),
    ]);

    return {
      success: true,
      data: {
        salesSummary: salesRes.data.data,
        topProducts: topProductsRes.data.data,
        revenueData: revenueRes.data.data,
        customerStats: customerStatsRes.data.data,
      },
      message: "Dashboard data loaded",
      errors: [],
      timestamp: new Date().toISOString(),
    };
  },
};
