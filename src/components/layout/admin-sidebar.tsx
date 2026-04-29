"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  Layers,
  Ticket,
  Percent,
  Zap,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUIStore } from "@/stores/ui-store";
import { AppilicoLogo } from "@/components/shared/appilico-logo";
import { ADMIN_NAV_LINKS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  Products: ShoppingBag,
  Orders: Package,
  Customers: Users,
  Brands: Tag,
  Categories: Layers,
  Vouchers: Ticket,
  Discounts: Percent,
  "Special Offers": Zap,
  Inventory: Warehouse,
  Reviews: Star,
  Analytics: BarChart3,
  Settings: Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const isSidebarCollapsed = !isSidebarOpen;

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isSidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <AppilicoLogo size={32} />
            <span className="text-lg font-bold">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 shrink-0", isSidebarCollapsed && "mx-auto")}
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.label] ?? LayoutDashboard;
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            const linkContent = (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isSidebarCollapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );

            if (isSidebarCollapsed) {
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{link.label}</TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <Separator />
      <div className="p-4">
        {!isSidebarCollapsed && (
          <p className="text-xs text-muted-foreground text-center">
            Appilico Admin v1.0
          </p>
        )}
      </div>
    </aside>
  );
}
