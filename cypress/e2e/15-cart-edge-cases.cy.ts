/// <reference types="cypress" />

// ============================================================
// Cart Edge Cases & Interactions
// ============================================================

const API = Cypress.env("apiUrl");

describe("Cart – Edge Cases & Interactions", () => {
  let token: string;
  let product1: { id: string; name: string };
  let product2: { id: string; name: string };

  before(() => {
    cy.request("POST", `${API}/auth/login`, {
      email: Cypress.env("customerEmail"),
      password: Cypress.env("customerPassword"),
    }).then((resp) => {
      token = resp.body.data.accessToken;
    });

    cy.request(`${API}/products?page=1&pageSize=3`).then((resp) => {
      product1 = { id: resp.body.data[0].id, name: resp.body.data[0].name };
      product2 = { id: resp.body.data[1].id, name: resp.body.data[1].name };
    });
  });

  beforeEach(() => {
    cy.login();
    // Clear cart before each test
    cy.request({
      method: "DELETE",
      url: `${API}/cart`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  });

  it("should show empty cart state with Start Shopping CTA", () => {
    cy.visit("/cart");
    cy.wait(3000);
    // Empty cart
    cy.contains(/empty|no items/i).should("be.visible");
    cy.contains(/start shopping|browse products/i).should("be.visible");
    cy.takeVisualSnapshot("cart-empty-state");
  });

  it("should add multiple products and show them all", () => {
    // Add two products via API
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product1.id, quantity: 1 },
    });
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product2.id, quantity: 2 },
    });

    cy.visit("/cart");
    cy.wait(3000);
    cy.contains("Shopping Cart").should("be.visible");
    cy.contains(product1.name).should("be.visible");
    cy.contains(product2.name).should("be.visible");
    cy.takeVisualSnapshot("cart-multiple-products");
  });

  it("should update quantity using plus/minus buttons", () => {
    // Add a product
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product1.id, quantity: 1 },
    });

    cy.visit("/cart");
    cy.wait(3000);

    // Find quantity display showing "1"
    cy.contains(product1.name).should("be.visible");

    // Click plus to increment
    cy.get('button').filter(':has(svg.lucide-plus), :has(svg[class*="plus"])').first().click();
    cy.wait(2000);

    // Quantity should now be 2
    cy.get('[class*="tabular-nums"], .tabular-nums').first().should("contain", "2");
    cy.takeVisualSnapshot("cart-quantity-incremented");
  });

  it("should remove a single item from cart", () => {
    // Add a product
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product1.id, quantity: 1 },
    });

    cy.visit("/cart");
    cy.wait(3000);
    cy.contains(product1.name).should("be.visible");

    // Click remove/trash button
    cy.get('button').filter(':has(svg.lucide-trash-2), :has(svg[class*="trash"])').first().click();
    cy.wait(2000);

    // Should show empty state now
    cy.contains(/empty|no items/i).should("be.visible");
    cy.takeVisualSnapshot("cart-item-removed");
  });

  it("should clear entire cart with Clear Cart button", () => {
    // Add two products
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product1.id, quantity: 1 },
    });
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product2.id, quantity: 1 },
    });

    cy.visit("/cart");
    cy.wait(3000);
    cy.contains("Shopping Cart").should("be.visible");
    cy.contains("Clear Cart").should("be.visible");

    // Click Clear Cart
    cy.contains("Clear Cart").click();
    cy.wait(2000);

    // Should show empty state
    cy.contains(/empty|no items/i).should("be.visible");
    cy.takeVisualSnapshot("cart-cleared");
  });

  it("should show cart summary with subtotal and total", () => {
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product1.id, quantity: 2 },
    });

    cy.visit("/cart");
    cy.wait(3000);

    // Cart summary should show pricing
    cy.contains(/subtotal/i).should("be.visible");
    cy.contains(/total/i).should("be.visible");
    cy.get("body").invoke("text").should("match", /\$\d+\.\d{2}/);

    // Proceed to Checkout button
    cy.contains(/proceed to checkout|checkout/i).should("be.visible");
    cy.takeVisualSnapshot("cart-summary");
  });

  it("should navigate to checkout from cart", () => {
    cy.request({
      method: "POST",
      url: `${API}/cart/items`,
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: product1.id, quantity: 1 },
    });

    cy.visit("/cart");
    cy.wait(3000);

    // Click Proceed to Checkout
    cy.contains(/proceed to checkout|checkout/i).click();
    cy.wait(3000);

    cy.url().should("include", "/checkout");
    cy.takeVisualSnapshot("cart-to-checkout-navigation");
  });
});
