"use client";

import Link from "next/link";
import { ArrowRight, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CartSummary } from "@/components/cart/cart-summary";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <EmptyState
          variant="cart"
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Shopping Cart" className="mt-4">
        <Button variant="outline" size="sm" onClick={clearCart} className="gap-2 text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
          Clear Cart
        </Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border rounded-xl p-4 flex gap-4"
              >
                <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground/20">
                      {item.productName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-medium hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
                  )}
                  <p className="text-sm font-semibold mt-1">{formatPrice(item.unitPrice)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div>
          <div className="sticky top-24 space-y-4">
            <CartSummary />
            <Button asChild size="lg" className="w-full gap-2">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
