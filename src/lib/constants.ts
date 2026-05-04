export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.appilico.com/api/v1";

export const APP_NAME = "Appilico";
export const APP_DESCRIPTION = "Your premium e-commerce destination";

export const ROLES = {
  CUSTOMER: "Customer",
  MANAGER: "Manager",
  ADMIN: "Admin",
  SUPER_ADMIN: "SuperAdmin",
} as const;

export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  RETURNED: "Returned",
} as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  Shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Returned: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  PartialRefund: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export const LOYALTY_TIERS = {
  BRONZE: { name: "Bronze", minPoints: 0, color: "text-amber-700" },
  SILVER: { name: "Silver", minPoints: 500, color: "text-gray-400" },
  GOLD: { name: "Gold", minPoints: 2000, color: "text-yellow-500" },
  PLATINUM: { name: "Platinum", minPoints: 5000, color: "text-blue-400" },
} as const;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Name: A-Z", value: "name-asc" },
  { label: "Name: Z-A", value: "name-desc" },
] as const;

export const PAGE_SIZES = [12, 24, 36, 48] as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

export const CURRENCY = {
  CODE: "USD",
  SYMBOL: "$",
  LOCALE: "en-US",
} as const;

export const IMAGE_PLACEHOLDER = "/images/placeholder-product.webp";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Offers", href: "/offers" },
] as const;

export const ACCOUNT_NAV_LINKS = [
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Orders", href: "/orders", icon: "Package" },
  { label: "Addresses", href: "/addresses", icon: "MapPin" },
  { label: "Wishlist", href: "/wishlist", icon: "Heart" },
  { label: "Vouchers", href: "/vouchers", icon: "Ticket" },
  { label: "Reviews", href: "/reviews", icon: "Star" },
  { label: "Loyalty", href: "/loyalty", icon: "Award" },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/dashboard/products", icon: "Package" },
  { label: "Categories", href: "/dashboard/categories", icon: "FolderTree" },
  { label: "Brands", href: "/dashboard/brands", icon: "Tag" },
  { label: "Orders", href: "/dashboard/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/dashboard/customers", icon: "Users" },
  { label: "Discounts", href: "/dashboard/discounts", icon: "Percent" },
  { label: "Vouchers", href: "/dashboard/vouchers", icon: "Ticket" },
  { label: "Special Offers", href: "/dashboard/offers", icon: "Zap" },
  { label: "Inventory", href: "/dashboard/inventory", icon: "Warehouse" },
  { label: "Reviews", href: "/dashboard/reviews", icon: "MessageSquare" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;
