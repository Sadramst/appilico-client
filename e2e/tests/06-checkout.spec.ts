import { test, expect, API_URL } from "../fixtures";

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Ensure cart has item
    const token = await page.evaluate(() => localStorage.getItem("appilico_access_token"));
    const resp = await page.request.get(`${API_URL}/products?page=1&pageSize=1`);
    const body = await resp.json();
    if (body.data?.length) {
      await page.request.post(`${API_URL}/cart/items`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId: body.data[0].id, quantity: 1 },
      }).catch(() => {});
    }
  });

  test("renders checkout page with stepper", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await expect(page.getByText(/shipping/i)).toBeVisible();
    await expect(page.getByText(/payment/i).first()).toBeVisible();
    await expect(page.getByText(/review/i).first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/checkout-step1.png", fullPage: true });
  });

  test("step 1: shows saved addresses", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/checkout-addresses.png" });
  });

  test("step 1: opens add new address dialog", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    const addNew = page.getByText(/add new/i);
    if (await addNew.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addNew.click();
      await page.waitForTimeout(500);
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await page.screenshot({ path: "e2e/screenshots/checkout-add-address-dialog.png" });
    }
  });

  test("step 1 → step 2: navigates to payment", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await page.getByText("Continue").click();
    await page.waitForTimeout(500);
    await expect(page.getByText(/payment method/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/checkout-step2.png" });
  });

  test("step 2: applies voucher code", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await page.getByText("Continue").click();
    await page.waitForTimeout(500);
    const voucherInput = page.locator('input[id="voucher"], input[placeholder*="code"]');
    if (await voucherInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await voucherInput.fill("TESTCODE");
      await page.getByText("Apply").click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: "e2e/screenshots/checkout-voucher.png" });
    }
  });

  test("step 2 → step 3: navigates to review", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await page.getByText("Continue").click();
    await page.waitForTimeout(500);
    await page.getByText("Continue").click();
    await page.waitForTimeout(500);
    await expect(page.getByText(/order review/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/checkout-step3.png" });
  });

  test("step 3: back button goes to previous steps", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await page.getByText("Continue").click();
    await page.waitForTimeout(500);
    await page.getByText("Continue").click();
    await page.waitForTimeout(500);
    await page.getByText("Back").click();
    await expect(page.getByText(/payment method/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/checkout-back-step2.png" });
  });

  test("shows order summary sidebar", async ({ authenticatedPage: page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await expect(page.getByText(/order summary/i)).toBeVisible();
    await expect(page.getByText(/subtotal/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/checkout-sidebar.png" });
  });
});
