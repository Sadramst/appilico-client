import apiClient from "./api-client";
import type { IApiResponse } from "@/types/api.types";
import type { IDashboardStats, DashboardPeriod, ISalesSummary, ITopProduct, IRevenueData } from "@/types/dashboard.types";

const DASHBOARD_BASE = "/dashboard";

export const dashboardService = {
  getStats: async (period: DashboardPeriod = "monthly"): Promise<IApiResponse<IDashboardStats>> => {
    const params = { period };
    const [salesRes, topProductsRes, revenueRes, customerStatsRes] = await Promise.all([
      apiClient.get<IApiResponse<ISalesSummary>>(`${DASHBOARD_BASE}/sales-summary`, { params }),
      apiClient.get<IApiResponse<ITopProduct[]>>(`${DASHBOARD_BASE}/top-products`, { params }),
      apiClient.get<IApiResponse<IRevenueData[]>>(`${DASHBOARD_BASE}/revenue-chart`, { params }),
      apiClient.get<IApiResponse<Record<string, unknown>>>(`${DASHBOARD_BASE}/customer-stats`, { params }),
    ]);

    return {
      success: true,
      data: {
        salesSummary: salesRes.data.data,
        topProducts: topProductsRes.data.data,
        revenueData: revenueRes.data.data,
        categoryRevenue: [],
        customerGrowth: [],
        recentOrders: [],
        lowStockProducts: [],
      } as IDashboardStats,
      message: "Dashboard data loaded",
      errors: [],
      timestamp: new Date().toISOString(),
    };
  },
};
