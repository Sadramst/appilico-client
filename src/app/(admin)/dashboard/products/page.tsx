"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ProductCardSkeleton } from "@/components/product/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const { data, isLoading } = useProducts({ page: 1, pageSize: 20 });
  const products = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Products" description="Manage your product catalog">
        <Button asChild className="gap-2">
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </PageHeader>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to get started."
          actionLabel="Add Product"
          actionHref="/dashboard/products/new"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-3 font-medium">Product</th>
                <th className="text-left py-3 font-medium">Category</th>
                <th className="text-left py-3 font-medium">Price</th>
                <th className="text-left py-3 font-medium">Stock</th>
                <th className="text-left py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="py-3">
                    <Link href={`/dashboard/products/${product.id}`} className="font-medium hover:text-primary">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-3 text-muted-foreground">{product.categoryName}</td>
                  <td className="py-3">{formatPrice(product.basePrice)}</td>
                  <td className="py-3">{product.stockQuantity}</td>
                  <td className="py-3">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Draft"}
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
