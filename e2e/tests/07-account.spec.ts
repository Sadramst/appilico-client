import { test, expect } from "../fixtures";

test.describe("Profile Page", () => {
  test("renders profile form with user info", async ({ authenticatedPage: page }) => {
    await page.goto("/profile");
    await page.waitForTimeout(2000);
    await expect(page.locator("h1, h2").getByText(/profile/i)).toBeVisible();
    await expect(page.locator("input")).toHaveCount(/./, { timeout: 5000 });
    await page.screenshot({ path: "e2e/screenshots/profile.png", fullPage: true });
  });

  test("account sidebar shows all links", async ({ authenticatedPage: page }) => {
    await page.goto("/profile");
    await page.waitForTimeout(2000);
    const sidebar = page.locator("aside, nav").filter({ has: page.locator('a[href="/profile"]') });
    await expect(sidebar.getByText("Profile")).toBeVisible();
    await expect(sidebar.getByText("Orders")).toBeVisible();
    await expect(sidebar.getByText("Addresses")).toBeVisible();
    await expect(sidebar.getByText("Wishlist")).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/profile-sidebar.png" });
  });
});

test.describe("Order History", () => {
  test("renders orders page", async ({ authenticatedPage: page }) => {
    await page.goto("/orders");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/orders-page.png", fullPage: true });
  });

  test("shows order cards or empty state", async ({ authenticatedPage: page }) => {
    await page.goto("/orders");
    await page.waitForTimeout(2000);
    const hasOrders = await page.locator('a[href*="/orders/"]').count();
    if (hasOrders > 0) {
      await page.screenshot({ path: "e2e/screenshots/orders-with-items.png" });
    } else {
      await expect(page.getByText(/no orders|empty/i)).toBeVisible();
      await page.screenshot({ path: "e2e/screenshots/orders-empty.png" });
    }
  });

  test("navigates to order detail", async ({ authenticatedPage: page }) => {
    await page.goto("/orders");
    await page.waitForTimeout(2000);
    const orderLink = page.locator('a[href*="/orders/"]').first();
    if (await orderLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await orderLink.click();
      await expect(page).toHaveURL(/\/orders\/.+/);
      await page.screenshot({ path: "e2e/screenshots/order-detail.png", fullPage: true });
    }
  });
});

test.describe("Address Management", () => {
  test("renders address page", async ({ authenticatedPage: page }) => {
    await page.goto("/addresses");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/addresses.png", fullPage: true });
  });

  test("opens add address dialog", async ({ authenticatedPage: page }) => {
    await page.goto("/addresses");
    await page.waitForTimeout(2000);
    await page.getByText(/add address/i).first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/addresses-add-dialog.png" });
  });

  test("creates a new address", async ({ authenticatedPage: page }) => {
    await page.goto("/addresses");
    await page.waitForTimeout(2000);
    await page.getByText(/add address/i).first().click();
    const dialog = page.locator('[role="dialog"]');
    await dialog.locator('input[id="title"]').fill("PW Test Address");
    await dialog.locator('input[id="addressLine1"]').fill("321 Playwright St");
    await dialog.locator('input[id="city"]').fill("Melbourne");
    await dialog.locator('input[id="state"]').fill("VIC");
    await dialog.locator('input[id="postalCode"]').fill("3000");
    await dialog.locator('input[id="country"]').fill("Australia");
    await dialog.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/addresses-created.png" });
  });
});

test.describe("Wishlist Page", () => {
  test("renders wishlist page", async ({ authenticatedPage: page }) => {
    await page.goto("/wishlist");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/wishlist.png", fullPage: true });
  });

  test("shows items or empty state", async ({ authenticatedPage: page }) => {
    await page.goto("/wishlist");
    await page.waitForTimeout(2000);
    const cards = await page.locator('[class*="card"]').count();
    if (cards > 1) {
      await page.screenshot({ path: "e2e/screenshots/wishlist-with-items.png" });
    } else {
      await expect(page.getByText(/empty|no items/i)).toBeVisible();
      await page.screenshot({ path: "e2e/screenshots/wishlist-empty.png" });
    }
  });
});
