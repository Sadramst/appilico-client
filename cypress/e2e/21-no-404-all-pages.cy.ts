/// <reference types="cypress" />

// ============================================================
// No 404 – Every page in the app must load without 404
// ============================================================

describe("Storefront Pages – No 404 Errors", () => {
  const publicPages = [
    { path: "/", name: "Homepage" },
    { path: "/products", name: "Products" },
    { path: "/categories", name: "Categories" },
    { path: "/brands", name: "Brands" },
    { path: "/offers", name: "Offers" },
    { path: "/login", name: "Login" },
    { path: "/register", name: "Register" },
    { path: "/forgot-password", name: "Forgot Password" },
  ];

  publicPages.forEach(({ path, name }) => {
    it(`${name} (${path}) loads without 404`, () => {
      cy.visit(path, { failOnStatusCode: false });
      cy.wait(2000);
      cy.contains("404").should("not.exist");
      cy.contains("not found", { matchCase: false }).should("not.exist");
    });
  });
});

describe("Storefront Static Pages – No 404 Errors", () => {
  const staticPages = [
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
    { path: "/careers", name: "Careers" },
    { path: "/blog", name: "Blog" },
    { path: "/help", name: "Help Center" },
    { path: "/shipping", name: "Shipping" },
    { path: "/size-guide", name: "Size Guide" },
    { path: "/faq", name: "FAQ" },
    { path: "/track", name: "Track Order" },
    { path: "/privacy", name: "Privacy Policy" },
    { path: "/terms", name: "Terms of Service" },
    { path: "/cookies", name: "Cookie Policy" },
    { path: "/accessibility", name: "Accessibility" },
  ];

  staticPages.forEach(({ path, name }) => {
    it(`${name} (${path}) loads without 404`, () => {
      cy.visit(path, { failOnStatusCode: false });
      cy.wait(2000);
      cy.contains("404").should("not.exist");
      cy.contains("not found", { matchCase: false }).should("not.exist");
    });
  });
});

describe("Authenticated User Pages – No 404 Errors", () => {
  beforeEach(() => {
    cy.login();
  });

  const authPages = [
    { path: "/profile", name: "Profile" },
    { path: "/orders", name: "Orders" },
    { path: "/wishlist", name: "Wishlist" },
    { path: "/cart", name: "Cart" },
  ];

  authPages.forEach(({ path, name }) => {
    it(`${name} (${path}) loads without 404`, () => {
      cy.visit(path, { failOnStatusCode: false });
      cy.wait(3000);
      cy.contains("404").should("not.exist");
      cy.contains("not found", { matchCase: false }).should("not.exist");
    });
  });
});

describe("Admin Pages – No 404 Errors", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  const adminPages = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/dashboard/products", name: "Products" },
    { path: "/dashboard/products/new", name: "New Product" },
    { path: "/dashboard/categories", name: "Categories" },
    { path: "/dashboard/brands", name: "Brands" },
    { path: "/dashboard/orders", name: "Orders" },
    { path: "/dashboard/customers", name: "Customers" },
    { path: "/dashboard/discounts", name: "Discounts" },
    { path: "/dashboard/vouchers", name: "Vouchers" },
    { path: "/dashboard/offers", name: "Offers" },
    { path: "/dashboard/inventory", name: "Inventory" },
    { path: "/dashboard/reviews", name: "Reviews" },
    { path: "/dashboard/settings", name: "Settings" },
  ];

  adminPages.forEach(({ path, name }) => {
    it(`Admin ${name} (${path}) loads without 404`, () => {
      cy.visit(path, { failOnStatusCode: false });
      cy.wait(3000);
      cy.contains("404").should("not.exist");
      cy.contains("not found", { matchCase: false }).should("not.exist");
    });
  });

  it("Admin product edit page loads for first product", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("404").should("not.exist");
    cy.contains("not found", { matchCase: false }).should("not.exist");
    cy.contains("Edit Product").should("be.visible");
  });

  it("Admin order detail page loads for first order", () => {
    cy.visit("/dashboard/orders");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("404").should("not.exist");
    cy.contains("not found", { matchCase: false }).should("not.exist");
  });
});

describe("Product Detail Page – No 404 for linked product", () => {
  it("clicking a product from listing opens detail without 404", () => {
    cy.visit("/products");
    cy.wait(3000);
    cy.get("a[href*='/products/']").first().click();
    cy.wait(3000);
    cy.contains("404").should("not.exist");
    cy.contains("not found", { matchCase: false }).should("not.exist");
  });
});
