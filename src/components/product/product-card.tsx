"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceTag } from "@/components/shared/price-tag";
import { StarRating } from "@/components/shared/star-rating";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import type { IProduct } from "@/types/product.types";
import { getStockStatus } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stockQuantity);
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Link href={`/products/${product.id}`}>
              {primaryImage ? (
                <ImageWithFallback
                  src={primaryImage.imageUrl}
                  alt={primaryImage.altText || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground/20">
                  {product.name.charAt(0)}
                </div>
              )}
            </Link>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isFeatured && (
                <Badge className="text-xs bg-amber-500 hover:bg-amber-600">
                  Featured
                </Badge>
              )}
              {stockStatus === "low-stock" && (
                <Badge variant="secondary" className="text-xs text-amber-600">
                  Low Stock
                </Badge>
              )}
              {stockStatus === "out-of-stock" && (
                <Badge variant="secondary" className="text-xs text-destructive">
                  Sold Out
                </Badge>
              )}
            </div>

            {/* Hover Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-sm"
                aria-label="Add to wishlist"
              >
                <Heart className="h-3.5 w-3.5" />
              </Button>
              <Link href={`/products/${product.id}`}>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full shadow-sm"
                  aria-label="Quick view"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Quick add to cart */}
            {stockStatus !== "out-of-stock" && (
              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                <Button
                  size="sm"
                  className="w-full gap-2 shadow-lg"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            {product.brandName && (
              <p className="text-xs text-muted-foreground mb-1">{product.brandName}</p>
            )}
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="mt-2">
              <StarRating
                rating={product.averageRating}
                size="sm"
                count={product.totalReviews}
              />
            </div>

            <div className="mt-2">
              <PriceTag
                price={product.basePrice}
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="aspect-square w-full" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
