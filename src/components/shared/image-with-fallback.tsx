"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error && !fallbackSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width: props.width, height: props.height }}
      >
        <ImageIcon className="h-8 w-8" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={error && fallbackSrc ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
