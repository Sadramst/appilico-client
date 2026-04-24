"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/stores/ui-store";
import { useSearchStore } from "@/stores/search-store";
import { useDebounce } from "@/hooks/use-debounce";
import { useProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";

export function SearchBar() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const { query, setQuery, clearFilters } = useSearchStore();
  const [localQuery, setLocalQuery] = useState(query);
  const debouncedQuery = useDebounce(localQuery, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isLoading } = useProducts(
    debouncedQuery.length >= 2 ? { searchTerm: debouncedQuery, pageSize: 5 } : undefined
  );

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setLocalQuery("");
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setQuery(localQuery.trim());
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const handleProductClick = (productId: string) => {
    setSearchOpen(false);
    setLocalQuery("");
    router.push(`/products/${productId}`);
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <form onSubmit={handleSearch} className="flex items-center border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search products, categories, brands..."
            className="border-0 focus-visible:ring-0 text-base"
          />
          {localQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setLocalQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        <AnimatePresence>
          {debouncedQuery.length >= 2 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-2 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : results?.data && results.data.length > 0 ? (
                  <div className="space-y-1">
                    {results.data.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-3 w-full rounded-lg p-2 text-left hover:bg-muted transition-colors"
                      >
                        <div className="h-10 w-10 rounded bg-muted shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(product.basePrice)}
                          </p>
                        </div>
                      </button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-primary"
                      onClick={() => handleSearch(new Event("submit") as unknown as React.FormEvent)}
                    >
                      View all results for &ldquo;{debouncedQuery}&rdquo;
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No products found for &ldquo;{debouncedQuery}&rdquo;
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
