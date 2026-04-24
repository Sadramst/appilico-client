"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/use-brands";

export default function BrandsPage() {
  const { data, isLoading } = useBrands();
  const brands = data?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader
        title="Brands"
        description="Discover products from top brands"
        className="mt-4"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))
          : brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/products?brand=${brand.id}`}>
                  <Card className="group overflow-hidden hover:shadow-md transition-all text-center">
                    <CardContent className="p-6 flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {brand.name.charAt(0)}
                      </div>
                      <h3 className="font-medium text-sm">{brand.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
