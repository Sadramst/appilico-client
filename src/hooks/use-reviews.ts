"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewService } from "@/services/review-service";
import type { ICreateReviewRequest, IUpdateReviewRequest } from "@/types/review.types";
import type { IQueryParams } from "@/types/api.types";

export function useProductReviews(productId: string, params?: IQueryParams) {
  return useQuery({
    queryKey: ["reviews", productId, params],
    queryFn: () => reviewService.getByProductId(productId, params),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateReviewRequest) => reviewService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review submitted successfully");
    },
    onError: () => toast.error("Failed to submit review"),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateReviewRequest }) =>
      reviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated");
    },
    onError: () => toast.error("Failed to update review"),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted");
    },
    onError: () => toast.error("Failed to delete review"),
  });
}
