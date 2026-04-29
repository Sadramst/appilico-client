"use client";

import Link from "next/link";
import { Package, ChevronRight, Eye, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusLabels } from "@/types/order.types";
import { useCancelOrder } from "@/hooks/use-orders";
import type { IOrder } from "@/types/order.types";

interface OrderCardProps {
  order: IOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const cancelOrder = useCancelOrder();
  const canCancel = order.orderStatus === 0 || order.orderStatus === 1;
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">
                  Order #{order.orderNumber}
                </h3>
                <Badge variant="secondary">
                  {OrderStatusLabels[order.orderStatus] ?? "Unknown"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(order.orderDate)} · {order.items.length} item
                {order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatPrice(order.totalAmount)}</span>
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-destructive hover:text-destructive"
                onClick={() => cancelOrder.mutate(order.id)}
                disabled={cancelOrder.isPending}
              >
                {cancelOrder.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                Cancel
              </Button>
            )}
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href={`/orders/${order.id}`}>
                <Eye className="h-3.5 w-3.5" />
                Details
              </Link>
            </Button>
          </div>
        </div>

        {/* Items preview */}
        {order.items.length > 0 && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="h-12 w-12 shrink-0 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {item.productName.charAt(0)}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="h-12 w-12 shrink-0 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{order.items.length - 4}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OrderCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
