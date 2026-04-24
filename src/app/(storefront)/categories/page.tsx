"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";

const categoryColors = [
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-purple-500 to-purple-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
  "from-teal-500 to-teal-600",
];

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const categories = data?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <PageHeader
        title="Categories"
        description="Browse products by category"
        className="mt-4"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))
          : categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/products?category=${category.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-0">
                      <div
                        className={`aspect-[4/3] bg-gradient-to-br ${
                          categoryColors[index % categoryColors.length]
                        } flex items-center justify-center`}
                      >
                        <span className="text-5xl font-bold text-white/80 group-hover:scale-110 transition-transform">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {category.productCount ?? 0} products
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
