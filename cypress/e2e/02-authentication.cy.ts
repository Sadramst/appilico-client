/// <reference types="cypress" />

describe("Authentication - Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders login form with all elements", () => {
    cy.takeVisualSnapshot("login-page");
    cy.get('input[type="email"], input[name="email"]').should("be.visible");
    cy.get('input[type="password"], input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
    cy.contains(/forgot password/i).should("exist");
    cy.contains(/sign up|register/i).should("exist");
  });

  it("shows validation errors on empty submit", () => {
    cy.get('button[type="submit"]').click();
    cy.takeVisualSnapshot("login-validation-errors");
  });

  it("shows error on invalid credentials", () => {
    cy.get('input[type="email"], input[name="email"]').type("wrong@test.com");
    cy.get('input[type="password"], input[name="password"]').first().type("WrongPass123!");
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.takeVisualSnapshot("login-error");
  });

  it("logs in successfully with customer credentials", () => {
    cy.get('input[type="email"], input[name="email"]').type(Cypress.env("customerEmail"));
    cy.get('input[type="password"], input[name="password"]').first().type(Cypress.env("customerPassword"));
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should("not.include", "/login");
    cy.takeVisualSnapshot("login-success-redirect");
  });

  it("navigates to forgot password page", () => {
    cy.contains(/forgot password/i).click();
    cy.url().should("include", "/forgot-password");
    cy.takeVisualSnapshot("forgot-password-page");
  });

  it("navigates to register page", () => {
    cy.contains(/sign up|register|create/i).click();
    cy.url().should("include", "/register");
  });
});

describe("Authentication - Register", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("renders registration form with all fields", () => {
    cy.takeVisualSnapshot("register-page");
    cy.get("input").should("have.length.at.least", 4);
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("shows validation errors on empty submit", () => {
    cy.get('button[type="submit"]').click();
    cy.takeVisualSnapshot("register-validation-errors");
  });

  it("shows password mismatch error", () => {
    cy.get('input[name="firstName"], input[placeholder*="First"]').first().type("Test");
    cy.get('input[name="lastName"], input[placeholder*="Last"]').first().type("User");
    cy.get('input[type="email"], input[name="email"]').type("test@example.com");
    cy.get('input[type="password"], input[name="password"]').first().type("Password@123!");
    cy.get('input[name="confirmPassword"], input[placeholder*="Confirm"]').first().type("Different@123!");
    cy.get('button[type="submit"]').click();
    cy.takeVisualSnapshot("register-password-mismatch");
  });
});

describe("Authentication - Forgot Password", () => {
  it("renders forgot password form", () => {
    cy.visit("/forgot-password");
    cy.takeVisualSnapshot("forgot-password-page");
    cy.get('input[type="email"], input[name="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });
});

describe("Authenticated Header", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });

  it("shows user avatar and dropdown menu", () => {
    cy.get('[class*="avatar"], [class*="Avatar"]').should("be.visible");
    cy.takeVisualSnapshot("authenticated-header");
  });

  it("user dropdown has profile, orders, addresses links", () => {
    cy.get('[class*="avatar"], [class*="Avatar"]').first().click({ force: true });
    cy.contains("Profile").should("be.visible");
    cy.contains("My Orders").should("be.visible");
    cy.contains("Addresses").should("be.visible");
    cy.takeVisualSnapshot("user-dropdown-menu");
  });

  it("shows wishlist icon in header when authenticated", () => {
    cy.get('a[href="/wishlist"]').should("exist");
  });
});
