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
import { useCategoryTree } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { SORT_OPTIONS } from "@/lib/constants";
import type { ICategoryTree } from "@/types/category.types";

function CategoryTreeNode({
  category,
  selectedId,
  onSelect,
  depth = 0,
}: {
  category: ICategoryTree;
  selectedId: string | undefined;
  onSelect: (id: string | undefined) => void;
  depth?: number;
}) {
  return (
    <div>
      <label
        className="flex items-center gap-2 cursor-pointer"
        style={{ paddingLeft: depth * 16 }}
      >
        <Checkbox
          checked={selectedId === category.id}
          onCheckedChange={(checked) => onSelect(checked ? category.id : undefined)}
        />
        <span className="text-sm">{category.name}</span>
        {category.productCount > 0 && (
          <span className="text-xs text-muted-foreground">({category.productCount})</span>
        )}
      </label>
      {category.subCategories?.map((sub) => (
        <CategoryTreeNode
          key={sub.id}
          category={sub}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

interface ProductFiltersProps {
  buildUrl: (overrides: Record<string, string | number | boolean | undefined>) => string;
}

export function ProductFilters({ buildUrl }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoriesData } = useCategoryTree();
  const { data: brandsData } = useBrands();

  const categories = categoriesData?.data ?? [];
  const brands = brandsData?.data ?? [];

  const categoryId = searchParams.get("categoryId") ?? undefined;
  const brandId = searchParams.get("brandId") ?? undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 1000;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const inStock = searchParams.get("inStock") === "true";
  const sortBy = searchParams.get("sort") ?? "newest";

  const navigate = (overrides: Record<string, string | number | boolean | undefined>) => {
    router.push(buildUrl(overrides));
  };

  const activeFilterCount = [
    categoryId,
    brandId,
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    minRating,
    inStock || undefined,
  ].filter(Boolean).length;

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["categoryId", "brandId", "minPrice", "maxPrice", "minRating", "inStock", "sort", "page"].forEach((k) =>
      params.delete(k)
    );
    router.push(`/products?${params.toString()}`);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={(v) => navigate({ sort: v ?? undefined })}>
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

      {/* Categories (Tree) */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <Label>Category</Label>
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
            {categories.map((cat) => (
              <CategoryTreeNode
                key={cat.id}
                category={cat}
                selectedId={categoryId}
                onSelect={(id) => navigate({ categoryId: id })}
              />
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <Label>Brand</Label>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={brandId === brand.id}
                  onCheckedChange={(checked) =>
                    navigate({ brandId: checked ? brand.id : undefined })
                  }
                />
                <span className="text-sm">{brand.name}</span>
              </label>
            ))}
          </div>
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
          value={[minPrice, maxPrice]}
          onValueChange={(values) => {
            const v = Array.isArray(values) ? values : [values];
            const min = v[0] ?? 0;
            const max = v[1] ?? 1000;
            navigate({
              minPrice: min > 0 ? min : undefined,
              maxPrice: max < 1000 ? max : undefined,
            });
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
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
              onClick={() => navigate({ minRating: minRating === r ? undefined : r })}
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
          onCheckedChange={(checked) => navigate({ inStock: checked ? true : undefined })}
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

