"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllVouchers } from "@/hooks/use-vouchers";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminVouchersPage() {
  const { data, isLoading } = useAllVouchers({ page: 1, pageSize: 20 });
  const vouchers = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Vouchers" description="Manage voucher codes">
        <Button className="gap-2"><Plus className="h-4 w-4" />Create Voucher</Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : vouchers.length === 0 ? (
        <EmptyState title="No vouchers" description="Create voucher codes for discounts." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="text-left py-3 font-medium">Code</th><th className="text-left py-3 font-medium">Discount</th><th className="text-left py-3 font-medium hidden sm:table-cell">Uses</th><th className="text-left py-3 font-medium hidden md:table-cell">Expires</th><th className="text-left py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-mono font-medium">{v.code}</td>
                  <td className="py-3">{v.valueType === 0 ? `${v.value}%` : formatPrice(v.value)}</td>
                  <td className="py-3 hidden sm:table-cell text-muted-foreground">{v.currentRedemptions}/{v.maxRedemptions ?? "∞"}</td>
                  <td className="py-3 hidden md:table-cell text-muted-foreground">{formatDate(v.expiryDate)}</td>
                  <td className="py-3"><Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "Active" : "Inactive"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
