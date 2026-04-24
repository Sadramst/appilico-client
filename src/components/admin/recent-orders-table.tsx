"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_COLORS } from "@/lib/constants";
import type { IRecentOrder } from "@/types/dashboard.types";

interface RecentOrdersTableProps {
  orders: IRecentOrder[];
  isLoading?: boolean;
}

export function RecentOrdersTable({ orders, isLoading }: RecentOrdersTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
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
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 font-medium">#{order.orderNumber}</td>
                  <td className="py-3 hidden sm:table-cell text-muted-foreground">
                    {order.customerName ?? "Guest"}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${ORDER_STATUS_COLORS[order.status] ?? ""}`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 text-right text-muted-foreground hidden md:table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 text-right">
                    <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
