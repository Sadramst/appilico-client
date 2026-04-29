"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AppilicoLogoProps {
  size?: number;
  className?: string;
  /** Use dark background container for logo (needed on light backgrounds) */
  withBackground?: boolean;
}

export function AppilicoLogo({ size = 32, className, withBackground = false }: AppilicoLogoProps) {
  if (withBackground) {
    return (
      <div
        className={cn("bg-slate-900 rounded-lg flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="Appilico"
          width={size}
          height={size}
          className="rounded-lg object-contain"
          priority
        />
      </div>
    );
  }
  return (
    <Image
      src="/logo.png"
      alt="Appilico"
      width={size}
      height={size}
      className={cn("rounded-lg object-contain", className)}
      priority
    />
  );
}
