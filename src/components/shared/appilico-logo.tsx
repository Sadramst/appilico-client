"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AppilicoLogoProps {
  size?: number;
  className?: string;
}

export function AppilicoLogo({ size = 32, className }: AppilicoLogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Appilico"
      width={size}
      height={size}
      className={cn("rounded-lg", className)}
      priority
    />
  );
}
