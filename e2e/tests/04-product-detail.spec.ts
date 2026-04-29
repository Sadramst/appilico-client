import { test, expect, API_URL } from "../fixtures";

test.describe("Product Detail Page", () => {
  let productUrl: string;

  test.beforeAll(async ({ request }) => {
    const resp = await request.get(`${API_URL}/products?page=1&pageSize=1`);
    const body = await resp.json();
    if (body.data?.length) {
      productUrl = `/products/${body.data[0].id}`;
    }
  });

  test("renders product detail with name, price, and add-to-cart", async ({ page }) => {
    await page.goto(productUrl ?? "/products");
    if (!productUrl) await page.locator('a[href*="/products/"]').first().click();
    await page.waitForTimeout(2000);

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText(/add to cart|sold out/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/product-detail.png", fullPage: true });
  });

  test("shows product images", async ({ page }) => {
    await page.goto(productUrl ?? "/products");
    if (!productUrl) await page.locator('a[href*="/products/"]').first().click();
    await page.waitForTimeout(2000);

    await expect(page.locator("img").first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/product-gallery.png" });
  });

  test("adds to cart from detail page", async ({ authenticatedPage: page }) => {
    await page.goto(productUrl ?? "/products");
    if (!productUrl) await page.locator('a[href*="/products/"]').first().click();
    await page.waitForTimeout(2000);

    await page.getByText(/add to cart/i).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "e2e/screenshots/product-added-detail.png" });
  });

  test("toggles wishlist from detail (authenticated)", async ({ authenticatedPage: page }) => {
    await page.goto(productUrl ?? "/products");
    if (!productUrl) await page.locator('a[href*="/products/"]').first().click();
    await page.waitForTimeout(2000);

    const wishBtn = page.locator('button[aria-label*="wishlist"]').first();
    if (await wishBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await wishBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: "e2e/screenshots/product-wishlist-detail.png" });
    }
  });

  test("shows description and shipping tabs", async ({ page }) => {
    await page.goto(productUrl ?? "/products");
    if (!productUrl) await page.locator('a[href*="/products/"]').first().click();
    await page.waitForTimeout(2000);

    const descTab = page.getByText("Description");
    if (await descTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await descTab.click();
      await page.screenshot({ path: "e2e/screenshots/product-tab-description.png" });
    }
    const shipTab = page.getByText("Shipping");
    if (await shipTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await shipTab.click();
      await page.screenshot({ path: "e2e/screenshots/product-tab-shipping.png" });
    }
  });

  test("shows trust signals", async ({ page }) => {
    await page.goto(productUrl ?? "/products");
    if (!productUrl) await page.locator('a[href*="/products/"]').first().click();
    await page.waitForTimeout(2000);

    await expect(page.getByText("Free Shipping")).toBeVisible();
    await expect(page.getByText("30-Day Returns")).toBeVisible();
    await expect(page.getByText("2-Year Warranty")).toBeVisible();
  });
});
