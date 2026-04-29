"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Truck, text: "Free shipping over $50" },
  { icon: Shield, text: "Secure checkout" },
  { icon: Star, text: "Premium quality" },
];

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-emerald-500/15 backdrop-blur-sm text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-emerald-500/20">
              <Star className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
              New Collection 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
          >
            Discover
            <br />
            <span className="text-emerald-400">Premium Products</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-300 mt-6 max-w-lg"
          >
            Explore our curated collection of high-quality products. From trending items
            to everyday essentials, find exactly what you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mt-8"
          >
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 text-white hover:bg-emerald-400 font-semibold"
            >
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/offers">
                View Offers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-6 mt-12"
          >
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-2 text-slate-300 text-sm">
                <feature.icon className="h-4 w-4 text-emerald-400" />
                {feature.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
