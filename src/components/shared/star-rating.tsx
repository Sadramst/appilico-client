"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  count?: number;
  className?: string;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRate,
  count,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const fillPercent = Math.min(100, Math.max(0, (rating - i) * 100));

          return (
            <button
              key={i}
              type={interactive ? "button" : undefined}
              disabled={!interactive}
              onClick={() => interactive && onRate?.(starValue)}
              className={cn(
                "relative",
                interactive &&
                  "cursor-pointer hover:scale-110 transition-transform focus:outline-none"
              )}
              aria-label={interactive ? `Rate ${starValue} stars` : undefined}
            >
              {/* Empty star */}
              <Star
                className={cn(
                  sizeMap[size],
                  "text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700"
                )}
              />
              {/* Filled star overlay */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  className={cn(
                    sizeMap[size],
                    "text-amber-400 fill-amber-400"
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
