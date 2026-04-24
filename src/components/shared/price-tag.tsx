"use client";

import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: { price: "text-sm font-semibold", compare: "text-xs", badge: "text-[10px] px-1 py-0.5" },
  md: { price: "text-base font-bold", compare: "text-sm", badge: "text-xs px-1.5 py-0.5" },
  lg: { price: "text-2xl font-bold", compare: "text-base", badge: "text-sm px-2 py-1" },
};

export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  className,
}: PriceTagProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discount = hasDiscount ? getDiscountPercentage(compareAtPrice, price) : 0;
  const classes = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span
        className={cn(
          classes.price,
          hasDiscount ? "text-destructive" : "text-foreground"
        )}
      >
        {formatPrice(price)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={cn(
              classes.compare,
              "text-muted-foreground line-through"
            )}
          >
            {formatPrice(compareAtPrice)}
          </span>
          <span
            className={cn(
              classes.badge,
              "bg-destructive/10 text-destructive rounded-full font-medium"
            )}
          >
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
