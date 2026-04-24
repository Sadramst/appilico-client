"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscounts } from "@/hooks/use-discounts";
import { formatDate } from "@/lib/utils";
import { DiscountTypeLabels } from "@/types/discount.types";

export default function AdminDiscountsPage() {
  const { data, isLoading } = useDiscounts({ page: 1, pageSize: 20 });
  const discounts = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Discounts" description="Manage automatic discounts">
        <Button className="gap-2"><Plus className="h-4 w-4" />Create Discount</Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : discounts.length === 0 ? (
        <EmptyState title="No discounts" description="Create discounts to boost sales." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="text-left py-3 font-medium">Name</th><th className="text-left py-3 font-medium">Value</th><th className="text-left py-3 font-medium hidden md:table-cell">Period</th><th className="text-left py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{d.name}</td>
                  <td className="py-3">{d.discountType === 0 ? `${d.value}%` : `$${d.value}`}</td>
                  <td className="py-3 hidden md:table-cell text-muted-foreground">{formatDate(d.startDate)} — {formatDate(d.endDate)}</td>
                  <td className="py-3"><Badge variant={d.isActive ? "default" : "secondary"}>{d.isActive ? "Active" : "Inactive"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
