"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard-service";
import type { DashboardPeriod } from "@/types/dashboard.types";

export function useDashboard(period: DashboardPeriod = "monthly") {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: () => dashboardService.getStats(period),
    staleTime: 2 * 60 * 1000,
  });
}
