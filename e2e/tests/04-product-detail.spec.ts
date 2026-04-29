import { test, expect } from "../fixtures";

// ============================================================
// 04 - PRODUCT DETAIL – Playwright
// ============================================================

async function getProductUrl(page: any): Promise<string> {
  const resp = await page.request.get("https://api.appilico.com/api/products?page=1&pageSize=1");
  const body = await resp.json();
  return `/products/${body.data[0]?.id ?? ""}`;
}

test.describe("Product Detail – Info", () => {
  test("shows product name heading", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("shows price", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    const text = await page.textContent("body");
    expect(text).toMatch(/\$\d/);
  });

  test("shows star rating", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.locator("svg").first()).toBeVisible();
  });

  test("shows stock badge", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.locator('[class*="badge"]').first()).toBeVisible();
  });

  test("shows Add to Cart button", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.getByText(/add to cart/i)).toBeVisible();
  });

  test("shows trust signals (Free Shipping)", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.getByText("Free Shipping")).toBeVisible();
  });
});

test.describe("Product Detail – Gallery", () => {
  test("main image renders", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.locator('img, [class*="aspect-square"]').first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-product-gallery.png" });
  });
});

test.describe("Product Detail – Cart Actions", () => {
  test("Add to Cart click (unauthenticated)", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await page.getByText(/add to cart/i).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "e2e/screenshots/pw-product-add-cart.png" });
  });

  test("Add to Cart click (authenticated)", async ({ authenticatedPage }) => {
    const url = await getProductUrl(authenticatedPage);
    await authenticatedPage.goto(url);
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.getByText(/add to cart/i).click();
    await authenticatedPage.waitForTimeout(1000);
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-product-add-cart-auth.png" });
  });
});

test.describe("Product Detail – Wishlist", () => {
  test("wishlist button exists", async ({ authenticatedPage }) => {
    const url = await getProductUrl(authenticatedPage);
    await authenticatedPage.goto(url);
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.locator('button[aria-label*="wishlist"]').first()).toBeVisible();
  });

  test("clicking wishlist toggles state", async ({ authenticatedPage }) => {
    const url = await getProductUrl(authenticatedPage);
    await authenticatedPage.goto(url);
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.locator('button[aria-label*="wishlist"]').first().click();
    await authenticatedPage.waitForTimeout(1000);
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-product-wishlist-toggle.png" });
  });
});

test.describe("Product Detail – Share", () => {
  test("share button exists", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.locator('button[aria-label="Share"]')).toBeVisible();
  });
});

test.describe("Product Detail – Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("renders on mobile viewport", async ({ page }) => {
    const url = await getProductUrl(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await expect(page.locator("h1")).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-product-mobile.png" });
  });
});
