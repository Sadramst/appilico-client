"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, Tag, Layers, Zap, User, LogIn, LogOut, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { NAV_LINKS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Home,
  Products: ShoppingBag,
  Categories: Layers,
  Brands: Tag,
  Offers: Zap,
};

export function MobileNav() {
  const pathname = usePathname();
  const { isMobileNavOpen, setMobileNavOpen } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-left">
            <Link
              href="/"
              onClick={() => setMobileNavOpen(false)}
              className="text-2xl font-bold text-gradient"
            >
              Appilico
            </Link>
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <nav className="flex flex-col p-4 gap-1">
          <AnimatePresence>
            {NAV_LINKS.map((link, index) => {
              const Icon = iconMap[link.label] ?? Home;
              const isActive = pathname === link.href;

              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        <Separator />

        <div className="p-4 flex flex-col gap-1">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                {user?.firstName ?? "Profile"}
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              <Button
                variant="ghost"
                className="justify-start gap-3 px-3 text-sm text-destructive hover:text-destructive"
                onClick={() => setMobileNavOpen(false)}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
}
