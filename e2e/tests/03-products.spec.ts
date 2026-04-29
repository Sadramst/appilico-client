import { test, expect } from "../fixtures";

// ============================================================
// 03 - PRODUCTS LISTING – Playwright
// ============================================================

test.describe("Products Page – Layout", () => {
  test("renders Products heading", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: /products/i }).first()).toBeVisible();
  });

  test("shows breadcrumbs", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator('[class*="breadcrumb"]')).toBeVisible();
  });

  test("shows sidebar filters", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("aside, [class*='sidebar']").first()).toBeVisible();
  });

  test("shows product grid", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator('[class*="grid"]').first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-products-grid.png" });
  });
});

test.describe("Products – Filters", () => {
  test("category filter section exists", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/categories/i).first()).toBeVisible();
  });

  test("brand filter section exists", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/brands/i).first()).toBeVisible();
  });

  test("price range filter exists", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/price/i).first()).toBeVisible();
  });

  test("rating filter exists", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/rating/i).first()).toBeVisible();
  });

  test("stock filter exists", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/stock|availability/i).first()).toBeVisible();
  });

  test("clear filters button exists", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/clear/i).first()).toBeVisible();
  });

  test("sort dropdown exists", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("select, [role='combobox']").first()).toBeVisible();
  });
});

test.describe("Products – Product Cards", () => {
  test("product card has image", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    const card = page.locator('[class*="card"]').filter({ has: page.locator('a[href*="/products/"]') }).first();
    await expect(card.locator("img")).toBeVisible();
  });

  test("product card has name", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    const card = page.locator('[class*="card"]').filter({ has: page.locator('a[href*="/products/"]') }).first();
    await expect(card.locator("h3")).toBeVisible();
  });

  test("product card has price", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    const text = await page.locator('[class*="card"]').filter({ has: page.locator('a[href*="/products/"]') }).first().textContent();
    expect(text).toMatch(/\$/);
  });

  test("product card links to detail page", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    await page.locator('a[href*="/products/"]').first().click();
    await expect(page).toHaveURL(/\/products\/.+/);
  });
});

test.describe("Products – Pagination", () => {
  test("pagination controls visible", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    const pagination = page.locator('[class*="pagination"], nav').filter({ hasText: /next|previous|\d/ });
    await expect(pagination.first()).toBeVisible();
  });
});

test.describe("Products – Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile shows filter toggle button", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/filter/i).first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-products-mobile.png" });
  });
});
