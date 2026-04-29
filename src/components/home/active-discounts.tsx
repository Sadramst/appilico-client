"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useActiveDiscounts } from "@/hooks/use-discounts";
import { DiscountTypeLabels } from "@/types/discount.types";

export function ActiveDiscountsBanner() {
  const { data, isLoading } = useActiveDiscounts();
  const discounts = data?.data ?? [];

  if (isLoading || discounts.length === 0) return null;

  return (
    <section className="bg-primary/5 border-y">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
          <Tag className="h-4 w-4 text-primary shrink-0" />
          {discounts.slice(0, 3).map((discount) => (
            <div key={discount.id} className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-xs font-semibold">
                {discount.code}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {discount.discountType === 0
                  ? `${discount.value}% off`
                  : `$${discount.value} off`}
                {discount.minOrderAmount
                  ? ` on orders over $${discount.minOrderAmount}`
                  : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
