"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? undefined;

  const { data, isLoading } = useProducts({
    page,
    pageSize: 12,
    searchTerm: search,
  });

  const products = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />

      <PageHeader
        title="Products"
        description={search ? `Results for "${search}"` : "Browse our entire collection"}
        className="mt-4"
      />

      <div className="flex gap-8">
        <ProductFilters />
        <div className="flex-1">
          <ProductGrid products={products} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/products?page=${page - 1}`} />
                    </PaginationItem>
                  )}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink href={`/products?page=${p}`} isActive={p === page}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={`/products?page=${page + 1}`} />
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
