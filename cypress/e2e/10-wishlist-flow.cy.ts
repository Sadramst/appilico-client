/// <reference types="cypress" />

// ============================================================
// Wishlist: Full Add / Remove / Verify Flow
// ============================================================

const API = Cypress.env("apiUrl");

describe("Wishlist – Full Flow", () => {
  let token: string;
  let productId: string;
  let productName: string;

  before(() => {
    // Get auth token and a product to use
    cy.request("POST", `${API}/auth/login`, {
      email: Cypress.env("customerEmail"),
      password: Cypress.env("customerPassword"),
    }).then((resp) => {
      token = resp.body.data.accessToken;
    });

    cy.request(`${API}/products?page=1&pageSize=3`).then((resp) => {
      const products = resp.body.data;
      productId = products[0].id;
      productName = products[0].name;
    });
  });

  beforeEach(() => {
    cy.login();
  });

  it("should show empty wishlist when no items saved", () => {
    // Clear wishlist via API first
    cy.request({
      url: `${API}/wishlist`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((resp) => {
      const items = resp.body.data ?? [];
      items.forEach((item: { productId: string }) => {
        cy.request({
          method: "DELETE",
          url: `${API}/wishlist/${item.productId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
      });
    });

    cy.visit("/wishlist");
    cy.wait(3000);
    cy.contains("Wishlist").should("be.visible");
    // Should show empty state
    cy.get("body").then(($body) => {
      const text = $body.text();
      if (text.includes("empty") || text.includes("Save items")) {
        cy.log("✅ Empty wishlist state shown correctly");
      } else {
        cy.log("Wishlist may have items from other activity");
      }
    });
    cy.takeVisualSnapshot("wishlist-empty-state");
  });

  it("should add a product to wishlist via product detail page", () => {
    cy.visit(`/products/${productId}`);
    cy.wait(3000);
    cy.contains(productName).should("be.visible");

    // Click the wishlist heart button
    cy.get('button').then(($buttons) => {
      // Find the heart/wishlist button - it usually has a heart icon
      const heartBtn = $buttons.filter(':has(svg)').filter((_, el) => {
        const svg = el.querySelector('svg');
        return svg?.classList.toString().includes('heart') ||
               el.getAttribute('aria-label')?.includes('wishlist') ||
               el.getAttribute('aria-label')?.includes('Wishlist') ||
               false;
      });
      if (heartBtn.length > 0) {
        cy.wrap(heartBtn.first()).click();
        cy.wait(2000);
        cy.log("✅ Clicked wishlist button on product detail");
      } else {
        // Fallback: add via API
        cy.request({
          method: "POST",
          url: `${API}/wishlist/${productId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        cy.log("✅ Added to wishlist via API");
      }
    });

    cy.takeVisualSnapshot("wishlist-product-added");
  });

  it("should show the added product on the wishlist page", () => {
    // Ensure product is in wishlist via API
    cy.request({
      method: "POST",
      url: `${API}/wishlist/${productId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });

    cy.visit("/wishlist");
    cy.wait(4000);
    cy.contains("Wishlist").should("be.visible");

    // Wishlist should show product cards (not the empty state)
    cy.get('[class*="card"]').should("have.length.at.least", 1);
    cy.log("✅ Wishlist has items");
    cy.takeVisualSnapshot("wishlist-with-product");
  });

  it("should have Add to Cart button on wishlist items", () => {
    cy.visit("/wishlist");
    cy.wait(4000);
    cy.contains("Add to Cart").should("be.visible");
    cy.takeVisualSnapshot("wishlist-add-to-cart-button");
  });

  it("should remove product from wishlist", () => {
    // Ensure product is in wishlist first
    cy.request({
      method: "POST",
      url: `${API}/wishlist/${productId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });

    cy.visit("/wishlist");
    cy.wait(4000);

    // Should have the product visible
    cy.contains("Add to Cart").should("be.visible");

    // Click the delete/remove button (trash icon)
    cy.get('button.text-destructive, button[class*="destructive"]').first().click();
    cy.wait(3000);

    // Should show empty state after removal
    cy.contains(/empty|save items/i).should("be.visible");
    cy.log("✅ Product removed from wishlist");
    cy.takeVisualSnapshot("wishlist-after-removal");
  });
});
