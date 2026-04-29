import { test, expect, API_URL } from "../fixtures";

// ============================================================
// 05 - CART – Playwright
// ============================================================

async function addItemViaAPI(page: any) {
  const token = await page.evaluate(() => localStorage.getItem("appilico_access_token"));
  const productsResp = await page.request.get(`${API_URL}/products?page=1&pageSize=1`);
  const productsBody = await productsResp.json();
  const product = productsBody.data[0];
  if (product && token) {
    await page.request.post(`${API_URL}/cart/items`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { productId: product.id, quantity: 2 },
    });
  }
}

async function clearCartViaAPI(page: any) {
  const token = await page.evaluate(() => localStorage.getItem("appilico_access_token"));
  if (token) {
    await page.request.delete(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  }
}

test.describe("Cart Page – With Items", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await addItemViaAPI(authenticatedPage);
    await authenticatedPage.goto("/cart");
    await authenticatedPage.waitForTimeout(3000);
  });

  test("renders Shopping Cart heading", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText("Shopping Cart")).toBeVisible();
  });

  test("shows cart item with product link", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('a[href*="/products/"]').first()).toBeVisible();
  });

  test("shows item price", async ({ authenticatedPage }) => {
    const text = await authenticatedPage.textContent("body");
    expect(text).toMatch(/\$/);
  });

  test("shows quantity controls", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator("button").filter({ has: authenticatedPage.locator("svg") }).first()).toBeVisible();
  });

  test("shows subtotal", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/subtotal/i)).toBeVisible();
  });

  test("shows total", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/total/i).first()).toBeVisible();
  });

  test("Proceed to Checkout navigates", async ({ authenticatedPage }) => {
    await authenticatedPage.getByText(/proceed to checkout|checkout/i).click();
    await expect(authenticatedPage).toHaveURL(/checkout/);
  });

  test("Clear Cart removes all items", async ({ authenticatedPage }) => {
    await authenticatedPage.getByText(/clear cart/i).click();
    await authenticatedPage.waitForTimeout(2000);
    await expect(authenticatedPage.getByText(/empty|no items/i)).toBeVisible();
  });

  test("screenshot cart page", async ({ authenticatedPage }) => {
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-cart-page.png" });
  });
});

test.describe("Cart Page – Empty State", () => {
  test("shows empty state", async ({ authenticatedPage }) => {
    await clearCartViaAPI(authenticatedPage);
    await authenticatedPage.goto("/cart");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText(/empty|no items/i)).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-cart-empty.png" });
  });

  test("Start Shopping CTA links to products", async ({ authenticatedPage }) => {
    await clearCartViaAPI(authenticatedPage);
    await authenticatedPage.goto("/cart");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.getByText(/start shopping|browse/i).click();
    await expect(authenticatedPage).toHaveURL(/products/);
  });
});

test.describe("Cart Drawer", () => {
  test("cart icon opens drawer", async ({ authenticatedPage }) => {
    await addItemViaAPI(authenticatedPage);
    await authenticatedPage.goto("/");
    await authenticatedPage.getByLabel("Cart").click();
    await expect(authenticatedPage.locator('[role="dialog"]')).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-cart-drawer.png" });
  });

  test("drawer shows cart item", async ({ authenticatedPage }) => {
    await addItemViaAPI(authenticatedPage);
    await authenticatedPage.goto("/");
    await authenticatedPage.getByLabel("Cart").click();
    await expect(authenticatedPage.locator('[role="dialog"]').locator('a[href*="/products/"]').first()).toBeVisible();
  });

  test("drawer shows subtotal", async ({ authenticatedPage }) => {
    await addItemViaAPI(authenticatedPage);
    await authenticatedPage.goto("/");
    await authenticatedPage.getByLabel("Cart").click();
    await expect(authenticatedPage.locator('[role="dialog"]').getByText(/subtotal/i)).toBeVisible();
  });

  test("drawer checkout button navigates", async ({ authenticatedPage }) => {
    await addItemViaAPI(authenticatedPage);
    await authenticatedPage.goto("/");
    await authenticatedPage.getByLabel("Cart").click();
    await authenticatedPage.locator('[role="dialog"]').getByText(/checkout/i).click();
    await expect(authenticatedPage).toHaveURL(/checkout/);
  });
});

test.describe("Cart – Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("cart page stacks on mobile", async ({ authenticatedPage }) => {
    await addItemViaAPI(authenticatedPage);
    await authenticatedPage.goto("/cart");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-cart-mobile.png" });
  });
});
