"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { useFeaturedProducts } from "@/hooks/use-products";

export function TrendingProducts() {
  const { data, isLoading } = useFeaturedProducts();
  const products = data?.data ?? [];

  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Trending Now
          </h2>
          <p className="text-muted-foreground mt-1">
            What everyone is buying this week
          </p>
        </div>
        <Link
          href="/products?sort=popular"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
      </div>
    </section>
  );
}
