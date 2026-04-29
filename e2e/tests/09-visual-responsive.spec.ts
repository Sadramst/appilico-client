import { test, expect } from "../fixtures";

test.describe("Category & Brand Pages", () => {
  test("categories page shows category cards", async ({ page }) => {
    await page.goto("/categories");
    await page.waitForTimeout(2000);
    await expect(page.locator('[class*="card"], a[href*="/categories/"]').first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/categories.png", fullPage: true });
  });

  test("brands page shows brand cards", async ({ page }) => {
    await page.goto("/brands");
    await page.waitForTimeout(2000);
    await expect(page.locator('[class*="card"], a[href*="/brands/"]').first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/brands.png", fullPage: true });
  });

  test("offers page loads", async ({ page }) => {
    await page.goto("/offers");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/offers.png", fullPage: true });
  });
});

test.describe("Responsive Layouts", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  const pages = ["/", "/products", "/cart", "/login"];

  for (const vp of viewports) {
    for (const pagePath of pages) {
      test(`${pagePath} at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(pagePath);
        await page.waitForTimeout(2000);
        await page.screenshot({
          path: `e2e/screenshots/responsive-${vp.name}${pagePath.replace(/\//g, "-") || "-home"}.png`,
          fullPage: true,
        });
      });
    }
  }
});

test.describe("Visual Consistency", () => {
  test("homepage full page screenshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "e2e/screenshots/visual-homepage-full.png", fullPage: true });
  });

  test("products page full page screenshot", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "e2e/screenshots/visual-products-full.png", fullPage: true });
  });

  test("login page full page screenshot", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "e2e/screenshots/visual-login-full.png", fullPage: true });
  });
});
