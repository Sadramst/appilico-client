"use client";

import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/admin/stats-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { TopProductsList } from "@/components/admin/top-products-list";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const stats = data?.data;

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your store's performance" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Total Revenue"
              value={stats?.salesSummary?.totalRevenue ?? 0}
              icon={DollarSign}
              format="currency"
              index={0}
            />
            <StatsCard
              title="Total Orders"
              value={stats?.salesSummary?.totalOrders ?? 0}
              icon={ShoppingCart}
              index={1}
            />
            <StatsCard
              title="Total Customers"
              value={stats?.customerStats?.totalCustomers ?? 0}
              icon={Users}
              index={2}
            />
            <StatsCard
              title="Active Customers"
              value={stats?.customerStats?.activeCustomers ?? 0}
              icon={Package}
              index={3}
            />
          </>
        )}
      </div>

      {/* Charts & Tables */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart data={stats?.revenueData ?? []} isLoading={isLoading} />
        </div>
        <div>
          <TopProductsList products={stats?.topProducts ?? []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
