"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/use-products";
import { useProductReviews } from "@/hooks/use-reviews";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: productData, isLoading, error } = useProduct(slug);
  const product = productData?.data;

  const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(
    product?.id ?? "",
    { page: 1, pageSize: 10 }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const reviews = reviewsData?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Reviews */}
      <Separator className="my-12" />
      <section>
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <ProductReviews
          reviews={reviews}
          averageRating={product.averageRating}
          reviewCount={product.totalReviews}
          isLoading={reviewsLoading}
        />
      </section>
    </div>
  );
}
