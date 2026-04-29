"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Share2, Minus, Plus, Check, Truck, RotateCcw, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceTag } from "@/components/shared/price-tag";
import { StarRating } from "@/components/shared/star-rating";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuthStore } from "@/stores/auth-store";
import { formatNumber, getStockStatus } from "@/lib/utils";
import type { IProduct, IProductVariant } from "@/types/product.types";

interface ProductInfoProps {
  product: IProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const { addItem } = useCart();
  const { isAuthenticated } = useAuthStore();
  const { toggle: toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const stockStatus = getStockStatus(
    selectedVariant?.stockQuantity ?? product.stockQuantity
  );

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant?.id ?? product.id,
      productId: product.id,
      productName: product.name,
      imageUrl: product.images.find((i) => i.isPrimary)?.imageUrl ?? product.images[0]?.imageUrl ?? null,
      variantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.variantName ?? null,
      unitPrice: selectedVariant?.price ?? product.basePrice,
      quantity,
      lineTotal: (selectedVariant?.price ?? product.basePrice) * quantity,
    });
    toast.success("Added to cart", { description: `${product.name} × ${quantity}` });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        {product.brandName && (
          <p className="text-sm text-primary font-medium mb-1">{product.brandName}</p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>

        <div className="flex items-center gap-4 mt-3">
          <StarRating rating={product.averageRating} showValue count={product.totalReviews} />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">
            {product.totalReviews} reviews
          </span>
        </div>
      </div>

      {/* Price */}
      <PriceTag
        price={selectedVariant?.price ?? product.basePrice}
        size="lg"
      />

      {/* Description */}
      <p className="text-muted-foreground">{product.description}</p>

      <Separator />

      {/* Variants */}
      {product.variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Variant</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants
              .map((variant) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1);
                  }}
                  disabled={variant.stockQuantity === 0}
                  className="gap-2"
                >
                  {selectedVariant?.id === variant.id && <Check className="h-3 w-3" />}
                  {variant.variantName}
                  {variant.stockQuantity === 0 && (
                    <span className="text-xs">(Sold Out)</span>
                  )}
                </Button>
              ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={quantity >= (selectedVariant?.stockQuantity ?? product.stockQuantity)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={stockStatus === "out-of-stock"}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {stockStatus === "out-of-stock" ? "Sold Out" : "Add to Cart"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Please sign in to use the wishlist");
              return;
            }
            toggleWishlist(product.id);
          }}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </Button>

        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={handleShare} aria-label="Share">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {stockStatus === "in-stock" && (
          <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
            <Check className="h-3 w-3 mr-1" /> In Stock
          </Badge>
        )}
        {stockStatus === "low-stock" && (
          <Badge variant="secondary" className="text-amber-600 bg-amber-50 dark:bg-amber-950/30">
            Only {selectedVariant?.stockQuantity ?? product.stockQuantity} left
          </Badge>
        )}
        {stockStatus === "out-of-stock" && (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Truck, text: "Free Shipping" },
          { icon: RotateCcw, text: "30-Day Returns" },
          { icon: Shield, text: "2-Year Warranty" },
        ].map((item) => (
          <div
            key={item.text}
            className="flex flex-col items-center gap-1 text-center p-3 rounded-lg bg-muted/50"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{item.text}</span>
          </div>
        ))}
      </div>

      <Separator />

      {/* Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </TabsContent>
        <TabsContent value="shipping" className="mt-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Free standard shipping on orders over $50.</p>
            <p>Express shipping available at checkout.</p>
            <p>Estimated delivery: 3-5 business days (standard), 1-2 business days (express).</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
