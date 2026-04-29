import { test, expect, API_URL } from "../fixtures";

test.describe("Product Listing", () => {
  test("renders product grid with cards", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);
    const cards = page.locator('[class*="card"], [class*="Card"]');
    await expect(cards.first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/products-listing.png", fullPage: true });
  });

  test("product card shows name and price", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="card"]').first();
    await expect(card.locator("h3, a")).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/product-card.png" });
  });

  test("filter by category checkbox", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);
    const checkbox = page.locator('aside input[type="checkbox"], aside button[role="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: "e2e/screenshots/products-filtered-category.png" });
    }
  });

  test("navigates to product detail on card click", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);
    await page.locator('a[href*="/products/"]').first().click();
    await expect(page).toHaveURL(/\/products\/.+/);
    await page.screenshot({ path: "e2e/screenshots/product-detail-from-listing.png" });
  });

  test("adds product to cart from card (authenticated)", async ({ authenticatedPage: page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="card"]').first();
    await card.hover();
    const addBtn = card.locator('button[aria-label="Add to cart"]');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: "e2e/screenshots/product-added-from-card.png" });
    }
  });

  test("toggles wishlist from card (authenticated)", async ({ authenticatedPage: page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="card"]').first();
    await card.hover();
    const wishBtn = card.locator('button[aria-label*="wishlist"]');
    if (await wishBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await wishBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: "e2e/screenshots/product-wishlist-toggled-card.png" });
    }
  });
});

test.describe("Product Listing - Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens mobile filter sheet", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);
    const filterBtn = page.getByText("Filters");
    if (await filterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "e2e/screenshots/mobile-filters.png" });
    }
  });
});
