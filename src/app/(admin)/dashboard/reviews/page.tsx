"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StarRating } from "@/components/shared/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { reviewService } from "@/services/review-service";
import { formatDate, getInitials } from "@/lib/utils";
import { Check, X } from "lucide-react";

export default function AdminReviewsPage() {
  // Reviews can only be fetched per product; admin view not available without a product context
  return (
    <div>
      <PageHeader title="Reviews" description="Moderate customer reviews" />
      <EmptyState title="Review moderation" description="Visit individual product pages to moderate reviews." />
    </div>
  );
}
