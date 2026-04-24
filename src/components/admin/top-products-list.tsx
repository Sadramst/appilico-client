"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatNumber } from "@/lib/utils";
import type { ITopProduct } from "@/types/dashboard.types";

interface TopProductsListProps {
  products: ITopProduct[];
  isLoading?: boolean;
}

export function TopProductsList({ products, isLoading }: TopProductsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.productId} className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-6">
                #{index + 1}
              </span>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                {product.productName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(product.totalSold)} sold
                </p>
              </div>
              <span className="text-sm font-semibold">
                {formatPrice(product.totalRevenue)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
