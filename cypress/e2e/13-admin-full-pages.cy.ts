/// <reference types="cypress" />

// ============================================================
// Admin Panel: Full Navigation + All Pages Render
// ============================================================

const API = Cypress.env("apiUrl");

describe("Admin Panel – Complete Navigation & Page Rendering", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  // ──────────── Dashboard ────────────
  it("Dashboard renders with stats, chart, and top products", () => {
    cy.visit("/dashboard");
    cy.wait(4000);
    cy.contains("Dashboard").should("be.visible");
    cy.contains("Overview of your store").should("be.visible");

    // 4 stats cards
    cy.contains("Total Revenue").should("be.visible");
    cy.contains("Total Orders").should("be.visible");
    cy.contains("Total Customers").should("be.visible");
    cy.contains("Active Customers").should("be.visible");

    // Revenue chart area
    cy.get("canvas, svg, [class*='chart'], [class*='recharts']").should("exist");
    cy.takeVisualSnapshot("admin-dashboard-full");
  });

  // ──────────── Products ────────────
  it("Products page renders with table and Add Product button", () => {
    cy.visit("/dashboard/products");
    cy.wait(4000);
    cy.contains("Products").should("be.visible");
    cy.contains("Manage your product catalog").should("be.visible");
    cy.contains("Add Product").should("be.visible");
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);

    // Table should have expected columns
    cy.contains("th", "Product").should("exist");
    cy.contains("th", "Price").should("exist");
    cy.contains("th", "Stock").should("exist");
    cy.contains("th", "Status").should("exist");

    cy.takeVisualSnapshot("admin-products-page");
  });

  // ──────────── Categories ────────────
  it("Categories page renders with data", () => {
    cy.visit("/dashboard/categories");
    cy.wait(4000);
    cy.contains("Categories").should("be.visible");
    cy.contains("Add Category").should("be.visible");
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);
    cy.takeVisualSnapshot("admin-categories-page");
  });

  // ──────────── Brands ────────────
  it("Brands page renders with data", () => {
    cy.visit("/dashboard/brands");
    cy.wait(4000);
    cy.contains("Brands").should("be.visible");
    cy.contains("Add Brand").should("be.visible");
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);
    cy.takeVisualSnapshot("admin-brands-page");
  });

  // ──────────── Orders ────────────
  it("Orders page renders with order table", () => {
    cy.visit("/dashboard/orders");
    cy.wait(4000);
    cy.contains("Orders").should("be.visible");
    cy.contains("View and manage customer orders").should("be.visible");
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);

    // Check columns
    cy.contains("th", "Order").should("exist");
    cy.contains("th", "Customer").should("exist");
    cy.contains("th", "Status").should("exist");
    cy.contains("th", "Total").should("exist");

    // Each row should have status badge
    cy.get("table tbody tr").first().find('[class*="badge"]').should("exist");
    cy.takeVisualSnapshot("admin-orders-page");
  });

  // ──────────── Order Detail ────────────
  it("Order detail page loads from orders table", () => {
    cy.visit("/dashboard/orders");
    cy.wait(4000);

    // Click eye icon on first order
    cy.get("table tbody tr").first().find('a[href*="/dashboard/orders/"]').click();
    cy.wait(3000);

    cy.url().should("include", "/dashboard/orders/");
    cy.contains(/ORD-|Order #/i).should("be.visible");
    cy.contains("Order Items").should("be.visible");
    cy.contains("Summary").should("be.visible");
    cy.contains("Back to Orders").should("be.visible");

    // Click back button
    cy.contains("Back to Orders").click();
    cy.wait(2000);
    cy.url().should("include", "/dashboard/orders");
    cy.takeVisualSnapshot("admin-order-detail-back");
  });

  // ──────────── Customers ────────────
  it("Customers page renders with customer table", () => {
    cy.visit("/dashboard/customers");
    cy.wait(4000);
    cy.contains("Customers").should("be.visible");
    cy.contains("Manage your customer base").should("be.visible");
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);

    // Customer rows should show name and email
    cy.get("table tbody tr").first().within(() => {
      cy.get('[class*="avatar"]').should("exist");
    });
    cy.takeVisualSnapshot("admin-customers-page");
  });

  // ──────────── Discounts ────────────
  it("Discounts page renders", () => {
    cy.visit("/dashboard/discounts");
    cy.wait(4000);
    cy.contains("Discounts").should("be.visible");
    cy.contains("Create Discount").should("be.visible");
    cy.takeVisualSnapshot("admin-discounts-page");
  });

  // ──────────── Vouchers ────────────
  it("Vouchers page renders", () => {
    cy.visit("/dashboard/vouchers");
    cy.wait(4000);
    cy.contains("Vouchers").should("be.visible");
    cy.contains("Create Voucher").should("be.visible");
    cy.takeVisualSnapshot("admin-vouchers-page");
  });

  // ──────────── Special Offers ────────────
  it("Offers page renders", () => {
    cy.visit("/dashboard/offers");
    cy.wait(4000);
    cy.contains("Offers").should("be.visible");
    cy.contains("Create Offer").should("be.visible");
    cy.takeVisualSnapshot("admin-offers-page");
  });

  // ──────────── Inventory ────────────
  it("Inventory page renders", () => {
    cy.visit("/dashboard/inventory");
    cy.wait(4000);
    cy.contains("Inventory").should("be.visible");
    cy.contains("Track stock levels").should("be.visible");
    cy.takeVisualSnapshot("admin-inventory-page");
  });

  // ──────────── Reviews ────────────
  it("Reviews page renders", () => {
    cy.visit("/dashboard/reviews");
    cy.wait(4000);
    cy.contains("Reviews").should("be.visible");
    cy.takeVisualSnapshot("admin-reviews-page");
  });

  // ──────────── Settings ────────────
  it("Settings page renders with form fields", () => {
    cy.visit("/dashboard/settings");
    cy.wait(4000);
    cy.contains("Settings").should("be.visible");
    cy.contains("Store Information").should("be.visible");
    cy.contains("Notifications").should("be.visible");

    // Form fields
    cy.get('#storeName').should("have.value", "Appilico");
    cy.get('#storeEmail').should("have.value", "support@appilico.com");
    cy.get('#storePhone').should("exist");
    cy.contains("button", "Save Changes").should("be.visible");
    cy.takeVisualSnapshot("admin-settings-page");
  });

  // ──────────── Sidebar Navigation ────────────
  it("Admin sidebar has all navigation links", () => {
    cy.visit("/dashboard");
    cy.wait(3000);

    const expectedLinks = [
      "Dashboard",
      "Products",
      "Categories",
      "Brands",
      "Orders",
      "Customers",
      "Discounts",
      "Vouchers",
      "Special Offers",
      "Inventory",
      "Reviews",
      "Settings",
    ];

    expectedLinks.forEach((label) => {
      cy.get("aside, nav").contains(label).should("exist");
    });

    cy.takeVisualSnapshot("admin-sidebar-all-links");
  });

  // ──────────── Sidebar Click Navigation ────────────
  it("Clicking each sidebar link navigates correctly", () => {
    cy.visit("/dashboard");
    cy.wait(3000);

    const navItems = [
      { label: "Products", path: "/dashboard/products" },
      { label: "Categories", path: "/dashboard/categories" },
      { label: "Brands", path: "/dashboard/brands" },
      { label: "Orders", path: "/dashboard/orders" },
      { label: "Customers", path: "/dashboard/customers" },
      { label: "Settings", path: "/dashboard/settings" },
    ];

    navItems.forEach(({ label, path }) => {
      cy.get("aside, nav").contains(label).click();
      cy.wait(2000);
      cy.url().should("include", path);
      cy.log(`✅ ${label} → ${path}`);
    });
  });
});
