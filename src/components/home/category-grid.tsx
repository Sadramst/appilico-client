"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
];

export function CategoryGrid() {
  const { data, isLoading } = useCategories();
  const categories = data?.data?.slice(0, 6) ?? [];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse our curated categories
          </p>
        </div>
        <Link
          href="/categories"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))
          : categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-0">
                      <div
                        className={`aspect-square bg-gradient-to-br ${
                          categoryColors[index % categoryColors.length]
                        } flex items-center justify-center relative`}
                      >
                        <span className="text-3xl font-bold text-white/80 group-hover:scale-110 transition-transform duration-300">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-medium text-sm truncate">{category.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {category.productCount ?? 0} items
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
