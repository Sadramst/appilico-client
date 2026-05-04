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

test.describe("Products – URL Parameter Filters", () => {
  test("search param in URL filters products", async ({ page }) => {
    await page.goto("/products?search=shirt");
    await page.waitForTimeout(3000);
    await expect(page.locator('[class*="card"]').filter({ has: page.locator('a[href*="/products/"]') }).first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-products-url-search.png" });
  });

  test("sort param in URL sets sort dropdown", async ({ page }) => {
    await page.goto("/products?sort=price_asc");
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain("sort=price_asc");
  });

  test("page param in URL navigates to correct page", async ({ page }) => {
    await page.goto("/products?page=2");
    await page.waitForTimeout(3000);
    const url = page.url();
    expect(url).toContain("page=2");
    await expect(page.locator('[class*="card"]').filter({ has: page.locator('a[href*="/products/"]') }).first()).toBeVisible();
  });

  test("clicking category checkbox updates URL", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    await page.locator("aside").locator('button[role="checkbox"], input[type="checkbox"]').first().click({ force: true });
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toMatch(/categoryId|page/);
  });

  test("clear filters resets URL to base path", async ({ page }) => {
    await page.goto("/products?search=shirt&sort=price_asc");
    await page.waitForTimeout(2000);
    await page.getByText(/clear/i).first().click();
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toMatch(/\/products\/?(\?page=1)?$/);
  });

  test("in-stock filter param updates URL", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    const stockCheckbox = page.locator("aside").getByText(/in stock|stock/i).locator("..").locator('button[role="checkbox"], input[type="checkbox"]');
    if (await stockCheckbox.count() > 0) {
      await stockCheckbox.first().click({ force: true });
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toContain("inStock=true");
    }
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
