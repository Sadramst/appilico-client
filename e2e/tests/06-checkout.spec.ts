import { test, expect, API_URL } from "../fixtures";

// ============================================================
// 06 - CHECKOUT – Playwright
// ============================================================

async function seedCart(page: any) {
  const token = await page.evaluate(() => localStorage.getItem("appilico_access_token"));
  const resp = await page.request.get(`${API_URL}/products?page=1&pageSize=1`);
  const body = await resp.json();
  const product = body.data[0];
  if (product && token) {
    await page.request.post(`${API_URL}/cart/items`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { productId: product.id, quantity: 1 },
    });
  }
}

test.describe("Checkout – Step 1: Shipping", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await seedCart(authenticatedPage);
    await authenticatedPage.goto("/checkout");
    await authenticatedPage.waitForTimeout(3000);
  });

  test("renders checkout page", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/shipping/i).first()).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-checkout-step1.png" });
  });

  test("shows address selection", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('input[type="radio"], button[role="radio"], [data-state]').first()).toBeVisible();
  });

  test("Add New Address button exists", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/add new|add address/i)).toBeVisible();
  });

  test("Add New Address opens dialog", async ({ authenticatedPage }) => {
    await authenticatedPage.getByText(/add new|add address/i).click();
    await expect(authenticatedPage.locator('[role="dialog"]')).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-checkout-add-address.png" });
  });

  test("Continue advances to step 2", async ({ authenticatedPage }) => {
    await authenticatedPage.getByText("Continue").click();
    await authenticatedPage.waitForTimeout(500);
    await expect(authenticatedPage.getByText(/payment/i).first()).toBeVisible();
  });
});

test.describe("Checkout – Step 2: Payment", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await seedCart(authenticatedPage);
    await authenticatedPage.goto("/checkout");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.getByText("Continue").click();
    await authenticatedPage.waitForTimeout(500);
  });

  test("shows payment method options", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText("Credit Card")).toBeVisible();
    await expect(authenticatedPage.getByText("PayPal")).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-checkout-step2.png" });
  });

  test("shows Debit Card option", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText("Debit Card")).toBeVisible();
  });

  test("shows Bank Transfer option", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText("Bank Transfer")).toBeVisible();
  });

  test("shows Cash on Delivery option", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText("Cash on Delivery")).toBeVisible();
  });

  test("shows voucher input", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('input[placeholder*="code"], input[id*="voucher"]')).toBeVisible();
  });

  test("Apply button exists", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText("Apply")).toBeVisible();
  });

  test("Back returns to step 1", async ({ authenticatedPage }) => {
    await authenticatedPage.getByText("Back").click();
    await expect(authenticatedPage.getByText(/shipping/i).first()).toBeVisible();
  });

  test("Continue advances to step 3", async ({ authenticatedPage }) => {
    await authenticatedPage.getByText("Continue").click();
    await authenticatedPage.waitForTimeout(500);
    await expect(authenticatedPage.getByText(/review/i).first()).toBeVisible();
  });
});

test.describe("Checkout – Step 3: Review", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await seedCart(authenticatedPage);
    await authenticatedPage.goto("/checkout");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.getByText("Continue").click();
    await authenticatedPage.waitForTimeout(500);
    await authenticatedPage.getByText("Continue").click();
    await authenticatedPage.waitForTimeout(500);
  });

  test("shows order review", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/review/i).first()).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-checkout-step3.png" });
  });

  test("shows subtotal and total", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/subtotal/i)).toBeVisible();
    await expect(authenticatedPage.getByText(/total/i).first()).toBeVisible();
  });

  test("Place Order button exists", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/place order/i)).toBeVisible();
  });

  test("Back returns to step 2", async ({ authenticatedPage }) => {
    await authenticatedPage.getByText("Back").click();
    await expect(authenticatedPage.getByText(/payment/i).first()).toBeVisible();
  });
});

test.describe("Checkout – Order Summary Sidebar", () => {
  test("shows Order Summary", async ({ authenticatedPage }) => {
    await seedCart(authenticatedPage);
    await authenticatedPage.goto("/checkout");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText(/order summary/i)).toBeVisible();
  });
});

test.describe("Checkout – Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("renders on mobile", async ({ authenticatedPage }) => {
    await seedCart(authenticatedPage);
    await authenticatedPage.goto("/checkout");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-checkout-mobile.png" });
  });
});
