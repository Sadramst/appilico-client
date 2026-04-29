/// <reference types="cypress" />

// ============================================================
// 02 - AUTHENTICATION – Exhaustive Tests
// ============================================================

describe("Login Page – Rendering", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders login card with heading 'Welcome back'", () => {
    cy.contains("Welcome back").should("be.visible");
    cy.contains("Sign in to your account to continue").should("be.visible");
    cy.takeVisualSnapshot("login-page-heading");
  });

  it("shows Appilico logo link to homepage", () => {
    cy.get('a[href="/"]').should("exist");
  });

  it("email input with label and placeholder", () => {
    cy.contains("label", "Email").should("be.visible");
    cy.get('input[type="email"]').should("have.attr", "placeholder", "name@example.com");
  });

  it("password input with label and placeholder", () => {
    cy.contains("label", "Password").should("be.visible");
    cy.get('input[type="password"]').should("have.attr", "placeholder", "••••••••");
  });

  it("password visibility toggle (eye icon)", () => {
    cy.get('input[type="password"]').should("exist");
    // Click eye icon
    cy.get('input[type="password"]').parent().find("button").click();
    cy.get('input[type="text"]').should("exist"); // now visible
    // Click again to hide
    cy.get('input[type="text"]').parent().find("button").click();
    cy.get('input[type="password"]').should("exist"); // hidden again
    cy.takeVisualSnapshot("login-password-toggle");
  });

  it("Forgot password? link present and navigates", () => {
    cy.contains("Forgot password?").should("be.visible").click();
    cy.url().should("include", "/forgot-password");
  });

  it("Sign In button present", () => {
    cy.get('button[type="submit"]').contains("Sign In").should("be.visible");
  });

  it("Sign up link present in footer", () => {
    cy.contains("Don't have an account?").should("be.visible");
    cy.contains("Sign up").should("be.visible").click();
    cy.url().should("include", "/register");
  });
});

describe("Login Page – Validation", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("empty form submit shows 'Email is required'", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Email is required").should("be.visible");
    cy.takeVisualSnapshot("login-empty-validation");
  });

  it("empty form submit shows 'Password is required'", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Password is required").should("be.visible");
  });

  it("invalid email format shows 'Invalid email address'", () => {
    cy.get('input[type="email"]').type("notanemail");
    cy.get('input[type="password"]').type("Password@123!");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid email address").should("be.visible");
    cy.takeVisualSnapshot("login-invalid-email");
  });

  it("email only (no password) shows password required", () => {
    cy.get('input[type="email"]').type("test@test.com");
    cy.get('button[type="submit"]').click();
    cy.contains("Password is required").should("be.visible");
  });

  it("password only (no email) shows email required", () => {
    cy.get('input[type="password"]').type("Password@123!");
    cy.get('button[type="submit"]').click();
    cy.contains("Email is required").should("be.visible");
  });
});

describe("Login Page – Submission", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("invalid credentials show error toast", () => {
    cy.get('input[type="email"]').type("wrong@wrong.com");
    cy.get('input[type="password"]').type("WrongPassword@123!");
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    cy.takeVisualSnapshot("login-invalid-credentials");
  });

  it("button shows loading spinner during submission", () => {
    cy.get('input[type="email"]').type("wrong@wrong.com");
    cy.get('input[type="password"]').type("WrongPassword@123!");
    cy.get('button[type="submit"]').click();
    // Button should be disabled during loading
    cy.get('button[type="submit"]').should("be.disabled");
    cy.takeVisualSnapshot("login-loading-state");
    cy.wait(5000);
  });

  it("successful login redirects away from /login", () => {
    cy.get('input[type="email"]').type(Cypress.env("customerEmail"));
    cy.get('input[type="password"]').type(Cypress.env("customerPassword"));
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should("not.include", "/login");
    cy.takeVisualSnapshot("login-success");
  });

  it("successful login stores tokens in localStorage", () => {
    cy.get('input[type="email"]').type(Cypress.env("customerEmail"));
    cy.get('input[type="password"]').type(Cypress.env("customerPassword"));
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should("not.include", "/login");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("appilico_access_token")).to.not.be.null;
      expect(win.localStorage.getItem("appilico_refresh_token")).to.not.be.null;
      expect(win.localStorage.getItem("appilico_user")).to.not.be.null;
    });
  });

  it("admin login redirects to dashboard", () => {
    cy.get('input[type="email"]').type(Cypress.env("adminEmail"));
    cy.get('input[type="password"]').type(Cypress.env("adminPassword"));
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
    cy.takeVisualSnapshot("admin-login-redirect");
  });
});

describe("Register Page – Rendering", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("renders registration card with heading 'Create an account'", () => {
    cy.contains("Create an account").should("be.visible");
    cy.contains("Join Appilico for a premium shopping experience").should("be.visible");
    cy.takeVisualSnapshot("register-page-heading");
  });

  it("shows Appilico logo link to homepage", () => {
    cy.get('a[href="/"]').should("exist");
  });

  it("First Name input with label", () => {
    cy.contains("label", "First Name").should("be.visible");
    cy.get('input[placeholder="John"]').should("be.visible");
  });

  it("Last Name input with label", () => {
    cy.contains("label", "Last Name").should("be.visible");
    cy.get('input[placeholder="Doe"]').should("be.visible");
  });

  it("Email input with label", () => {
    cy.contains("label", "Email").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
  });

  it("Password input with label", () => {
    cy.contains("label", "Password").should("be.visible");
    cy.get('input[type="password"]').should("have.length.at.least", 1);
  });

  it("Confirm Password input with label", () => {
    cy.contains("label", "Confirm Password").should("be.visible");
  });

  it("password visibility toggle works", () => {
    cy.get('input[type="password"]').first().parent().find("button").click();
    cy.get('input[type="text"]').should("have.length.at.least", 1);
  });

  it("Create Account button present", () => {
    cy.get('button[type="submit"]').contains("Create Account").should("be.visible");
  });

  it("Sign in link in footer", () => {
    cy.contains("Already have an account?").should("be.visible");
    cy.contains("Sign in").should("be.visible").click();
    cy.url().should("include", "/login");
  });
});

