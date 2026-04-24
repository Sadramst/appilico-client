"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard-service";
import type { IDashboardDateParams } from "@/types/dashboard.types";

export function useDashboard(params?: IDashboardDateParams) {
  return useQuery({
    queryKey: ["dashboard", params],
    queryFn: () => dashboardService.getStats(params),
    staleTime: 2 * 60 * 1000,
  });
}
