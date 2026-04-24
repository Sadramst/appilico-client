"use client";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { AccountSidebar } from "@/components/layout/sidebar";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderCard, OrderCardSkeleton } from "@/components/order/order-card";
import { useMyOrders } from "@/hooks/use-orders";

export default function OrdersPage() {
  const { data, isLoading } = useMyOrders({ page: 1, pageSize: 20 });
  const orders = data?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="My Orders" className="mt-4" />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />

        <div className="flex-1 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)
          ) : orders.length === 0 ? (
            <EmptyState
              variant="orders"
              title="No orders yet"
              description="When you place an order, it will appear here."
              actionLabel="Start Shopping"
              actionHref="/products"
            />
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>
    </div>
  );
}
