"use client";

import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrendingProducts } from "@/components/home/trending-products";
import { PromoBanner } from "@/components/home/promo-banner";
import { TrustBadges } from "@/components/home/trust-badges";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <FeaturedProducts />
      <CategoryGrid />
      <PromoBanner />
      <TrendingProducts />
    </>
  );
}
