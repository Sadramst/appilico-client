import { test, expect } from "../fixtures";

test.describe("Admin Dashboard", () => {
  test("renders dashboard with stats cards", async ({ adminPage: page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(3000);
    const cards = page.locator('[class*="card"], [class*="Card"]');
    await expect(cards.first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/admin-dashboard.png", fullPage: true });
  });

  test("shows revenue chart", async ({ adminPage: page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "e2e/screenshots/admin-chart.png" });
  });

  test("shows recent orders table", async ({ adminPage: page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(3000);
    await expect(page.getByText(/recent orders/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/admin-recent-orders.png" });
  });
});

test.describe("Admin - Product Management", () => {
  test("renders products page with table", async ({ adminPage: page }) => {
    await page.goto("/dashboard/products");
    await page.waitForTimeout(3000);
    await expect(page.locator("table, [role='table']").first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/admin-products.png", fullPage: true });
  });

  test("search products", async ({ adminPage: page }) => {
    await page.goto("/dashboard/products");
    await page.waitForTimeout(3000);
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("beef");
      await page.waitForTimeout(1000);
      await page.screenshot({ path: "e2e/screenshots/admin-products-search.png" });
    }
  });
});

test.describe("Admin - All Management Pages", () => {
  const adminPages = [
    { path: "/dashboard/categories", name: "categories" },
    { path: "/dashboard/brands", name: "brands" },
    { path: "/dashboard/orders", name: "orders" },
    { path: "/dashboard/customers", name: "customers" },
    { path: "/dashboard/discounts", name: "discounts" },
    { path: "/dashboard/vouchers", name: "vouchers" },
    { path: "/dashboard/offers", name: "offers" },
    { path: "/dashboard/inventory", name: "inventory" },
    { path: "/dashboard/reviews", name: "reviews" },
    { path: "/dashboard/settings", name: "settings" },
  ];

  for (const { path, name } of adminPages) {
    test(`${name} page renders`, async ({ adminPage: page }) => {
      await page.goto(path);
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `e2e/screenshots/admin-${name}.png`, fullPage: true });
    });
  }
});

test.describe("Admin Sidebar Navigation", () => {
  test("sidebar contains all admin section links", async ({ adminPage: page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(3000);
    const sections = [
      "Products",
      "Categories",
      "Brands",
      "Orders",
      "Customers",
      "Discounts",
      "Vouchers",
      "Offers",
      "Inventory",
      "Reviews",
      "Settings",
    ];
    for (const section of sections) {
      await expect(page.locator("aside, nav").getByText(section).first()).toBeVisible();
    }
    await page.screenshot({ path: "e2e/screenshots/admin-sidebar.png" });
  });

  test("each sidebar link navigates to correct page", async ({ adminPage: page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(3000);
    const routes = [
      { name: "Products", path: "/dashboard/products" },
      { name: "Categories", path: "/dashboard/categories" },
      { name: "Brands", path: "/dashboard/brands" },
      { name: "Orders", path: "/dashboard/orders" },
      { name: "Customers", path: "/dashboard/customers" },
    ];
    for (const route of routes) {
      await page.locator("aside, nav").getByText(route.name).first().click();
      await expect(page).toHaveURL(new RegExp(route.path));
      await page.screenshot({ path: `e2e/screenshots/admin-nav-${route.name.toLowerCase()}.png` });
    }
  });
});
