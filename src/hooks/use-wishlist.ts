"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistService } from "@/services/wishlist-service";
import { useAuthStore } from "@/stores/auth-store";

export function useWishlist() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getAll(),
    enabled: isAuthenticated,
  });

  const addMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist");
    },
    onError: () => toast.error("Failed to add to wishlist"),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
    onError: () => toast.error("Failed to remove from wishlist"),
  });

  const toggleMutation = useMutation({
    mutationFn: async (productId: string) => {
      const items = wishlistQuery.data?.data ?? [];
      const isInWishlist = items.some((item) => item.id === productId);
      if (isInWishlist) {
        return wishlistService.remove(productId);
      }
      return wishlistService.add(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return {
    items: wishlistQuery.data?.data ?? [],
    isLoading: wishlistQuery.isLoading,
    add: addMutation.mutate,
    remove: removeMutation.mutate,
    toggle: toggleMutation.mutate,
    isInWishlist: (productId: string) =>
      (wishlistQuery.data?.data ?? []).some((item) => item.id === productId),
  };
}
