import { test, expect } from "../fixtures";

// ============================================================
// 01 - NAVIGATION – Playwright
// ============================================================

test.describe("Homepage Sections", () => {
  test("loads homepage with hero banner", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("section, [class*='hero']").first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-homepage-hero.png" });
  });

  test("featured products section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Featured Products")).toBeVisible();
  });

  test("category grid section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[class*="grid"]').first()).toBeVisible();
  });

  test("trending products section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/trending/i)).toBeVisible();
  });

  test("trust badges section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/free shipping|delivery/i)).toBeVisible();
  });
});

test.describe("Header – Desktop Navigation", () => {
  test("logo visible and links to home", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test("main nav links visible (Home, Products, Categories, Brands, Offers)", async ({ page }) => {
    await page.goto("/");
    for (const link of ["Home", "Products", "Categories", "Brands", "Offers"]) {
      await expect(page.getByRole("link", { name: link }).first()).toBeVisible();
    }
  });

  test("Products link navigates to /products", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Products" }).first().click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("Categories link navigates to /categories", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Categories" }).first().click();
    await expect(page).toHaveURL(/\/categories/);
  });

  test("Brands link navigates to /brands", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Brands" }).first().click();
    await expect(page).toHaveURL(/\/brands/);
  });

  test("Offers link navigates to /offers", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Offers" }).first().click();
    await expect(page).toHaveURL(/\/offers/);
  });

  test("search button opens search dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search").click();
    await expect(page.locator('[role="dialog"], [cmdk-dialog]')).toBeVisible();
  });

  test("theme toggle switches between light and dark", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('button').filter({ hasText: /sun|moon/i }).first();
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.screenshot({ path: "e2e/screenshots/pw-theme-toggled.png" });
    }
  });

  test("cart icon visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Cart")).toBeVisible();
  });
});

test.describe("Header – Authenticated State", () => {
  test("shows user dropdown after login", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
    await expect(authenticatedPage.locator('[class*="avatar"]').first()).toBeVisible();
  });

  test("user dropdown has Profile link", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
    await authenticatedPage.locator('[class*="avatar"]').first().click();
    await expect(authenticatedPage.getByText("Profile")).toBeVisible();
  });

  test("user dropdown has Orders link", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
    await authenticatedPage.locator('[class*="avatar"]').first().click();
    await expect(authenticatedPage.getByText("Orders")).toBeVisible();
  });

  test("user dropdown has Sign Out", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
    await authenticatedPage.locator('[class*="avatar"]').first().click();
    await expect(authenticatedPage.getByText(/sign out|logout/i)).toBeVisible();
  });
});

test.describe("Footer", () => {
  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
  });

  test("footer has About link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/about"]')).toBeVisible();
  });

  test("footer has Contact link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/contact"]')).toBeVisible();
  });

  test("footer has Privacy link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  });

  test("footer has Terms link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger menu visible on mobile", async ({ page }) => {
    await page.goto("/");
    const burger = page.getByLabel(/menu|navigation/i);
    await expect(burger).toBeVisible();
  });

  test("hamburger opens mobile nav drawer", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel(/menu|navigation/i).click();
    await expect(page.locator('[role="dialog"], [data-state="open"]')).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-mobile-nav.png" });
  });

  test("mobile nav has all links", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel(/menu|navigation/i).click();
    for (const link of ["Home", "Products", "Categories", "Brands", "Offers"]) {
      await expect(page.getByRole("link", { name: link }).first()).toBeVisible();
    }
  });
});
