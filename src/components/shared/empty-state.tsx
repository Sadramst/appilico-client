"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Search, Heart, Package, FileQuestion, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
  variant?: "default" | "cart" | "search" | "wishlist" | "orders";
}

const variantIcons: Record<string, LucideIcon> = {
  cart: ShoppingBag,
  search: Search,
  wishlist: Heart,
  orders: Package,
  default: FileQuestion,
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
  variant = "default",
}: EmptyStateProps) {
  const Icon = icon ?? variantIcons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && (onAction || actionHref) && (
        <Button onClick={onAction} asChild={!!actionHref}>
          {actionHref ? <a href={actionHref}>{actionLabel}</a> : actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
