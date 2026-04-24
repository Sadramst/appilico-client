"use client";

import { Star, ThumbsUp } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/shared/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductReview } from "@/types/review.types";

interface ProductReviewsProps {
  reviews: IProductReview[];
  averageRating: number;
  reviewCount: number;
  isLoading?: boolean;
}

export function ProductReviews({
  reviews,
  averageRating,
  reviewCount,
  isLoading,
}: ProductReviewsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
          <StarRating rating={averageRating} size="lg" className="mt-2" />
          <p className="text-sm text-muted-foreground mt-1">{reviewCount} reviews</p>
        </div>
      </div>

      <Separator />

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to leave a review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {review.customerName?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{review.customerName}</span>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-medium text-sm">{review.title}</h4>
              )}

              <p className="text-sm text-muted-foreground">{review.comment}</p>

              <Separator />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
