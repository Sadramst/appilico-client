import { test as base, expect, Page, BrowserContext } from "@playwright/test";

const API_URL = process.env.API_URL ?? "https://api.appilico.com/api/v1";
const CUSTOMER_EMAIL = process.env.CUSTOMER_EMAIL ?? "customer1@appilico.com";
const CUSTOMER_PASSWORD = process.env.CUSTOMER_PASSWORD ?? "Customer@123!";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@appilico.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123!";

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

async function loginViaAPI(page: Page, context: BrowserContext, email: string, password: string) {
  const resp = await page.request.post(`${API_URL}/auth/login`, {
    data: { email, password },
  });
  const body = await resp.json();
  const { accessToken, refreshToken, user } = body.data;
  await page.evaluate(
    ({ accessToken, refreshToken, user }) => {
      localStorage.setItem("appilico_access_token", accessToken);
      localStorage.setItem("appilico_refresh_token", refreshToken);
      localStorage.setItem(
        "appilico_user",
        JSON.stringify({
          state: { user, accessToken, refreshToken, isAuthenticated: true, isLoading: false },
          version: 0,
        })
      );
    },
    { accessToken, refreshToken, user }
  );
  // Set cookie so Next.js middleware can protect routes
  const expires = Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000);
  await context.addCookies([
    {
      name: "appilico_access_token",
      value: accessToken,
      domain: "localhost",
      path: "/",
      expires,
      sameSite: "Strict",
    },
  ]);
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, context }, use) => {
    await page.goto("/");
    await loginViaAPI(page, context, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
    await page.reload();
    await use(page);
  },
  adminPage: async ({ page, context }, use) => {
    await page.goto("/");
    await loginViaAPI(page, context, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.reload();
    await use(page);
  },
});

export { expect, API_URL, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD };
