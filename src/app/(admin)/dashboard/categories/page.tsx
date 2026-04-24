"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const categories = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Categories" description="Organize your product catalog">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories" description="Add categories to organize products." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-3 font-medium">Name</th>
                <th className="text-left py-3 font-medium">Products</th>
                <th className="text-left py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{cat.name}</td>
                  <td className="py-3 text-muted-foreground">{cat.productCount ?? 0}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${cat.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
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
