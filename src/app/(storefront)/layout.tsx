import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchBar } from "@/components/shared/search-bar";
import { BackToTop } from "@/components/shared/back-to-top";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <MobileNav />
      <SearchBar />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
