"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPrice, formatNumber } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: LucideIcon;
  format?: "number" | "currency" | "percent";
  className?: string;
  index?: number;
}

export function StatsCard({
  title,
  value,
  previousValue,
  icon: Icon,
  format = "number",
  className,
  index = 0,
}: StatsCardProps) {
  const formattedValue =
    format === "currency"
      ? formatPrice(value)
      : format === "percent"
      ? `${value.toFixed(1)}%`
      : formatNumber(value);

  const change =
    previousValue && previousValue > 0
      ? ((value - previousValue) / previousValue) * 100
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn("hover:shadow-sm transition-shadow", className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className="text-2xl font-bold tracking-tight">{formattedValue}</p>
              {change !== null && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    change >= 0 ? "text-emerald-600" : "text-destructive"
                  )}
                >
                  {change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(change).toFixed(1)}% vs last period
                </div>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
