import { test as base, expect, Page } from "@playwright/test";

const API_URL = process.env.API_URL ?? "https://api.appilico.com/api";
const CUSTOMER_EMAIL = process.env.CUSTOMER_EMAIL ?? "customer1@appilico.com";
const CUSTOMER_PASSWORD = process.env.CUSTOMER_PASSWORD ?? "Customer@123!";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@appilico.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123!";

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

async function loginViaAPI(page: Page, email: string, password: string) {
  const resp = await page.request.post(`${API_URL}/auth/login`, {
    data: { email, password },
  });
  const body = await resp.json();
  const { accessToken, refreshToken, user } = body.data;
  await page.evaluate(
    ({ accessToken, refreshToken, user }) => {
      localStorage.setItem("appilico_access_token", accessToken);
      localStorage.setItem("appilico_refresh_token", refreshToken);
      localStorage.setItem("appilico_user", JSON.stringify(user));
    },
    { accessToken, refreshToken, user }
  );
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/");
    await loginViaAPI(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
    await page.reload();
    await use(page);
  },
  adminPage: async ({ page }, use) => {
    await page.goto("/");
    await loginViaAPI(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.reload();
    await use(page);
  },
});

export { expect, API_URL, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD };
