/// <reference types="cypress" />

// ============================================================
// SCENARIO 1: Customer – See Order History + Place New Order
// ============================================================
// Login as customer1@appilico.com
// 1. View existing order history on /orders
// 2. Add a product to cart
// 3. Go through checkout (select address → pick payment → review → place order)
// 4. Verify redirected to new order detail page
// 5. Go back to /orders and verify the new order appears in history

const API = Cypress.env("apiUrl");

describe("Customer: Order History & Place New Order", () => {
  let initialOrderCount: number;
  let productId: string;
  let productName: string;

  before(() => {
    // Login and fetch initial data
    cy.request("POST", `${API}/auth/login`, {
      email: Cypress.env("customerEmail"),
      password: Cypress.env("customerPassword"),
    }).then((loginResp) => {
      const { accessToken } = loginResp.body.data;
      const headers = { Authorization: `Bearer ${accessToken}` };

      // Get current order count
      cy.request({ url: `${API}/orders/my?page=1&pageSize=50`, headers }).then((ordersResp) => {
        initialOrderCount = ordersResp.body.data?.length ?? 0;
        cy.log(`Initial order count: ${initialOrderCount}`);
      });

      // Get a product to add to cart
      cy.request({ url: `${API}/products?page=1&pageSize=1`, headers }).then((prodResp) => {
        const product = prodResp.body.data[0];
        productId = product.id;
        productName = product.name;
        cy.log(`Will order product: ${productName} (${productId})`);
      });

      // Clear cart so we start fresh
      cy.request({ method: "DELETE", url: `${API}/cart`, headers, failOnStatusCode: false });
    });
  });

  // ──────────── STEP 1: View existing order history ────────────
  it("Step 1 – Login and see existing order history", () => {
    cy.login();
    cy.visit("/orders");
    cy.wait(4000);

    cy.contains("My Orders").should("be.visible");
    cy.takeVisualSnapshot("customer-orders-history");

    if (initialOrderCount > 0) {
      // Should see order cards with order numbers
      cy.contains(/ORD-/i).should("be.visible");
      cy.log(`✅ Found ${initialOrderCount} existing orders`);

      // Each order card should have: order number, status badge, total, Details button
      cy.get('[class*="card"]')
        .filter(':has(:contains("ORD-"))')
        .first()
        .within(() => {
          cy.get('[class*="badge"]').should("exist"); // status badge
          cy.contains("Details").should("exist"); // details link
        });
      cy.takeVisualSnapshot("customer-order-card-details");
    } else {
      cy.contains(/no orders/i).should("be.visible");
      cy.log("No existing orders - empty state shown");
    }
  });

  // ──────────── STEP 2: Add product to cart ────────────
  it("Step 2 – Add a product to cart", () => {
    cy.login();

    // Add product via API for reliability
    cy.window().then(() => {
      const token = window.localStorage.getItem("appilico_access_token");
      cy.request({
        method: "POST",
        url: `${API}/cart/items`,
        headers: { Authorization: `Bearer ${token}` },
        body: { productId, quantity: 1 },
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        cy.log("✅ Product added to cart via API");
      });
    });

    // Visit cart page and verify product is there
    cy.visit("/cart");
    cy.wait(4000);
    cy.contains("Shopping Cart").should("be.visible");
    cy.get("body").invoke("text").should("match", /\$/); // has price
    cy.takeVisualSnapshot("customer-cart-with-item");
  });

  // ──────────── STEP 3: Checkout flow ────────────
  it("Step 3 – Complete full checkout (address → payment → review → place order)", () => {
    cy.login();
    cy.visit("/checkout");
    cy.wait(4000);

    // === STEP 1: Shipping Address ===
    cy.log("--- Checkout Step 1: Shipping Address ---");
    cy.contains("Shipping Address").should("be.visible");

    // Address should be auto-selected (customer has at least 1 address)
    cy.get('input[type="radio"], button[role="radio"]')
      .should("have.length.at.least", 1);

    // Verify default address "Home" is shown
    cy.contains("Home").should("be.visible");
    cy.takeVisualSnapshot("checkout-step1-address-selected");

    // Click Continue to go to Step 2
    cy.contains("button", "Continue").click();
    cy.wait(1000);

    // === STEP 2: Payment Method ===
    cy.log("--- Checkout Step 2: Payment Method ---");
    cy.contains("Payment Method").should("be.visible");

    // Select "Credit / Debit Card" (value="0", first option)
    cy.contains("Credit / Debit Card").should("be.visible");
    cy.contains("Credit / Debit Card").click();
    cy.takeVisualSnapshot("checkout-step2-payment-selected");

    // Click Continue to go to Step 3
    cy.contains("button", "Continue").click();
    cy.wait(1000);

    // === STEP 3: Order Review ===
    cy.log("--- Checkout Step 3: Order Review ---");
    cy.contains("Order Review").should("be.visible");

    // Verify review shows address
    cy.contains("Shipping To").should("be.visible");
    cy.contains("Home").should("be.visible");

    // Verify review shows payment method
    cy.contains("Payment").should("be.visible");
    cy.contains("CreditCard").should("be.visible");

    // Verify review shows items
    cy.get("body").invoke("text").should("match", /\$/); // has amounts
    cy.takeVisualSnapshot("checkout-step3-review");

    // === Place Order ===
    cy.log("--- Placing Order ---");
    cy.contains("button", "Place Order").should("be.visible").and("not.be.disabled");
    cy.contains("button", "Place Order").click();

    // Wait for order to be placed (API call + redirect)
    cy.wait(8000);

    // Should redirect to order detail page /orders/{id}
    cy.url().should("match", /\/orders\/.+/);
    cy.takeVisualSnapshot("checkout-order-placed-redirect");
    cy.log("✅ Order placed and redirected to order detail page!");
  });

  // ──────────── STEP 4: Verify new order in history ────────────
  it("Step 4 – New order appears in order history", () => {
    cy.login();
    cy.visit("/orders");
    cy.wait(5000);

    cy.contains("My Orders").should("be.visible");

    // Should now have more orders than before
    cy.get('[class*="card"]')
      .filter(':has(:contains("ORD-"))')
      .should("have.length.at.least", initialOrderCount + 1);

    cy.log(`✅ Order history now has more orders than initial count of ${initialOrderCount}`);
    cy.takeVisualSnapshot("customer-orders-after-new-order");

    // The newest order should be Pending (status 0)
    cy.contains("Pending").should("be.visible");

    // Newest order should have a Cancel button (since it's Pending)
    cy.get('[class*="card"]')
      .filter(':has(:contains("Pending"))')
      .first()
      .within(() => {
        cy.contains("Cancel").should("be.visible");
        cy.contains("Details").should("be.visible");
      });
    cy.takeVisualSnapshot("customer-new-order-pending-with-cancel");
  });

  // ──────────── STEP 5: View new order detail ────────────
  it("Step 5 – View new order detail page", () => {
    cy.login();
    cy.visit("/orders");
    cy.wait(5000);

    // Click Details on the newest (Pending) order
    cy.get('[class*="card"]')
      .filter(':has(:contains("Pending"))')
      .first()
      .contains("Details")
      .click();

    cy.wait(3000);
    cy.url().should("match", /\/orders\/.+/);

    // Order detail should show order info
    cy.get("body").invoke("text").should("match", /ORD-/i);
    cy.get("body").invoke("text").should("match", /\$/);
    cy.takeVisualSnapshot("customer-order-detail-page");
    cy.log("✅ Order detail page renders with order info");
  });
});
