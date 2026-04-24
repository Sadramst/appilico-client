"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/use-brands";

export default function AdminBrandsPage() {
  const { data, isLoading } = useBrands();
  const brands = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Brands" description="Manage product brands">
        <Button className="gap-2"><Plus className="h-4 w-4" />Add Brand</Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : brands.length === 0 ? (
        <EmptyState title="No brands" description="Add brands to categorize products." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="text-left py-3 font-medium">Name</th><th className="text-left py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{brand.name}</td>
                  <td className="py-3"><span className={`text-xs font-medium ${brand.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>{brand.isActive ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
