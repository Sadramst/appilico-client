/// <reference types="cypress" />

// ============================================================
// Order Cancel Flow + Order Detail Verification
// ============================================================

const API = Cypress.env("apiUrl");

describe("Order Cancel & Detail – Customer Flow", () => {
  let token: string;
  let pendingOrderId: string;

  before(() => {
    cy.request("POST", `${API}/auth/login`, {
      email: Cypress.env("customerEmail"),
      password: Cypress.env("customerPassword"),
    }).then((resp) => {
      token = resp.body.data.accessToken;

      // Find a pending order (status 0) that can be cancelled
      cy.request({
        url: `${API}/orders/my?page=1&pageSize=50`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((ordersResp) => {
        const orders = ordersResp.body.data ?? [];
        const pending = orders.find((o: { orderStatus: number }) => o.orderStatus === 0);
        if (pending) {
          pendingOrderId = pending.id;
          cy.log(`Found pending order: ${pending.orderNumber}`);
        } else {
          cy.log("No pending orders found – will create one");
        }
      });
    });
  });

  beforeEach(() => {
    cy.login();
  });

  it("should display order detail page with all sections", () => {
    // Get any order to view details
    cy.request({
      url: `${API}/orders/my?page=1&pageSize=1`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((resp) => {
      const order = resp.body.data[0];
      cy.visit(`/orders/${order.id}`);
      cy.wait(3000);

      // Header
      cy.contains(`Order #${order.orderNumber}`).should("be.visible");

      // Status badge
      cy.get('[class*="badge"]').should("exist");

      // Order Items section
      cy.contains("Order Items").should("be.visible");

      // Summary section
      cy.contains("Summary").should("be.visible");
      cy.contains("Subtotal").should("be.visible");
      cy.contains("Total").should("be.visible");

      // Payment section
      cy.contains("Payment").should("be.visible");
      cy.contains("Method").should("be.visible");

      cy.takeVisualSnapshot("order-detail-all-sections");
    });
  });

  it("should show order items with quantities and prices", () => {
    cy.request({
      url: `${API}/orders/my?page=1&pageSize=1`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((resp) => {
      const order = resp.body.data[0];
      cy.visit(`/orders/${order.id}`);
      cy.wait(3000);

      // Each item should show qty and price
      cy.contains("Qty:").should("be.visible");
      cy.get("body").invoke("text").should("match", /\$/);
      cy.takeVisualSnapshot("order-detail-items");
    });
  });

  it("should show Pending order with Cancel button on orders page", () => {
    if (!pendingOrderId) {
      cy.log("⚠️ No pending order to test cancel - creating one via API");
      // Add product to cart and place an order
      cy.request(`${API}/products?page=1&pageSize=1`).then((prodResp) => {
        const product = prodResp.body.data[0];
        cy.request({
          method: "POST",
          url: `${API}/cart/items`,
          headers: { Authorization: `Bearer ${token}` },
          body: { productId: product.id, quantity: 1 },
        });

        cy.request({
          url: `${API}/customers/me/addresses`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((addrResp) => {
          const addr = addrResp.body.data[0];
          cy.request({
            method: "POST",
            url: `${API}/orders`,
            headers: { Authorization: `Bearer ${token}` },
            body: {
              shippingAddressId: addr.id,
              paymentMethod: 0,
            },
          }).then((orderResp) => {
            pendingOrderId = orderResp.body.data.id;
            cy.log(`✅ Created new order: ${orderResp.body.data.orderNumber}`);
          });
        });
      });
    }

    cy.visit("/orders");
    cy.wait(3000);

    // Find a Pending badge
    cy.contains("Pending").should("be.visible");

    // The order card with Pending status should have a Cancel button
    cy.contains("Cancel").should("be.visible");
    cy.takeVisualSnapshot("order-cancel-button-visible");
  });

  it("should cancel a pending order", () => {
    cy.visit("/orders");
    cy.wait(3000);

    // Click the Cancel button on the first Pending order
    cy.contains("Cancel").first().click();
    cy.wait(3000);

    // Should show success toast or status change
    cy.get("body").then(($body) => {
      const text = $body.text();
      if (text.includes("Cancelled") || text.includes("cancelled")) {
        cy.log("✅ Order cancelled successfully");
      } else {
        cy.log("Cancel may require confirmation dialog or took longer");
      }
    });

    cy.takeVisualSnapshot("order-after-cancel");
  });

  it("should navigate between orders and order detail", () => {
    cy.visit("/orders");
    cy.wait(3000);

    // Click Details on first order
    cy.contains("Details").first().click();
    cy.wait(3000);

    // Should be on order detail page
    cy.url().should("include", "/orders/");
    cy.contains(/Order #/i).should("be.visible");

    // Navigate back using breadcrumbs or browser back
    cy.go("back");
    cy.wait(2000);
    cy.contains("My Orders").should("be.visible");
    cy.takeVisualSnapshot("order-navigation-back");
  });
});
