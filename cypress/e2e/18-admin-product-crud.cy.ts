/// <reference types="cypress" />

// ============================================================
// Admin Product CRUD – Create, Edit, Delete product pages
// ============================================================

describe("Admin Product – New Product Page", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/products/new");
    cy.wait(3000);
  });

  it("renders the new product page with heading", () => {
    cy.contains("New Product").should("be.visible");
    cy.contains("Add a new product to your catalog").should("be.visible");
  });

  it("shows Back to Products link", () => {
    cy.contains("Back to Products").should("be.visible");
    cy.contains("Back to Products").click();
    cy.url().should("include", "/dashboard/products");
  });

  it("renders Product Information card with name, description, SKU, barcode fields", () => {
    cy.contains("Product Information").should("be.visible");
    cy.contains("label", "Name").should("be.visible");
    cy.contains("label", "Description").should("be.visible");
    cy.contains("label", "SKU").should("be.visible");
    cy.contains("label", "Barcode").should("be.visible");
  });

  it("renders Pricing & Stock card with price and stock fields", () => {
    cy.contains("Pricing & Stock").should("be.visible");
    cy.contains("label", "Base Price").should("be.visible");
    cy.contains("label", "Cost Price").should("be.visible");
    cy.contains("label", "Stock Quantity").should("be.visible");
    cy.contains("label", "Min Stock Level").should("be.visible");
    cy.contains("label", "Weight").should("be.visible");
    cy.contains("label", "Dimensions").should("be.visible");
  });

  it("renders Category and Brand select dropdowns", () => {
    cy.contains("label", "Category").should("be.visible");
    cy.contains("label", "Brand").should("be.visible");
    cy.get("select").should("have.length.at.least", 2);
  });

  it("renders Featured toggle", () => {
    cy.contains("Featured Product").should("be.visible");
  });

  it("shows Create Product submit button", () => {
    cy.contains("button", "Create Product").should("be.visible");
  });

  it("validation – empty form submit shows required errors", () => {
    cy.contains("button", "Create Product").click();
    cy.contains("Name is required").should("be.visible");
    cy.contains("Description is required").should("be.visible");
    cy.contains("SKU is required").should("be.visible");
  });

  it("can fill in product name", () => {
    cy.get('input[name="name"]').type("Test Product Cypress");
    cy.get('input[name="name"]').should("have.value", "Test Product Cypress");
  });

  it("can fill in SKU and barcode", () => {
    cy.get('input[name="sku"]').type("TST-001");
    cy.get('input[name="sku"]').should("have.value", "TST-001");
  });

  it("number inputs accept numeric values", () => {
    cy.get('input[name="basePrice"]').clear().type("29.99");
    cy.get('input[name="basePrice"]').should("have.value", "29.99");
    cy.get('input[name="stockQuantity"]').clear().type("100");
    cy.get('input[name="stockQuantity"]').should("have.value", "100");
  });

  it("category dropdown shows options from API", () => {
    cy.get("select").first().find("option").should("have.length.at.least", 2);
  });

  it("brand dropdown shows options from API", () => {
    cy.get("select").last().find("option").should("have.length.at.least", 2);
  });
});

describe("Admin Product – Edit Product Page", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("navigating from products table to edit page works", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(2000);
    cy.url().should("match", /\/dashboard\/products\/[a-zA-Z0-9-]+/);
  });

  it("edit page renders with populated form", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("Edit Product").should("be.visible");
    cy.contains("Back to Products").should("be.visible");
  });

  it("edit page shows product info pre-filled", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.get('input[name="name"]').should("not.have.value", "");
  });

  it("edit page shows Active & Featured toggles", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("Active").should("be.visible");
    cy.contains("Featured Product").should("be.visible");
  });

  it("edit page shows Save Changes and Delete buttons", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("button", "Save Changes").should("be.visible");
    cy.contains("button", "Delete").should("be.visible");
  });

  it("edit page shows product metadata (SKU, created date)", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("SKU").should("be.visible");
    cy.contains("Created").should("be.visible");
  });

  it("delete button opens confirmation dialog", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("button", "Delete").click();
    cy.contains("Are you sure").should("be.visible");
  });

  it("can modify product name in edit form", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.get('input[name="name"]').clear().type("Updated Product Name");
    cy.get('input[name="name"]').should("have.value", "Updated Product Name");
  });
});

describe("Admin Product – Add Product from Products List", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/products");
    cy.wait(4000);
  });

  it("Add Product button navigates to new product page", () => {
    cy.contains("Add Product").click();
    cy.wait(2000);
    cy.url().should("include", "/dashboard/products/new");
    cy.contains("New Product").should("be.visible");
  });
});
