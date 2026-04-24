"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StarRating } from "@/components/shared/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyReviews } from "@/hooks/use-reviews";
import { formatDate, getInitials } from "@/lib/utils";
import { Check, X } from "lucide-react";

export default function AdminReviewsPage() {
  const { data, isLoading } = useMyReviews({ page: 1, pageSize: 20 });
  const reviews = data?.data?.items ?? [];

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate customer reviews" />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Customer reviews will appear here." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-4 border rounded-lg p-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs">{getInitials(review.userName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{review.userName}</span>
                  <StarRating rating={review.rating} size="sm" />
                  {review.isVerifiedPurchase && <Badge variant="secondary" className="text-[10px]">Verified</Badge>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                  <span className="text-xs text-muted-foreground">on {review.productName}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600"><Check className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><X className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
