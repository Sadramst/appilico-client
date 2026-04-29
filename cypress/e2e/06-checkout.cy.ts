/// <reference types="cypress" />

describe("Checkout Flow", () => {
  beforeEach(() => {
    cy.login();
    // Ensure cart has an item
    cy.window().then((win) => {
      const token = win.localStorage.getItem("appilico_access_token");
      cy.request(`${Cypress.env("apiUrl")}/products?page=1&pageSize=1`).then((resp) => {
        const product = resp.body.data[0];
        if (product) {
          cy.request({
            method: "POST",
            url: `${Cypress.env("apiUrl")}/cart/items`,
            headers: { Authorization: `Bearer ${token}` },
            body: { productId: product.id, quantity: 1 },
            failOnStatusCode: false,
          });
        }
      });
    });
    cy.visit("/checkout");
  });

  it("renders checkout page with stepper", () => {
    cy.takeVisualSnapshot("checkout-step1-shipping");
    cy.contains(/shipping/i).should("be.visible");
    cy.contains(/payment/i).should("exist");
    cy.contains(/review/i).should("exist");
  });

  it("Step 1: shows saved addresses to select", () => {
    cy.get('input[type="radio"], button[role="radio"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("checkout-addresses-list");
  });

  it("Step 1: opens Add New Address dialog", () => {
    cy.contains(/add new/i).click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"]').within(() => {
      cy.contains(/add new address/i).should("be.visible");
      cy.get("input").should("have.length.at.least", 4);
    });
    cy.takeVisualSnapshot("checkout-add-address-dialog");
  });

  it("Step 1: adds a new address during checkout", () => {
    cy.contains(/add new/i).click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[id="addr-title"]').type("Checkout Address");
      cy.get('input[id="addr-line1"]').type("456 Test Street");
      cy.get('input[id="addr-city"]').type("Sydney");
      cy.get('input[id="addr-state"]').type("NSW");
      cy.get('input[id="addr-postal"]').type("2000");
      cy.get('input[id="addr-country"]').type("Australia");
      cy.get('button[type="submit"]').click();
    });
    cy.wait(2000);
    cy.takeVisualSnapshot("checkout-address-added");
  });

  it("Step 1 → Step 2: navigates to payment", () => {
    cy.contains("Continue").click();
    cy.takeVisualSnapshot("checkout-step2-payment");
    cy.contains(/payment method/i).should("be.visible");
  });

  it("Step 2: selects payment method", () => {
    cy.contains("Continue").click();
    // Select PayPal
    cy.contains("PayPal").click();
    cy.takeVisualSnapshot("checkout-payment-paypal");
  });

  it("Step 2: applies voucher code", () => {
    cy.contains("Continue").click();
    cy.get('input[id="voucher"], input[placeholder*="code"]').type("TESTCODE");
    cy.contains("Apply").click();
    cy.wait(2000);
    cy.takeVisualSnapshot("checkout-voucher-applied");
  });

  it("Step 2 → Step 3: navigates to review", () => {
    cy.contains("Continue").click(); // step 1 → 2
    cy.contains("Continue").click(); // step 2 → 3
    cy.takeVisualSnapshot("checkout-step3-review");
    cy.contains(/order review/i).should("be.visible");
  });

  it("Step 3: shows order summary with address and payment", () => {
    cy.contains("Continue").click();
    cy.contains("Continue").click();
    cy.contains(/shipping to/i).should("be.visible");
    cy.contains(/payment/i).should("be.visible");
    cy.contains(/items/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-review-full");
  });

  it("Step 3: goes back to previous steps", () => {
    cy.contains("Continue").click();
    cy.contains("Continue").click();
    cy.contains("Back").click();
    cy.contains(/payment method/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-back-to-step2");
    cy.contains("Back").click();
    cy.contains(/shipping address/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-back-to-step1");
  });

  it("shows cart summary sidebar", () => {
    cy.contains(/order summary/i).should("be.visible");
    cy.contains(/subtotal/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-sidebar-summary");
  });
});
