"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settings-service";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getAll(),
    staleTime: 10 * 60 * 1000,
  });
}
