export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://appilico-server.onrender.com/api",
    timeout: 15000,
  },
  auth: {
    tokenKey: "appilico_access_token",
    refreshTokenKey: "appilico_refresh_token",
    userKey: "appilico_user",
  },
  cart: {
    storageKey: "appilico_cart",
    maxQuantity: 99,
  },
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 48,
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024,
    acceptedImageTypes: ["image/jpeg", "image/png", "image/webp"],
    maxImages: 10,
  },
  search: {
    debounceMs: 300,
    minLength: 2,
  },
} as const;
