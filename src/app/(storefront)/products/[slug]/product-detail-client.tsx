"use client";

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/use-products";
import { useProductReviews } from "@/hooks/use-reviews";

interface ProductDetailClientProps {
  slug: string;
}

export function ProductDetailClient({ slug }: ProductDetailClientProps) {
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
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((img) => img.imageUrl),
    brand: {
      "@type": "Brand",
      name: product.brandName,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.basePrice,
      availability:
        product.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://appilico.store"}/products/${product.id}`,
    },
    aggregateRating:
      product.totalReviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.totalReviews,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
    </>
  );
}
