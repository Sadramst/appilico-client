import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as appConfig } from "@/lib/config";

const PROTECTED_ROUTES = [
  "/checkout",
  "/profile",
  "/orders",
  "/addresses",
  "/wishlist",
  "/vouchers",
  "/reviews",
  "/loyalty",
];

const ADMIN_ROUTES = ["/dashboard"];
const ADMIN_ROLES = ["Admin", "SuperAdmin", "Manager"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtected && !isAdminRoute) {
    return NextResponse.next();
  }

  // Read persisted auth state from the Zustand persist key stored in cookies or localStorage.
  // Since middleware runs server-side, we check for a session cookie set by the auth store.
  const token = request.cookies.get(appConfig.auth.tokenKey)?.value
    ?? request.cookies.get("appilico_access_token")?.value;

  if (!token && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!token && isAdminRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/addresses/:path*",
    "/wishlist/:path*",
    "/vouchers/:path*",
    "/reviews/:path*",
    "/loyalty/:path*",
    "/dashboard/:path*",
  ],
};
