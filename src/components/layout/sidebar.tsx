"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, CreditCard, Shield, Star, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCOUNT_NAV_LINKS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  "/profile": User,
  "/orders": Package,
  "/wishlist": Heart,
  "/addresses": MapPin,
  "/payment-methods": CreditCard,
  "/security": Shield,
  "/reviews": Star,
  "/settings": Settings,
};

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <nav className="space-y-1">
        {ACCOUNT_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.href] ?? User;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
