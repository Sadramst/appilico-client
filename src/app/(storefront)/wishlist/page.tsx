"use client";

import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { AccountSidebar } from "@/components/layout/sidebar";
import { EmptyState } from "@/components/shared/empty-state";
import { PriceTag } from "@/components/shared/price-tag";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/hooks/use-wishlist";

export default function WishlistPage() {
  const { items, isLoading, remove } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader title="Wishlist" className="mt-4" />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              variant="wishlist"
              title="Your wishlist is empty"
              description="Save items you love and want to buy later."
              actionLabel="Browse Products"
              actionHref="/products"
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="overflow-hidden group">
                      <CardContent className="p-0">
                        <Link href={`/products/${item.slug}`}>
                          <div className="aspect-square bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground/20">
                            {item.name.charAt(0)}
                          </div>
                        </Link>
                        <div className="p-3 space-y-2">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <PriceTag price={item.price} size="sm" />
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 gap-1 text-xs">
                              <ShoppingCart className="h-3 w-3" />
                              Add to Cart
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                remove(item.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
