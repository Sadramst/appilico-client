/// <reference types="cypress" />

describe("Admin Dashboard", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard");
  });

  it("renders admin dashboard with stats cards", () => {
    cy.takeVisualSnapshot("admin-dashboard");
    cy.get('[class*="card"], [class*="Card"]').should("have.length.at.least", 3);
  });

  it("shows revenue chart", () => {
    cy.get('canvas, [class*="chart"], [class*="recharts"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("admin-revenue-chart");
  });

  it("shows recent orders table", () => {
    cy.contains(/recent orders/i).should("be.visible");
    cy.get("table, [role='table']").should("have.length.at.least", 1);
    cy.takeVisualSnapshot("admin-recent-orders");
  });

  it("shows top products list", () => {
    cy.contains(/top products/i).should("be.visible");
    cy.takeVisualSnapshot("admin-top-products");
  });
});

describe("Admin - Product Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/products");
  });

  it("renders products management page", () => {
    cy.takeVisualSnapshot("admin-products");
    cy.get("table, [role='table']").should("exist");
  });

  it("shows search and filter controls", () => {
    cy.get('input[type="search"], input[placeholder*="search"]').should("exist");
    cy.takeVisualSnapshot("admin-products-search");
  });

  it("navigates through product table pages", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Next"), button[aria-label="Next page"]').length) {
        cy.get('button').filter(':contains("Next"), [aria-label="Next page"]').first().click();
        cy.wait(500);
        cy.takeVisualSnapshot("admin-products-page2");
      }
    });
  });
});

describe("Admin - Category Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/categories");
  });

  it("renders categories management page", () => {
    cy.takeVisualSnapshot("admin-categories");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Brand Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/brands");
  });

  it("renders brands management page", () => {
    cy.takeVisualSnapshot("admin-brands");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Order Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/orders");
  });

  it("renders orders management page", () => {
    cy.takeVisualSnapshot("admin-orders");
    cy.get("table, [role='table']").should("exist");
  });

  it("shows order status badges", () => {
    cy.get('[class*="badge"], [class*="Badge"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("admin-orders-badges");
  });
});

describe("Admin - Customer Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/customers");
  });

  it("renders customers management page", () => {
    cy.takeVisualSnapshot("admin-customers");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Discount Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/discounts");
  });

  it("renders discounts management page", () => {
    cy.takeVisualSnapshot("admin-discounts");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Voucher Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/vouchers");
  });

  it("renders vouchers management page", () => {
    cy.takeVisualSnapshot("admin-vouchers");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Offers Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/offers");
  });

  it("renders offers management page", () => {
    cy.takeVisualSnapshot("admin-offers");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Inventory Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/inventory");
  });

  it("renders inventory management page", () => {
    cy.takeVisualSnapshot("admin-inventory");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Review Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/reviews");
  });

  it("renders reviews management page", () => {
    cy.takeVisualSnapshot("admin-reviews");
    cy.get("table, [role='table']").should("exist");
  });
});

describe("Admin - Settings", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/settings");
  });

  it("renders settings page", () => {
    cy.takeVisualSnapshot("admin-settings");
    cy.get("input").should("have.length.at.least", 1);
  });
});

describe("Admin - Navigation", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard");
  });

  it("sidebar shows all admin sections", () => {
    const sections = [
      "Products",
      "Categories",
      "Brands",
      "Orders",
      "Customers",
      "Discounts",
      "Vouchers",
      "Offers",
      "Inventory",
      "Reviews",
      "Settings",
    ];
    sections.forEach((section) => {
      cy.get("aside, nav").contains(section).should("exist");
    });
    cy.takeVisualSnapshot("admin-sidebar-navigation");
  });

  it("each sidebar link navigates correctly", () => {
    const routes = [
      { name: "Products", path: "/dashboard/products" },
      { name: "Categories", path: "/dashboard/categories" },
      { name: "Brands", path: "/dashboard/brands" },
      { name: "Orders", path: "/dashboard/orders" },
      { name: "Customers", path: "/dashboard/customers" },
    ];
    routes.forEach((route) => {
      cy.get("aside, nav").contains(route.name).click();
      cy.url().should("include", route.path);
      cy.takeVisualSnapshot(`admin-nav-${route.name.toLowerCase()}`);
    });
  });
});
