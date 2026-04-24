"use client";

import { useQuery } from "@tanstack/react-query";
import { offerService } from "@/services/offer-service";

export function useActiveOffers() {
  return useQuery({
    queryKey: ["offers", "active"],
    queryFn: () => offerService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => offerService.getById(id),
    enabled: !!id,
  });
}

export function useAllOffers(params?: { pageNumber?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["offers", params],
    queryFn: () => offerService.getAll(params),
  });
}
