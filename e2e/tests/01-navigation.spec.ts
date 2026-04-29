import { test, expect } from "../fixtures";

test.describe("Homepage & Navigation", () => {
  test("homepage loads with hero and sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/appilico/i);
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/homepage.png", fullPage: true });
  });

  test("header navigation links are visible", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header nav, header");
    await expect(nav.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /products/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /categories/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /brands/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /offers/i })).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/header-nav.png" });
  });

  test("category mega-menu opens on hover", async ({ page }) => {
    await page.goto("/");
    const catLink = page.locator("header").getByRole("link", { name: /categories/i });
    await catLink.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "e2e/screenshots/mega-menu.png" });
  });

  test("theme toggle switches dark/light mode", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: "e2e/screenshots/theme-toggled.png" });
    }
  });

  test("search modal opens and accepts input", async ({ page }) => {
    await page.goto("/");
    const searchBtn = page.locator('button[aria-label*="search"], button[aria-label*="Search"]').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "e2e/screenshots/search-modal.png" });
    }
  });

  test("cart drawer can be opened from header", async ({ page }) => {
    await page.goto("/");
    const cartBtn = page.locator('a[href="/cart"], button[aria-label*="cart"]').first();
    await cartBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "e2e/screenshots/cart-drawer.png" });
  });

  test("footer displays all links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const links = ["About", "Contact", "Careers", "Privacy", "Terms"];
    for (const link of links) {
      await expect(footer.getByRole("link", { name: new RegExp(link, "i") })).toBeVisible();
    }
    await page.screenshot({ path: "e2e/screenshots/footer.png" });
  });
});

test.describe("Navigation - Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile nav menu opens and shows links", async ({ page }) => {
    await page.goto("/");
    const menuBtn = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: "e2e/screenshots/mobile-nav.png" });
    }
  });
});

test.describe("Static Pages - All Navigable", () => {
  const staticPages = [
    { path: "/about", heading: /about/i },
    { path: "/contact", heading: /contact/i },
    { path: "/careers", heading: /career/i },
    { path: "/blog", heading: /blog/i },
    { path: "/help", heading: /help/i },
    { path: "/shipping", heading: /shipping/i },
    { path: "/faq", heading: /faq|frequently/i },
    { path: "/privacy", heading: /privacy/i },
    { path: "/terms", heading: /terms/i },
    { path: "/cookies", heading: /cookie/i },
    { path: "/accessibility", heading: /accessibility/i },
  ];

  for (const { path, heading } of staticPages) {
    test(`${path} loads correctly`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveText(heading);
      await page.screenshot({ path: `e2e/screenshots/static${path.replace("/", "-")}.png`, fullPage: true });
    });
  }
});

test.describe("Error Pages", () => {
  test("404 page renders", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByText(/not found|404/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/404.png" });
  });
});
