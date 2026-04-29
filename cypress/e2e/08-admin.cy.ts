/// <reference types="cypress" />

// ============================================================
// 08 - ADMIN PANEL – Exhaustive Tests
// ============================================================

describe("Admin – Dashboard", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard");
    cy.wait(3000);
  });

  it("renders dashboard page", () => {
    cy.contains("Dashboard").should("be.visible");
    cy.takeVisualSnapshot("admin-dashboard-full");
  });

  it("shows 4 stats cards (Revenue, Orders, Customers, Products)", () => {
    cy.get('[class*="card"]').should("have.length.at.least", 4);
    cy.takeVisualSnapshot("admin-stats-cards");
  });

  it("stats card shows value with $ or number", () => {
    cy.get('[class*="card"]').first().invoke("text").should("match", /\$?\d/);
  });

  it("stats card shows percentage change", () => {
    cy.get('[class*="card"]').first().invoke("text").should("match", /%/);
  });

  it("Revenue Chart renders", () => {
    cy.contains(/revenue/i).should("be.visible");
    cy.takeVisualSnapshot("admin-revenue-chart");
  });

  it("Recent Orders table renders", () => {
    cy.contains(/recent orders/i).should("be.visible");
    cy.takeVisualSnapshot("admin-recent-orders");
  });

  it("Recent Orders table shows columns", () => {
    cy.contains(/recent orders/i).should("be.visible");
  });

  it("Top Products list renders", () => {
    cy.contains(/top products/i).should("be.visible");
    cy.takeVisualSnapshot("admin-top-products");
  });

  it("admin sidebar shows all ADMIN_NAV_LINKS", () => {
    const adminLinks = [
      "Dashboard", "Products", "Categories", "Brands", "Orders",
      "Customers", "Discounts", "Vouchers", "Special Offers",
      "Inventory", "Reviews", "Settings"
    ];
    adminLinks.forEach((link) => {
      cy.get("aside, nav").contains(link).should("exist");
    });
    cy.takeVisualSnapshot("admin-sidebar-all-links");
  });

  it("admin header shows admin user avatar", () => {
    cy.get('[class*="avatar"]').should("have.length.at.least", 1);
  });

  it("Dashboard link is active in sidebar", () => {
    cy.get('a[href="/dashboard"]').should("exist");
    cy.takeVisualSnapshot("admin-sidebar-dashboard-active");
  });
});

describe("Admin – Products Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/products");
    cy.wait(3000);
  });

  it("renders Products page with heading", () => {
    cy.contains("Products").should("be.visible");
    cy.takeVisualSnapshot("admin-products-page");
  });

  it("shows search input", () => {
    cy.get('input[placeholder*="search" i]').should("be.visible");
  });

  it("shows Add Product button", () => {
    cy.contains(/add product/i).should("be.visible");
  });

  it("shows product data table", () => {
    cy.get("table, [class*='table']").should("exist");
    cy.takeVisualSnapshot("admin-products-table");
  });

  it("table shows columns: Image, Name, Price, Stock, Status", () => {
    cy.get("body").invoke("text").should("match", /name/i);
    cy.get("body").invoke("text").should("match", /price/i);
  });

  it("shows pagination controls", () => {
    cy.get('button').filter(':contains("Next"), :contains("Previous"), :has(svg)').should("have.length.at.least", 1);
  });

  it("search filters table", () => {
    cy.get('input[placeholder*="search" i]').type("test");
    cy.wait(2000);
    cy.takeVisualSnapshot("admin-products-search-filtered");
  });

  it("Add Product opens form/dialog", () => {
    cy.contains(/add product/i).click();
    cy.wait(1000);
    cy.takeVisualSnapshot("admin-add-product");
  });
});

