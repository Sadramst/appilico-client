import { test, expect } from "../fixtures";

// ============================================================
// 02 - AUTHENTICATION – Playwright
// ============================================================

test.describe("Login Page – Rendering", () => {
  test("renders login heading", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("renders email input", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder("name@example.com")).toBeVisible();
  });

  test("renders password input", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
  });

  test("renders Sign In button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("renders Forgot password link", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Forgot password?")).toBeVisible();
  });

  test("renders Sign up link", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Sign up")).toBeVisible();
  });
});

test.describe("Login – Validation", () => {
  test("empty form shows email and password required", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("invalid email shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("name@example.com").fill("notanemail");
    await page.getByPlaceholder("••••••••").fill("Test@1234");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });
});

test.describe("Login – Submission", () => {
  test("successful login redirects to home", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("name@example.com").fill("customer1@appilico.com");
    await page.getByPlaceholder("••••••••").fill("Customer@123!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/", { timeout: 15000 });
    await expect(page).toHaveURL("/");
  });

  test("stores tokens in localStorage after login", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("name@example.com").fill("customer1@appilico.com");
    await page.getByPlaceholder("••••••••").fill("Customer@123!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/", { timeout: 15000 });
    const token = await page.evaluate(() => localStorage.getItem("appilico_access_token"));
    expect(token).toBeTruthy();
  });

  test("wrong credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("name@example.com").fill("wrong@test.com");
    await page.getByPlaceholder("••••••••").fill("WrongPass@1");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "e2e/screenshots/pw-login-error.png" });
  });

  test("admin login redirects to /dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("name@example.com").fill("admin@appilico.com");
    await page.getByPlaceholder("••••••••").fill("Admin@123!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL(/dashboard/);
  });
});

test.describe("Register Page – Rendering", () => {
  test("renders Create an account heading", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Create an account")).toBeVisible();
  });

  test("renders all registration fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByPlaceholder("John")).toBeVisible();
    await expect(page.getByPlaceholder("Doe")).toBeVisible();
    await expect(page.getByPlaceholder("name@example.com")).toBeVisible();
  });

  test("renders Create Account button", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("renders Sign in link", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Sign in")).toBeVisible();
  });
});

test.describe("Register – Validation", () => {
  test("empty form shows required errors", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: /create account/i }).click();
    await page.screenshot({ path: "e2e/screenshots/pw-register-validation.png" });
  });

  test("password too short shows error", async ({ page }) => {
    await page.goto("/register");
    await page.getByPlaceholder("John").fill("Test");
    await page.getByPlaceholder("Doe").fill("User");
    await page.getByPlaceholder("name@example.com").fill("test@test.com");
    await page.locator('input[type="password"]').first().fill("short");
    await page.locator('input[type="password"]').nth(1).fill("short");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/at least 8/i)).toBeVisible();
  });

  test("passwords don't match shows error", async ({ page }) => {
    await page.goto("/register");
    await page.getByPlaceholder("John").fill("Test");
    await page.getByPlaceholder("Doe").fill("User");
    await page.getByPlaceholder("name@example.com").fill("test@test.com");
    await page.locator('input[type="password"]').first().fill("Test@1234");
    await page.locator('input[type="password"]').nth(1).fill("Different@1234");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });
});

test.describe("Forgot Password Page", () => {
  test("renders forgot password form", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByPlaceholder("name@example.com")).toBeVisible();
  });

  test("shows validation error for empty email", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByRole("button", { name: /reset|send/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });
});

test.describe("Auth Guards", () => {
  test("unauthenticated user redirected from /profile", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated user redirected from /orders", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated user redirected from /wishlist", async ({ page }) => {
    await page.goto("/wishlist");
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated user redirected from /checkout", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/login/);
  });
});
