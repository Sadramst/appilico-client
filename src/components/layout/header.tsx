"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  ChevronDown,
  LogIn,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { AppilicoLogo } from "@/components/shared/appilico-logo";
import { useCart } from "@/hooks/use-cart";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useCategoryTree } from "@/hooks/use-categories";
import { NAV_LINKS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { ICategoryTree } from "@/types/category.types";

function CategoryMegaMenu({
  categories,
  onClose,
}: {
  categories: ICategoryTree[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 right-0 z-50 border-b bg-background shadow-lg"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat) => (
            <div key={cat.id}>
              <Link
                href={`/products?categoryId=${cat.id}`}
                className="font-semibold text-sm hover:text-primary transition-colors"
                onClick={onClose}
              >
                {cat.name}
              </Link>
              {cat.subCategories.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {cat.subCategories.slice(0, 6).map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/products?categoryId=${sub.id}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={onClose}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/categories"
            className="text-sm font-medium text-primary hover:underline"
            onClick={onClose}
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { isAuthenticated, user } = useAuthStore();
  const { setMobileNavOpen, setSearchOpen } = useUIStore();
  const { data: categoryTreeData } = useCategoryTree();
  const categories = categoryTreeData?.data ?? [];
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <AppilicoLogo size={32} />
            <span className="text-xl font-bold hidden sm:inline-block">
              Appilico
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const isCategories = link.href === "/categories";
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => isCategories && setMegaMenuOpen(true)}
                onMouseLeave={() => isCategories && setMegaMenuOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted flex items-center gap-1 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                  {isCategories && <ChevronDown className="h-3 w-3" />}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          {isAuthenticated && (
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex" aria-label="Wishlist">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={openCart}
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground">
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="gap-2 h-9 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar ?? undefined} alt={user ? `${user.firstName} ${user.lastName}` : undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {user ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user?.firstName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/addresses" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Addresses
                  </Link>
                </DropdownMenuItem>
                {(user?.roles?.includes("Admin") || user?.roles?.includes("SuperAdmin")) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Category Mega Menu */}
      <AnimatePresence>
        {megaMenuOpen && categories.length > 0 && (
          <CategoryMegaMenu
            categories={categories}
            onClose={() => setMegaMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
