import { test, expect } from "../fixtures";

// ============================================================
// 07 - ACCOUNT PAGES – Playwright
// ============================================================

test.describe("Profile Page", () => {
  test("renders My Profile heading", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText("My Profile")).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-profile.png" });
  });

  test("shows user avatar", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.locator('[class*="avatar"]').first()).toBeVisible();
  });

  test("shows email with @ symbol", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    const text = await authenticatedPage.textContent("body");
    expect(text).toMatch(/@/);
  });

  test("shows profile form with First Name field", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText("First Name")).toBeVisible();
  });

  test("shows Last Name field", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText("Last Name")).toBeVisible();
  });

  test("shows Phone Number field", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText(/phone/i)).toBeVisible();
  });

  test("Save Changes button exists", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByRole("button", { name: /save/i })).toBeVisible();
  });

  test("form is pre-filled", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    const val = await authenticatedPage.locator("input").first().inputValue();
    expect(val.length).toBeGreaterThan(0);
  });

  test("sidebar shows Profile, Orders, Addresses, Wishlist", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    for (const link of ["Profile", "Orders", "Addresses", "Wishlist"]) {
      await expect(authenticatedPage.locator("aside, nav").getByText(link).first()).toBeVisible();
    }
  });
});

test.describe("Orders Page", () => {
  test("renders My Orders heading", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/orders");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText("My Orders")).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-orders.png" });
  });

  test("shows order cards or empty state", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/orders");
    await authenticatedPage.waitForTimeout(3000);
    const text = await authenticatedPage.textContent("body");
    expect(text!.match(/ORD-|no orders|empty/i)).toBeTruthy();
  });

  test("shows breadcrumbs", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/orders");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.locator('[class*="breadcrumb"]')).toBeVisible();
  });
});

test.describe("Order Detail", () => {
  test("navigates to order detail from orders list", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/orders");
    await authenticatedPage.waitForTimeout(3000);
    const link = authenticatedPage.locator('a[href*="/orders/"]').first();
    if (await link.isVisible()) {
      await link.click();
      await authenticatedPage.waitForTimeout(3000);
      await expect(authenticatedPage).toHaveURL(/\/orders\/.+/);
      await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-order-detail.png" });
    }
  });
});

test.describe("Addresses Page", () => {
  test("renders addresses page", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/addresses");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText(/address/i).first()).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-addresses.png" });
  });

  test("Add Address button exists", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/addresses");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText(/add address/i)).toBeVisible();
  });

  test("Add Address opens dialog", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/addresses");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.getByText(/add address/i).first().click();
    await expect(authenticatedPage.locator('[role="dialog"]')).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-add-address-dialog.png" });
  });

  test("dialog has multiple input fields", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/addresses");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.getByText(/add address/i).first().click();
    const inputs = authenticatedPage.locator('[role="dialog"] input');
    expect(await inputs.count()).toBeGreaterThanOrEqual(4);
  });
});

test.describe("Wishlist Page", () => {
  test("renders Wishlist heading", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/wishlist");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.getByText("Wishlist")).toBeVisible();
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-wishlist.png" });
  });

  test("shows items or empty state", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/wishlist");
    await authenticatedPage.waitForTimeout(3000);
    const text = await authenticatedPage.textContent("body");
    expect(text!.match(/\$|empty|no items/i)).toBeTruthy();
  });

  test("shows breadcrumbs", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/wishlist");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage.locator('[class*="breadcrumb"]')).toBeVisible();
  });
});

test.describe("Account – Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("profile page on mobile", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/profile");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-profile-mobile.png" });
  });

  test("orders page on mobile", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/orders");
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.screenshot({ path: "e2e/screenshots/pw-orders-mobile.png" });
  });
});
