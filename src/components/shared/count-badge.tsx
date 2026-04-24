"use client";

import { cn } from "@/lib/utils";

interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: "default" | "primary" | "destructive";
  className?: string;
}

const variantClasses = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

export function CountBadge({
  count,
  max = 99,
  variant = "primary",
  className,
}: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-[10px] font-bold min-w-[18px] h-[18px] px-1",
        variantClasses[variant],
        className
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
