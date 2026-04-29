/// <reference types="cypress" />

describe("Product Detail Page", () => {
  let productUrl: string;

  before(() => {
    // Get a product from the API to test
    cy.request(`${Cypress.env("apiUrl")}/products?page=1&pageSize=1`).then(
      (resp) => {
        const products = resp.body.data;
        if (products.length > 0) {
          productUrl = `/products/${products[0].id}`;
        }
      }
    );
  });

  beforeEach(() => {
    cy.visit(productUrl ?? "/products");
    if (!productUrl) {
      cy.get('a[href*="/products/"]').first().click();
    }
  });

  it("renders product detail with all sections", () => {
    cy.takeVisualSnapshot("product-detail-full");
    // Product name
    cy.get("h1").should("exist");
    // Price
    cy.get('[class*="price"], [class*="Price"]').should("exist");
    // Add to cart
    cy.contains(/add to cart|sold out/i).should("exist");
    // Rating
    cy.get('[class*="star"], [class*="rating"]').should("exist");
  });

  it("shows product images/gallery", () => {
    cy.get('img[alt], [class*="image"], [class*="gallery"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("product-detail-gallery");
  });

  it("selects product variant if available", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Variant"), [class*="variant"]').length) {
        cy.contains(/variant/i)
          .parent()
          .find("button")
          .eq(1)
          .click();
        cy.takeVisualSnapshot("product-variant-selected");
      }
    });
  });

  it("increments and decrements quantity", () => {
    // Increment
    cy.get('button[aria-label*="increase"], button')
      .filter(":has(svg)")
      .contains("+")
      .should("not.exist"); // Use the plus icon button instead
    
    // Find quantity controls by the pattern: minus, number, plus
    cy.get('[class*="quantity"], [class*="border"]')
      .filter(":has(span)")
      .first()
      .within(() => {
        cy.get("button").last().click(); // plus
        cy.get("span").should("contain", "2");
        cy.takeVisualSnapshot("product-quantity-2");
        cy.get("button").first().click(); // minus
        cy.get("span").should("contain", "1");
      });
  });

  it("adds product to cart", () => {
    cy.contains(/add to cart/i).click();
    cy.contains(/added to cart/i).should("be.visible");
    cy.takeVisualSnapshot("product-added-to-cart");
  });

  it("toggles wishlist (requires auth)", () => {
    cy.login();
    cy.visit(productUrl ?? "/products");
    if (!productUrl) {
      cy.get('a[href*="/products/"]').first().click();
    }
    cy.get('button[aria-label*="wishlist"]').first().click();
    cy.wait(1000);
    cy.takeVisualSnapshot("product-wishlist-toggled");
  });

  it("shares product via clipboard", () => {
    cy.get('button[aria-label="Share"]').click();
    cy.contains(/copied|clipboard/i).should("be.visible");
  });

  it("shows description and shipping tabs", () => {
    cy.contains("Description").click();
    cy.takeVisualSnapshot("product-tab-description");
    cy.contains("Shipping").click();
    cy.takeVisualSnapshot("product-tab-shipping");
  });

  it("shows stock status badge", () => {
    cy.get('[class*="badge"], [class*="Badge"]')
      .filter(':contains("In Stock"), :contains("Out of Stock"), :contains("left")')
      .should("have.length.at.least", 1);
  });

  it("displays trust signals (Free Shipping, Returns, Warranty)", () => {
    cy.contains("Free Shipping").should("be.visible");
    cy.contains("30-Day Returns").should("be.visible");
    cy.contains("2-Year Warranty").should("be.visible");
  });
});
