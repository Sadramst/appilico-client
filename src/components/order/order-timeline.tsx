"use client";

import { Check, Circle, Package, Truck, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order.types";

interface OrderTimelineProps {
  status: OrderStatus;
}

const timelineSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "Pending", label: "Order Placed", icon: Clock },
  { status: "Confirmed", label: "Confirmed", icon: Check },
  { status: "Processing", label: "Processing", icon: Package },
  { status: "Shipped", label: "Shipped", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: MapPin },
];

const statusOrder: Record<string, number> = {
  Pending: 0,
  Confirmed: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
};

export function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = statusOrder[status] ?? -1;

  if (status === "Cancelled" || status === "Refunded" || status === "Returned") {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
          <Circle className="h-4 w-4 fill-current" />
        </div>
        <span className="text-sm font-medium text-destructive">{status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full py-4">
      {timelineSteps.map((step, index) => {
        const isCompleted = currentIndex >= index;
        const isCurrent = currentIndex === index;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium text-center whitespace-nowrap",
                  isCompleted ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < timelineSteps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-[-18px]",
                  currentIndex > index ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