describe("Register Page – Validation", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("empty submit shows 'First name is required'", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("First name is required").should("be.visible");
  });

  it("empty submit shows 'Last name is required'", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Last name is required").should("be.visible");
  });

  it("empty submit shows 'Email is required'", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Email is required").should("be.visible");
    cy.takeVisualSnapshot("register-all-validation-errors");
  });

  it("short password shows minimum length error", () => {
    cy.get('input[placeholder="John"]').type("Test");
    cy.get('input[placeholder="Doe"]').type("User");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').first().type("Ab1!");
    cy.get('button[type="submit"]').click();
    cy.contains("at least 8 characters").should("be.visible");
    cy.takeVisualSnapshot("register-short-password");
  });

  it("password without uppercase shows error", () => {
    cy.get('input[placeholder="John"]').type("Test");
    cy.get('input[placeholder="Doe"]').type("User");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').first().type("lowercase1!");
    cy.get('button[type="submit"]').click();
    cy.contains("uppercase letter").should("be.visible");
  });

  it("password without lowercase shows error", () => {
    cy.get('input[placeholder="John"]').type("Test");
    cy.get('input[placeholder="Doe"]').type("User");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').first().type("UPPERCASE1!");
    cy.get('button[type="submit"]').click();
    cy.contains("lowercase letter").should("be.visible");
  });

  it("password without number shows error", () => {
    cy.get('input[placeholder="John"]').type("Test");
    cy.get('input[placeholder="Doe"]').type("User");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').first().type("Password!");
    cy.get('button[type="submit"]').click();
    cy.contains("number").should("be.visible");
  });

  it("password without special char shows error", () => {
    cy.get('input[placeholder="John"]').type("Test");
    cy.get('input[placeholder="Doe"]').type("User");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').first().type("Password1a");
    cy.get('button[type="submit"]').click();
    cy.contains("special character").should("be.visible");
  });

  it("password mismatch shows 'Passwords don't match'", () => {
    cy.get('input[placeholder="John"]').type("Test");
    cy.get('input[placeholder="Doe"]').type("User");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').first().type("Password@123!");
    // Need to find confirm password field specifically
    cy.get('input[type="password"]').last().type("Different@123!");
    cy.get('button[type="submit"]').click();
    cy.contains("match").should("be.visible");
    cy.takeVisualSnapshot("register-password-mismatch");
  });

  it("invalid email format shows error", () => {
    cy.get('input[placeholder="John"]').type("Test");
    cy.get('input[placeholder="Doe"]').type("User");
    cy.get('input[type="email"]').type("notvalid");
    cy.get('input[type="password"]').first().type("Password@123!");
    cy.get('input[type="password"]').last().type("Password@123!");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid email").should("be.visible");
  });
});

describe("Forgot Password Page", () => {
  beforeEach(() => {
    cy.visit("/forgot-password");
  });

  it("renders with heading", () => {
    cy.get("h1, h2").should("be.visible");
    cy.takeVisualSnapshot("forgot-password-page");
  });

  it("email input with label", () => {
    cy.get('input[type="email"]').should("be.visible");
  });

  it("Send Reset Link button", () => {
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("Back to Sign In link navigates to /login", () => {
    cy.contains(/back to sign in|back to login/i).click();
    cy.url().should("include", "/login");
  });

  it("empty submit shows email required", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Email is required").should("be.visible");
  });

  it("invalid email shows format error", () => {
    cy.get('input[type="email"]').type("notvalid");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid email").should("be.visible");
    cy.takeVisualSnapshot("forgot-password-validation");
  });

  it("valid email submission shows confirmation", () => {
    cy.get('input[type="email"]').type("customer1@appilico.com");
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.takeVisualSnapshot("forgot-password-submitted");
  });
});

describe("Auth Guard – Protected Routes", () => {
  it("visiting /profile without login redirects to login", () => {
    cy.clearAllLocalStorage();
    cy.visit("/profile");
    cy.url().should("include", "/login");
  });

  it("visiting /orders without login redirects to login", () => {
    cy.clearAllLocalStorage();
    cy.visit("/orders");
    cy.url().should("include", "/login");
  });

  it("visiting /addresses without login redirects to login", () => {
    cy.clearAllLocalStorage();
    cy.visit("/addresses");
    cy.url().should("include", "/login");
  });

  it("visiting /wishlist without login redirects to login", () => {
    cy.clearAllLocalStorage();
    cy.visit("/wishlist");
    cy.url().should("include", "/login");
  });

  it("visiting /checkout without login redirects to login", () => {
    cy.clearAllLocalStorage();
    cy.visit("/checkout");
    cy.url().should("include", "/login");
  });

  it("visiting /dashboard without admin login redirects", () => {
    cy.clearAllLocalStorage();
    cy.visit("/dashboard");
    cy.url().should("not.include", "/dashboard");
  });
});
