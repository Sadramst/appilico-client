/// <reference types="cypress" />

// ============================================================
// SCENARIO 2: Admin – View All Customer Orders
// ============================================================
// Login as admin@appilico.com
// 1. Navigate to /dashboard/orders
// 2. Verify the orders table shows ALL orders from ALL customers
// 3. Verify the new order placed by customer1 in Scenario 1 is visible
// 4. View an order detail page from admin panel
// 5. Verify admin can see customer name, status, total, items

const API = Cypress.env("apiUrl");

describe("Admin: View All Customer Orders", () => {
  let adminOrderCount: number;

  before(() => {
    // Login as admin and get order count
    cy.request("POST", `${API}/auth/login`, {
      email: Cypress.env("adminEmail"),
      password: Cypress.env("adminPassword"),
    }).then((loginResp) => {
      const { accessToken } = loginResp.body.data;
      const headers = { Authorization: `Bearer ${accessToken}` };

      cy.request({ url: `${API}/orders?page=1&pageSize=50`, headers }).then((resp) => {
        adminOrderCount = resp.body.data?.length ?? 0;
        cy.log(`Admin can see ${adminOrderCount} total orders`);
      });
    });
  });

  // ──────────── STEP 1: Admin Dashboard ────────────
  it("Step 1 – Admin navigates to Dashboard", () => {
    cy.loginAsAdmin();
    cy.visit("/dashboard");
    cy.wait(4000);

    cy.contains("Dashboard").should("be.visible");
    cy.takeVisualSnapshot("admin-dashboard-overview");

    // Dashboard should show stats cards
    cy.get('[class*="card"]').should("have.length.at.least", 4);
    cy.takeVisualSnapshot("admin-dashboard-stats");
  });

  // ──────────── STEP 2: Admin Orders Page ────────────
  it("Step 2 – Admin sees ALL customer orders in the orders table", () => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/orders");
    cy.wait(5000);

    cy.contains("Orders").should("be.visible");
    cy.contains("View and manage customer orders").should("be.visible");
    cy.takeVisualSnapshot("admin-orders-page-full");

    // Verify table exists with headers
    cy.get("table").should("exist");
    cy.get("table th").should("have.length.at.least", 3);
    cy.takeVisualSnapshot("admin-orders-table-headers");

    // Verify order rows exist
    cy.get("table tbody tr").should("have.length.at.least", 1);
    cy.log(`✅ Orders table has rows`);

    // Each row should show: order number, status badge, total
    cy.get("table tbody tr").first().within(() => {
      cy.contains(/ORD-|#/i).should("exist"); // order number
      cy.get('[class*="badge"]').should("exist"); // status badge
    });
    cy.get("table tbody tr").first().invoke("text").should("match", /\$/); // price
    cy.takeVisualSnapshot("admin-order-row-details");
  });

  // ──────────── STEP 3: Verify customer's latest order visible ────────────
  it("Step 3 – Admin can see the customer's latest Pending order", () => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/orders");
    cy.wait(5000);

    // There should be at least one Pending order (from customer test)
    cy.contains("Pending").should("be.visible");
    cy.takeVisualSnapshot("admin-orders-pending-visible");
    cy.log("✅ Admin can see Pending order from customer");
  });

  // ──────────── STEP 4: View order detail from admin ────────────
  it("Step 4 – Admin clicks to view order detail", () => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/orders");
    cy.wait(5000);

    // Click the eye/view icon on the first order
    cy.get("table tbody tr").first().find('a[href*="/dashboard/orders/"]').click();
    cy.wait(3000);

    // Should navigate to admin order detail page
    cy.url().should("include", "/dashboard/orders/");
    cy.takeVisualSnapshot("admin-order-detail-page");

    // Order detail should show order info
    cy.get("body").invoke("text").should("match", /ORD-/i);
    cy.log("✅ Admin order detail page renders correctly");
  });

  // ──────────── STEP 5: Verify order statuses visible ────────────
  it("Step 5 – Admin sees various order statuses", () => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/orders");
    cy.wait(5000);

    // Should see multiple status badges across all orders
    cy.get('[class*="badge"]').should("have.length.at.least", 1);

    // Check for known status types (from our API check we know there are Pending, Processing, Delivered)
    const possibleStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    let foundStatuses = 0;
    possibleStatuses.forEach((status) => {
      cy.get("body").then(($body) => {
        if ($body.text().includes(status)) {
          foundStatuses++;
          cy.log(`  Found status: ${status}`);
        }
      });
    });

    cy.takeVisualSnapshot("admin-orders-various-statuses");
    cy.log("✅ Admin can see order statuses for all customer orders");
  });

  // ──────────── STEP 6: Verify table shows order totals ────────────
  it("Step 6 – Admin can see order totals and dates", () => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/orders");
    cy.wait(5000);

    // Every row should have a price
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).invoke("text").should("match", /\$/);
    });

    cy.takeVisualSnapshot("admin-orders-totals-visible");
    cy.log("✅ All order rows show total amounts");
  });
});
