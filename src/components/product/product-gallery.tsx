"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { cn } from "@/lib/utils";
import type { IProductImage } from "@/types/product.types";

interface ProductGalleryProps {
  images: IProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const sorted = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const currentImage = sorted[selectedIndex];
  if (!currentImage) return null;

  const prev = () => setSelectedIndex((i) => (i === 0 ? sorted.length - 1 : i - 1));
  const next = () => setSelectedIndex((i) => (i === sorted.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted group">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={currentImage.imageUrl}
                alt={currentImage.altText || productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {sorted.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={next}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setLightboxOpen(true)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Thumbnails */}
        {sorted.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sorted.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                  i === selectedIndex
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                <ImageWithFallback
                  src={img.imageUrl}
                  alt={img.altText || `${productName} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <div className="relative aspect-square">
            <ImageWithFallback
              src={currentImage.imageUrl}
              alt={currentImage.altText || productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
            {sorted.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={prev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={next}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