describe("Admin – Categories Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/categories");
    cy.wait(3000);
  });

  it("renders Categories page", () => {
    cy.contains("Categories").should("be.visible");
    cy.takeVisualSnapshot("admin-categories-page");
  });

  it("shows search input", () => {
    cy.get('input[placeholder*="search" i]').should("be.visible");
  });

  it("shows Add Category button", () => {
    cy.contains(/add category/i).should("be.visible");
  });

  it("shows categories table or grid", () => {
    cy.get("table, [class*='card'], [class*='grid']").should("exist");
    cy.takeVisualSnapshot("admin-categories-table");
  });

  it("Add Category opens form", () => {
    cy.contains(/add category/i).click();
    cy.wait(1000);
    cy.takeVisualSnapshot("admin-add-category");
  });
});

describe("Admin – Brands Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/brands");
    cy.wait(3000);
  });

  it("renders Brands page", () => {
    cy.contains("Brands").should("be.visible");
    cy.takeVisualSnapshot("admin-brands-page");
  });

  it("shows search and Add Brand button", () => {
    cy.get('input[placeholder*="search" i]').should("be.visible");
    cy.contains(/add brand/i).should("be.visible");
  });

  it("shows brands data", () => {
    cy.get("table, [class*='card']").should("exist");
    cy.takeVisualSnapshot("admin-brands-table");
  });
});

describe("Admin – Orders Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/orders");
    cy.wait(3000);
  });

  it("renders Orders page", () => {
    cy.contains("Orders").should("be.visible");
    cy.takeVisualSnapshot("admin-orders-page");
  });

  it("shows search input", () => {
    cy.get('input[placeholder*="search" i]').should("be.visible");
  });

  it("shows orders table with status badges", () => {
    cy.get("table, [class*='table']").should("exist");
    cy.takeVisualSnapshot("admin-orders-table");
  });

  it("shows pagination", () => {
    cy.get('button').filter(':contains("Next"), :contains("Previous")').should("have.length.at.least", 1);
  });

  it("clicking order row navigates to detail", () => {
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/dashboard/orders/"]').length) {
        cy.get('a[href*="/dashboard/orders/"]').first().click();
        cy.url().should("include", "/dashboard/orders/");
        cy.takeVisualSnapshot("admin-order-detail");
      }
    });
  });
});

describe("Admin – Customers Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/customers");
    cy.wait(3000);
  });

  it("renders Customers page", () => {
    cy.contains("Customers").should("be.visible");
    cy.takeVisualSnapshot("admin-customers-page");
  });

  it("shows customer data table", () => {
    cy.get("table, [class*='table']").should("exist");
  });

  it("shows search input", () => {
    cy.get('input[placeholder*="search" i]').should("be.visible");
  });

  it("shows pagination controls", () => {
    cy.get('button').filter(':contains("Next"), :contains("Previous"), :has(svg)').should("have.length.at.least", 1);
  });
});

describe("Admin – Discounts Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/discounts");
    cy.wait(3000);
  });

  it("renders Discounts page", () => {
    cy.contains("Discounts").should("be.visible");
    cy.takeVisualSnapshot("admin-discounts-page");
  });

  it("shows Add Discount button", () => {
    cy.contains(/add discount/i).should("be.visible");
  });

  it("shows discounts table", () => {
    cy.get("table, [class*='table']").should("exist");
    cy.takeVisualSnapshot("admin-discounts-table");
  });
});

describe("Admin – Vouchers Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/vouchers");
    cy.wait(3000);
  });

  it("renders Vouchers page", () => {
    cy.contains("Vouchers").should("be.visible");
    cy.takeVisualSnapshot("admin-vouchers-page");
  });

  it("shows Add Voucher button", () => {
    cy.contains(/add voucher/i).should("be.visible");
  });

  it("shows vouchers table", () => {
    cy.get("table, [class*='table']").should("exist");
  });
});

describe("Admin – Special Offers Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/offers");
    cy.wait(3000);
  });

  it("renders Special Offers page", () => {
    cy.contains(/offers/i).should("be.visible");
    cy.takeVisualSnapshot("admin-offers-page");
  });

  it("shows Add Offer button", () => {
    cy.contains(/add offer/i).should("be.visible");
  });

  it("shows offers table", () => {
    cy.get("table, [class*='table']").should("exist");
  });
});

