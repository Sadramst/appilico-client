/// <reference types="cypress" />

// ============================================================
// Full Admin Journey – End-to-end admin workflow tests
// ============================================================

describe("Admin Journey – Login and Dashboard", () => {
  it("admin can login via UI and see dashboard", () => {
    cy.visit("/login");
    cy.get('input[type="email"], input[name="email"]').clear().type(Cypress.env("adminEmail"));
    cy.get('input[type="password"], input[name="password"]').first().clear().type(Cypress.env("adminPassword"));
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  });
});

describe("Admin Journey – Products Workflow", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("navigate sidebar Products → products list → product detail → back", () => {
    cy.visit("/dashboard");
    cy.wait(3000);
    // Click Products in sidebar
    cy.get("aside, nav").contains("Products").click();
    cy.wait(3000);
    cy.url().should("include", "/dashboard/products");
    cy.get("table tbody tr").should("have.length.at.least", 1);

    // Click first product row
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.contains("Edit Product").should("be.visible");

    // Go back
    cy.contains("Back to Products").click();
    cy.wait(2000);
    cy.url().should("include", "/dashboard/products");
    cy.url().should("not.match", /\/products\/[a-zA-Z0-9-]+$/);
  });

  it("navigate to Add Product page from products list", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.contains("Add Product").click();
    cy.wait(2000);
    cy.url().should("include", "/dashboard/products/new");
    cy.contains("New Product").should("be.visible");
    cy.contains("Product Information").should("be.visible");
    cy.contains("Pricing & Stock").should("be.visible");
  });

  it("product edit form is editable – can change name and see updated value", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    const newName = "Cypress Test Edit " + Date.now();
    cy.get('input[name="name"]').clear().type(newName);
    cy.get('input[name="name"]').should("have.value", newName);
  });

  it("product edit form – number fields are editable", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.get('input[name="basePrice"]').clear().type("49.99");
    cy.get('input[name="basePrice"]').should("have.value", "49.99");
    cy.get('input[name="stockQuantity"]').clear().type("200");
    cy.get('input[name="stockQuantity"]').should("have.value", "200");
  });
});

describe("Admin Journey – Categories Workflow", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("navigate sidebar Categories → categories list with table", () => {
    cy.visit("/dashboard");
    cy.wait(3000);
    cy.get("aside, nav").contains("Categories").click();
    cy.wait(3000);
    cy.url().should("include", "/dashboard/categories");
    cy.get("table").should("exist");
  });

  it("open Add Category dialog → fill form → close", () => {
    cy.visit("/dashboard/categories");
    cy.wait(4000);
    cy.contains("button", "Add Category").click();
    cy.wait(500);
    cy.contains("New Category").should("be.visible");
    cy.get('[role="dialog"] input').first().type("Cypress Test Category");
    // Close without saving
    cy.get("body").type("{escape}");
    cy.wait(500);
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("open Edit dialog for existing category", () => {
    cy.visit("/dashboard/categories");
    cy.wait(4000);
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /edit/i).click();
    });
    cy.wait(500);
    cy.contains("Edit Category").should("be.visible");
    cy.get('[role="dialog"] input').first().should("not.have.value", "");
    cy.get("body").type("{escape}");
  });
});

describe("Admin Journey – Brands Workflow", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("navigate sidebar Brands → brands list with table", () => {
    cy.visit("/dashboard");
    cy.wait(3000);
    cy.get("aside, nav").contains("Brands").click();
    cy.wait(3000);
    cy.url().should("include", "/dashboard/brands");
    cy.get("table").should("exist");
  });

  it("open Add Brand dialog → fill form → close", () => {
    cy.visit("/dashboard/brands");
    cy.wait(4000);
    cy.contains("button", "Add Brand").click();
    cy.wait(500);
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"] input').first().type("Cypress Test Brand");
    cy.get("body").type("{escape}");
    cy.wait(500);
  });
});

describe("Admin Journey – Orders Workflow", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("navigate sidebar Orders → orders table → order detail → back", () => {
    cy.visit("/dashboard");
    cy.wait(3000);
    cy.get("aside, nav").contains("Orders").click();
    cy.wait(3000);
    cy.url().should("include", "/dashboard/orders");
    cy.get("table tbody tr").should("have.length.at.least", 1);

    // Click first order
    cy.get("table tbody tr").first().click();
    cy.wait(3000);
    cy.url().should("match", /\/dashboard\/orders\/[a-zA-Z0-9-]+/);

    // Go back
    cy.go("back");
    cy.wait(2000);
    cy.url().should("include", "/dashboard/orders");
  });
});

describe("Admin Journey – Other Admin Pages", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("Customers page renders with table", () => {
    cy.visit("/dashboard/customers");
    cy.wait(4000);
    cy.contains("Customers").should("be.visible");
    cy.get("table").should("exist");
  });

  it("Discounts page renders with Add Discount button", () => {
    cy.visit("/dashboard/discounts");
    cy.wait(4000);
    cy.contains("Discounts").should("be.visible");
    cy.contains("Add Discount").should("be.visible");
  });

  it("Vouchers page renders with Add Voucher button", () => {
    cy.visit("/dashboard/vouchers");
    cy.wait(4000);
    cy.contains("Vouchers").should("be.visible");
    cy.contains("Add Voucher").should("be.visible");
  });

  it("Offers page renders with Add Offer button", () => {
    cy.visit("/dashboard/offers");
    cy.wait(4000);
    cy.contains(/offers/i).should("be.visible");
    cy.contains("Add Offer").should("be.visible");
  });

  it("Inventory page renders with data", () => {
    cy.visit("/dashboard/inventory");
    cy.wait(4000);
    cy.contains("Inventory").should("be.visible");
  });

  it("Reviews page renders with table", () => {
    cy.visit("/dashboard/reviews");
    cy.wait(4000);
    cy.contains("Reviews").should("be.visible");
  });

  it("Settings page renders with form", () => {
    cy.visit("/dashboard/settings");
    cy.wait(4000);
    cy.contains("Settings").should("be.visible");
    cy.contains("button", /save/i).should("be.visible");
  });
});

describe("Admin Journey – Sidebar Navigation", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard");
    cy.wait(3000);
  });

  const sidebarLinks = [
    { label: "Dashboard", url: "/dashboard" },
    { label: "Products", url: "/dashboard/products" },
    { label: "Categories", url: "/dashboard/categories" },
    { label: "Brands", url: "/dashboard/brands" },
    { label: "Orders", url: "/dashboard/orders" },
    { label: "Customers", url: "/dashboard/customers" },
    { label: "Discounts", url: "/dashboard/discounts" },
    { label: "Vouchers", url: "/dashboard/vouchers" },
    { label: "Inventory", url: "/dashboard/inventory" },
    { label: "Reviews", url: "/dashboard/reviews" },
    { label: "Settings", url: "/dashboard/settings" },
  ];

  sidebarLinks.forEach(({ label, url }) => {
    it(`sidebar "${label}" link navigates to ${url}`, () => {
      cy.get("aside, nav").contains(label).click();
      cy.wait(2000);
      cy.url().should("include", url);
    });
  });
});

describe("Admin Journey – Full Storefront Access as Admin", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("admin can visit storefront homepage", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.contains("404").should("not.exist");
  });

  it("admin can visit products page", () => {
    cy.visit("/products");
    cy.wait(3000);
    cy.contains("404").should("not.exist");
  });

  it("admin can click product and view detail", () => {
    cy.visit("/products");
    cy.wait(3000);
    cy.get("a[href*='/products/']").first().click();
    cy.wait(3000);
    cy.contains("404").should("not.exist");
  });
});
