"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventory } from "@/hooks/use-inventory";

export default function AdminInventoryPage() {
  const { data, isLoading } = useInventory({ page: 1, pageSize: 20 });
  const items = data?.data?.items ?? [];

  return (
    <div>
      <PageHeader title="Inventory" description="Track stock levels across products" />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No inventory data" description="Inventory data will appear once products are created." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="text-left py-3 font-medium">Product</th><th className="text-left py-3 font-medium">SKU</th><th className="text-right py-3 font-medium">In Stock</th><th className="text-left py-3 font-medium">Status</th></tr></thead>
            <tbody>
              {items.map((item) => (
                  <tr key={item.productId} className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">{item.productName}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{item.productSku}</td>
                    <td className="py-3 text-right">{item.currentStock}</td>
                    <td className="py-3">
                      <Badge variant={item.currentStock === 0 ? "destructive" : item.isLowStock ? "secondary" : "default"}>
                        {item.currentStock === 0 ? "Out of Stock" : item.isLowStock ? "Low Stock" : "In Stock"}
                      </Badge>
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
