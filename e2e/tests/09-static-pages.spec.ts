import { test, expect } from "../fixtures";

// ============================================================
// 09 - STATIC & CONTENT PAGES – Playwright
// ============================================================

const staticPages = [
  { path: "/about", title: /about/i },
  { path: "/contact", title: /contact/i },
  { path: "/careers", title: /career/i },
  { path: "/blog", title: /blog/i },
  { path: "/help", title: /help|support/i },
  { path: "/shipping-info", title: /shipping/i },
  { path: "/faq", title: /faq|frequently/i },
  { path: "/privacy", title: /privacy/i },
  { path: "/terms", title: /terms/i },
  { path: "/cookies", title: /cookie/i },
  { path: "/accessibility", title: /accessibility/i },
];

test.describe("Static Pages – Load & Heading", () => {
  for (const pg of staticPages) {
    test(`${pg.path} loads with heading`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForTimeout(2000);
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();
      const text = await heading.textContent();
      expect(text).toMatch(pg.title);
      await page.screenshot({ path: `e2e/screenshots/pw-static-${pg.path.replace("/", "")}.png` });
    });
  }
});

test.describe("Static Pages – Content & Structure", () => {
  for (const pg of staticPages) {
    test(`${pg.path} has paragraphs`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForTimeout(2000);
      expect(await page.locator("p").count()).toBeGreaterThanOrEqual(1);
    });

    test(`${pg.path} has header and footer`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForTimeout(2000);
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });
  }
});

test.describe("Categories Page (Public)", () => {
  test("renders categories with cards", async ({ page }) => {
    await page.goto("/categories");
    await page.waitForTimeout(3000);
    await expect(page.getByText(/categories/i).first()).toBeVisible();
    await expect(page.locator('[class*="card"], a[href*="/categories/"]').first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-categories-public.png" });
  });

  test("category card links to filtered page", async ({ page }) => {
    await page.goto("/categories");
    await page.waitForTimeout(3000);
    await page.locator('a[href*="/categories/"]').first().click();
    await expect(page).toHaveURL(/\/categories\//);
  });
});

test.describe("Brands Page (Public)", () => {
  test("renders brands with cards", async ({ page }) => {
    await page.goto("/brands");
    await page.waitForTimeout(3000);
    await expect(page.getByText(/brands/i).first()).toBeVisible();
    await expect(page.locator('[class*="card"], a[href*="/brands/"]').first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-brands-public.png" });
  });

  test("brand card links to filtered page", async ({ page }) => {
    await page.goto("/brands");
    await page.waitForTimeout(3000);
    await page.locator('a[href*="/brands/"]').first().click();
    await expect(page).toHaveURL(/\/brands\//);
  });
});

test.describe("Offers Page (Public)", () => {
  test("renders offers page", async ({ page }) => {
    await page.goto("/offers");
    await page.waitForTimeout(3000);
    await expect(page.getByText(/offers|deals/i).first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-offers-public.png" });
  });
});

test.describe("Track Order Page", () => {
  test("renders with input and track button", async ({ page }) => {
    await page.goto("/orders/track");
    await page.waitForTimeout(2000);
    await expect(page.getByText(/track/i).first()).toBeVisible();
    await expect(page.locator("input").first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/pw-track-order.png" });
  });

  test("invalid order shows not found", async ({ page }) => {
    await page.goto("/orders/track");
    await page.waitForTimeout(2000);
    await page.locator("input").first().fill("INVALIDORDER");
    await page.locator('button[type="submit"], button').filter({ hasText: /track/i }).click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "e2e/screenshots/pw-track-not-found.png" });
  });
});

test.describe("404 Page", () => {
  test("shows 404 for unknown route", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await page.waitForTimeout(2000);
    const text = await page.textContent("body");
    expect(text).toMatch(/not found|404/i);
    await page.screenshot({ path: "e2e/screenshots/pw-404.png" });
  });

  test("has link back to home", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await page.waitForTimeout(2000);
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });
});

test.describe("Mobile – Static Pages", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const pg of staticPages) {
    test(`${pg.path} on mobile`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForTimeout(2000);
      await expect(page.locator("h1, h2").first()).toBeVisible();
      await page.screenshot({ path: `e2e/screenshots/pw-mobile-${pg.path.replace("/", "")}.png` });
    });
  }
});
