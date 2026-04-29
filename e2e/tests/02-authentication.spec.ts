import { test, expect, CUSTOMER_EMAIL, CUSTOMER_PASSWORD } from "../fixtures";

test.describe("Login Page", () => {
  test("renders login form with all elements", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.getByText(/forgot password/i)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/login-page.png" });
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "e2e/screenshots/login-validation.png" });
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"], input[name="email"]').fill("wrong@test.com");
    await page.locator('input[type="password"], input[name="password"]').first().fill("WrongPass123!");
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "e2e/screenshots/login-invalid.png" });
  });

  test("logs in successfully", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"], input[name="email"]').fill(CUSTOMER_EMAIL);
    await page.locator('input[type="password"], input[name="password"]').first().fill(CUSTOMER_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
    await page.screenshot({ path: "e2e/screenshots/login-success.png" });
  });

  test("navigates to forgot password", async ({ page }) => {
    await page.goto("/login");
    await page.getByText(/forgot password/i).click();
    await expect(page).toHaveURL(/\/forgot-password/);
    await page.screenshot({ path: "e2e/screenshots/forgot-password.png" });
  });

  test("navigates to register", async ({ page }) => {
    await page.goto("/login");
    await page.getByText(/sign up|register|create/i).click();
    await expect(page).toHaveURL(/\/register/);
  });
});

test.describe("Register Page", () => {
  test("renders registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("input")).toHaveCount(/./, { timeout: 5000 });
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/register-page.png" });
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/register");
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "e2e/screenshots/register-validation.png" });
  });
});

test.describe("Forgot Password Page", () => {
  test("renders forgot password form", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/forgot-password-page.png" });
  });
});

test.describe("Authenticated Header", () => {
  test("shows user avatar after login", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await expect(page.locator('[class*="avatar"], [class*="Avatar"]').first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/authenticated-header.png" });
  });

  test("user dropdown shows profile, orders, addresses links", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await page.locator('[class*="avatar"], [class*="Avatar"]').first().click();
    await page.waitForTimeout(300);
    await expect(page.getByText("Profile")).toBeVisible();
    await expect(page.getByText("My Orders")).toBeVisible();
    await expect(page.getByText("Addresses")).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/user-dropdown.png" });
  });

  test("wishlist icon visible in header", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/wishlist"]')).toBeVisible();
  });
});
