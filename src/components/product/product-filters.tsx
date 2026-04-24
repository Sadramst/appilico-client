"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/stores/search-store";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { SORT_OPTIONS } from "@/lib/constants";
import type { ProductSortBy } from "@/types/product.types";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sortBy,
    setCategoryId,
    setBrandId,
    setPriceRange,
    setMinRating,
    setInStock,
    setSortBy,
    clearFilters,
  } = useSearchStore();
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  const categories = categoriesData?.data ?? [];
  const brands = brandsData?.data ?? [];

  const activeFilterCount = [
    categoryId,
    brandId,
    minPrice !== null,
    maxPrice !== null,
    minRating,
    inStock,
  ].filter(Boolean).length;

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as ProductSortBy)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <Label>Category</Label>
          <ScrollArea className="max-h-40">
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={categoryId === cat.id}
                    onCheckedChange={(checked) =>
                      setCategoryId(checked ? cat.id : null)
                    }
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <Separator />

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <Label>Brand</Label>
          <ScrollArea className="max-h-40">
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={brandId === brand.id}
                    onCheckedChange={(checked) =>
                      setBrandId(checked ? brand.id : null)
                    }
                  />
                  <span className="text-sm">{brand.name}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range</Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[minPrice ?? 0, maxPrice ?? 1000]}
          onValueChange={(values) => {
            const v = Array.isArray(values) ? values : [values];
            const min = v[0] ?? 0;
            const max = v[1] ?? 1000;
            setPriceRange(min > 0 ? min : null, max < 1000 ? max : null);
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${minPrice ?? 0}</span>
          <span>${maxPrice ?? 1000}</span>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <Label>Minimum Rating</Label>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((r) => (
            <Button
              key={r}
              variant={minRating === r ? "default" : "outline"}
              size="sm"
              onClick={() => setMinRating(minRating === r ? null : r)}
            >
              {r}+ ★
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* In Stock */}
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={inStock}
          onCheckedChange={(checked) => setInStock(!!checked)}
        />
        <span className="text-sm">In stock only</span>
      </label>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0">{filterContent}</aside>

      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground h-8"
          >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)] mt-4">
              {filterContent}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
