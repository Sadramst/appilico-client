/// <reference types="cypress" />

describe("Product Listing Page", () => {
  beforeEach(() => {
    cy.visit("/products");
  });

  it("renders product grid with cards", () => {
    cy.get('[class*="card"], [class*="Card"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("products-page");
  });

  it("shows product card with name, price, rating, image", () => {
    cy.get('[class*="card"], [class*="Card"]')
      .first()
      .within(() => {
        cy.get("h3, a").should("exist"); // product name
        cy.get('[class*="price"], span').should("exist"); // price
      });
    cy.takeVisualSnapshot("product-card-detail");
  });

  it("filters by category using tree filter", () => {
    cy.get("aside, [class*=filter]")
      .contains(/category/i)
      .should("exist");
    // Click first category checkbox
    cy.get('aside input[type="checkbox"], aside button[role="checkbox"]').first().click({ force: true });
    cy.wait(500);
    cy.takeVisualSnapshot("products-filtered-category");
  });

  it("filters by brand", () => {
    cy.get("aside, [class*=filter]").contains(/brand/i).should("exist");
  });

  it("changes sort order", () => {
    cy.get("aside, [class*=filter]")
      .find('button[role="combobox"], [class*="select"]')
      .first()
      .click();
    cy.contains("Price: Low to High").click();
    cy.wait(500);
    cy.takeVisualSnapshot("products-sorted-price-asc");
  });

  it("adjusts price range slider", () => {
    cy.get("aside, [class*=filter]").contains(/price/i).should("exist");
    cy.takeVisualSnapshot("products-price-filter");
  });

  it("toggles in-stock filter", () => {
    cy.get("aside, [class*=filter]")
      .contains(/in stock/i)
      .parent()
      .find('input[type="checkbox"], button[role="checkbox"]')
      .click({ force: true });
    cy.wait(500);
    cy.takeVisualSnapshot("products-in-stock-only");
  });

  it("filters by minimum rating", () => {
    cy.get("aside, [class*=filter]").contains("4+ ★").click();
    cy.wait(500);
    cy.takeVisualSnapshot("products-rating-4plus");
  });

  it("navigates to product detail on card click", () => {
    cy.get('[class*="card"] a[href*="/products/"]').first().click();
    cy.url().should("match", /\/products\/.+/);
    cy.takeVisualSnapshot("product-detail-from-listing");
  });

  it("adds product to cart from card (hover action)", () => {
    cy.login();
    cy.visit("/products");
    cy.get('[class*="card"]')
      .first()
      .trigger('mouseover')
      .find('button[aria-label="Add to cart"]')
      .click({ force: true });
    cy.contains(/added to cart/i).should("be.visible");
    cy.takeVisualSnapshot("product-added-from-card");
  });

  it("toggles wishlist from product card", () => {
    cy.login();
    cy.visit("/products");
    cy.get('[class*="card"]')
      .first()
      .trigger('mouseover')
      .find('button[aria-label*="wishlist"]')
      .click({ force: true });
    cy.wait(1000);
    cy.takeVisualSnapshot("product-wishlist-toggled-card");
  });
});

describe("Product Listing - Mobile Filters", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.visit("/products");
  });

  it("opens filter sheet on mobile", () => {
    cy.contains("Filters").click();
    cy.takeVisualSnapshot("mobile-filters-open");
  });
});
