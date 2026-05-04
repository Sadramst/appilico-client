"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { useProducts } from "@/hooks/use-products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const brandId = searchParams.get("brandId") ?? undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const inStockOnly = searchParams.get("inStock") === "true" || undefined;
  const sortBy = searchParams.get("sort") ?? undefined;

  const buildUrl = useCallback(
    (overrides: Record<string, string | number | boolean | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(overrides).forEach(([key, value]) => {
        if (value === undefined || value === null || value === false || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      params.delete("page"); // reset page on filter change
      return `/products?${params.toString()}`;
    },
    [searchParams]
  );

  const { data, isLoading } = useProducts({
    page,
    pageSize: 12,
    searchTerm: search,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly: inStockOnly || undefined,
    sortBy,
  });

  const products = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const pageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />

      <PageHeader
        title="Products"
        description={search ? `Results for "${search}"` : "Browse our entire collection"}
        className="mt-4"
      />

      <div className="flex gap-8">
        <ProductFilters buildUrl={buildUrl} />
        <div className="flex-1">
          <ProductGrid products={products} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={pageUrl(page - 1)} />
                    </PaginationItem>
                  )}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink href={pageUrl(p)} isActive={p === page}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={pageUrl(page + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}