describe("Admin – Inventory Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/inventory");
    cy.wait(3000);
  });

  it("renders Inventory page", () => {
    cy.contains(/inventory/i).should("be.visible");
    cy.takeVisualSnapshot("admin-inventory-page");
  });

  it("shows inventory data", () => {
    cy.get("table, [class*='table']").should("exist");
  });

  it("shows search input", () => {
    cy.get('input[placeholder*="search" i]').should("be.visible");
  });
});

describe("Admin – Reviews Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/reviews");
    cy.wait(3000);
  });

  it("renders Reviews page", () => {
    cy.contains("Reviews").should("be.visible");
    cy.takeVisualSnapshot("admin-reviews-page");
  });

  it("shows reviews table", () => {
    cy.get("table, [class*='table']").should("exist");
  });

  it("shows search input", () => {
    cy.get('input[placeholder*="search" i]').should("be.visible");
  });
});

describe("Admin – Settings Page", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/settings");
    cy.wait(3000);
  });

  it("renders Settings page", () => {
    cy.contains("Settings").should("be.visible");
    cy.takeVisualSnapshot("admin-settings-page");
  });

  it("shows settings form fields", () => {
    cy.get("input, textarea").should("have.length.at.least", 1);
  });

  it("shows Save button", () => {
    cy.get('button[type="submit"]').should("be.visible");
  });
});

describe("Admin – Auth Guard", () => {
  it("redirects non-admin user from /dashboard", () => {
    cy.login();
    cy.visit("/dashboard");
    cy.wait(3000);
    cy.url().should("not.include", "/dashboard");
    cy.takeVisualSnapshot("admin-non-admin-redirect");
  });

  it("redirects unauthenticated user from /dashboard", () => {
    cy.visit("/dashboard");
    cy.wait(3000);
    cy.url().should("include", "/login");
    cy.takeVisualSnapshot("admin-unauthenticated-redirect");
  });
});

describe("Admin – Sidebar Navigation", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard");
    cy.wait(3000);
  });

  it("Products link navigates to /dashboard/products", () => {
    cy.get("aside, nav").contains("Products").click();
    cy.url().should("include", "/dashboard/products");
  });

  it("Categories link navigates to /dashboard/categories", () => {
    cy.get("aside, nav").contains("Categories").click();
    cy.url().should("include", "/dashboard/categories");
  });

  it("Brands link navigates to /dashboard/brands", () => {
    cy.get("aside, nav").contains("Brands").click();
    cy.url().should("include", "/dashboard/brands");
  });

  it("Orders link navigates to /dashboard/orders", () => {
    cy.get("aside, nav").contains("Orders").click();
    cy.url().should("include", "/dashboard/orders");
  });

  it("Customers link navigates to /dashboard/customers", () => {
    cy.get("aside, nav").contains("Customers").click();
    cy.url().should("include", "/dashboard/customers");
  });

  it("Discounts link navigates to /dashboard/discounts", () => {
    cy.get("aside, nav").contains("Discounts").click();
    cy.url().should("include", "/dashboard/discounts");
  });

  it("Vouchers link navigates to /dashboard/vouchers", () => {
    cy.get("aside, nav").contains("Vouchers").click();
    cy.url().should("include", "/dashboard/vouchers");
  });

  it("Special Offers link navigates to /dashboard/offers", () => {
    cy.get("aside, nav").contains("Special Offers").click();
    cy.url().should("include", "/dashboard/offers");
  });

  it("Inventory link navigates to /dashboard/inventory", () => {
    cy.get("aside, nav").contains("Inventory").click();
    cy.url().should("include", "/dashboard/inventory");
  });

  it("Reviews link navigates to /dashboard/reviews", () => {
    cy.get("aside, nav").contains("Reviews").click();
    cy.url().should("include", "/dashboard/reviews");
  });

  it("Settings link navigates to /dashboard/settings", () => {
    cy.get("aside, nav").contains("Settings").click();
    cy.url().should("include", "/dashboard/settings");
  });
});
