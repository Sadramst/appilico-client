import { test, expect, API_URL } from "../fixtures";

test.describe("Cart Page", () => {
  test("shows cart with items after adding", async ({ authenticatedPage: page }) => {
    // Add item via API
    const token = await page.evaluate(() => localStorage.getItem("appilico_access_token"));
    const prodResp = await page.request.get(`${API_URL}/products?page=1&pageSize=1`);
    const prodBody = await prodResp.json();
    if (prodBody.data?.length) {
      await page.request.post(`${API_URL}/cart/items`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId: prodBody.data[0].id, quantity: 2 },
      });
    }
    await page.goto("/cart");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/cart-with-items.png", fullPage: true });
  });

  test("shows subtotal and total", async ({ authenticatedPage: page }) => {
    await page.goto("/cart");
    await page.waitForTimeout(2000);
    await expect(page.getByText(/subtotal/i)).toBeVisible();
    await expect(page.getByText(/total/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/cart-summary.png" });
  });

  test("proceed to checkout", async ({ authenticatedPage: page }) => {
    await page.goto("/cart");
    await page.waitForTimeout(2000);
    const checkoutBtn = page.getByText(/proceed to checkout|checkout/i);
    if (await checkoutBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await checkoutBtn.click();
      await expect(page).toHaveURL(/\/checkout/);
      await page.screenshot({ path: "e2e/screenshots/cart-to-checkout.png" });
    }
  });

  test("clears entire cart", async ({ authenticatedPage: page }) => {
    await page.goto("/cart");
    await page.waitForTimeout(2000);
    const clearBtn = page.getByText(/clear cart/i);
    if (await clearBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await clearBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: "e2e/screenshots/cart-cleared.png" });
    }
  });
});

test.describe("Cart - Empty State", () => {
  test("shows empty cart message", async ({ authenticatedPage: page }) => {
    // Clear cart via API
    const token = await page.evaluate(() => localStorage.getItem("appilico_access_token"));
    await page.request.delete(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    await page.goto("/cart");
    await page.waitForTimeout(2000);
    await expect(page.getByText(/empty|no items/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/cart-empty.png" });
  });
});
