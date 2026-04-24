"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAllOrders } from "@/hooks/use-orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusLabels } from "@/types/order.types";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersPage() {
  const { data, isLoading } = useAllOrders({ pageNumber: 1, pageSize: 20 });
  const orders = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Orders" description="View and manage customer orders" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders will appear here once customers start purchasing." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-3 font-medium">Order</th>
                <th className="text-left py-3 font-medium hidden sm:table-cell">Customer</th>
                <th className="text-left py-3 font-medium">Status</th>
                <th className="text-right py-3 font-medium">Total</th>
                <th className="text-right py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-right py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">#{order.orderNumber}</td>
                  <td className="py-3 hidden sm:table-cell text-muted-foreground">{order.customerName ?? "Guest"}</td>
                  <td className="py-3">
                    <Badge variant="secondary">{OrderStatusLabels[order.orderStatus] ?? "Unknown"}</Badge>
                  </td>
                  <td className="py-3 text-right font-medium">{formatPrice(order.totalAmount)}</td>
                  <td className="py-3 text-right text-muted-foreground hidden md:table-cell">{formatDate(order.orderDate)}</td>
                  <td className="py-3 text-right">
                    <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                      <Link href={`/dashboard/orders/${order.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
