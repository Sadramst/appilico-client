import { test, expect } from "../fixtures";

// ============================================================
// 08 - ADMIN PANEL – Playwright
// ============================================================

test.describe("Admin – Dashboard", () => {
  test("renders dashboard", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Dashboard")).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-dashboard.png" });
  });

  test("shows 4+ stats cards", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");
    await adminPage.waitForTimeout(3000);
    const cards = adminPage.locator('[class*="card"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
  });

  test("shows revenue chart", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText(/revenue/i)).toBeVisible();
  });

  test("shows recent orders", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText(/recent orders/i)).toBeVisible();
  });

  test("shows top products", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText(/top products/i)).toBeVisible();
  });

  test("sidebar has all admin links", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");
    await adminPage.waitForTimeout(3000);
    const links = ["Dashboard", "Products", "Categories", "Brands", "Orders", "Customers", "Discounts", "Vouchers", "Special Offers", "Inventory", "Reviews", "Settings"];
    for (const link of links) {
      await expect(adminPage.locator("aside, nav").getByText(link).first()).toBeVisible();
    }
  });
});

test.describe("Admin – Products", () => {
  test("renders products page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/products");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Products").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-products.png" });
  });

  test("has search input", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/products");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.locator('input[placeholder*="search" i]')).toBeVisible();
  });

  test("has Add Product button", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/products");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText(/add product/i)).toBeVisible();
  });

  test("has data table", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/products");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.locator("table, [class*='table']").first()).toBeVisible();
  });
});

test.describe("Admin – Categories", () => {
  test("renders categories page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/categories");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Categories").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-categories.png" });
  });

  test("has Add Category button", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/categories");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText(/add category/i)).toBeVisible();
  });
});

test.describe("Admin – Brands", () => {
  test("renders brands page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/brands");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Brands").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-brands.png" });
  });
});

test.describe("Admin – Orders", () => {
  test("renders orders page with table", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/orders");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Orders").first()).toBeVisible();
    await expect(adminPage.locator("table, [class*='table']").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-orders.png" });
  });
});

test.describe("Admin – Customers", () => {
  test("renders customers page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/customers");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Customers").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-customers.png" });
  });
});

test.describe("Admin – Discounts", () => {
  test("renders discounts page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/discounts");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Discounts").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-discounts.png" });
  });
});

test.describe("Admin – Vouchers", () => {
  test("renders vouchers page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/vouchers");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Vouchers").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-vouchers.png" });
  });
});

test.describe("Admin – Offers", () => {
  test("renders offers page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/offers");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText(/offers/i).first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-offers.png" });
  });
});

test.describe("Admin – Inventory", () => {
  test("renders inventory page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/inventory");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText(/inventory/i).first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-inventory.png" });
  });
});

test.describe("Admin – Reviews", () => {
  test("renders reviews page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/reviews");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Reviews").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-reviews.png" });
  });
});

test.describe("Admin – Settings", () => {
  test("renders settings page", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/settings");
    await adminPage.waitForTimeout(3000);
    await expect(adminPage.getByText("Settings").first()).toBeVisible();
    await adminPage.screenshot({ path: "e2e/screenshots/pw-admin-settings.png" });
  });

  test("has form inputs", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/settings");
    await adminPage.waitForTimeout(3000);
    const inputs = adminPage.locator("input, textarea");
    expect(await inputs.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Admin – Auth Guard", () => {
  test("non-admin redirected from dashboard", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/dashboard");
    await authenticatedPage.waitForTimeout(3000);
    await expect(authenticatedPage).not.toHaveURL(/dashboard/);
  });

  test("unauthenticated redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("Admin – Sidebar Navigation", () => {
  const adminRoutes = [
    { label: "Products", path: "/dashboard/products" },
    { label: "Categories", path: "/dashboard/categories" },
    { label: "Brands", path: "/dashboard/brands" },
    { label: "Orders", path: "/dashboard/orders" },
    { label: "Customers", path: "/dashboard/customers" },
    { label: "Discounts", path: "/dashboard/discounts" },
    { label: "Vouchers", path: "/dashboard/vouchers" },
    { label: "Inventory", path: "/dashboard/inventory" },
    { label: "Reviews", path: "/dashboard/reviews" },
    { label: "Settings", path: "/dashboard/settings" },
  ];

  for (const route of adminRoutes) {
    test(`sidebar ${route.label} link navigates to ${route.path}`, async ({ adminPage }) => {
      await adminPage.goto("/dashboard");
      await adminPage.waitForTimeout(3000);
      await adminPage.locator("aside, nav").getByText(route.label).first().click();
      await expect(adminPage).toHaveURL(new RegExp(route.path));
    });
  }
});
