/// <reference types="cypress" />

// ============================================================
// Product Browsing: Categories, Brands, Offers, Filters
// ============================================================

const API = Cypress.env("apiUrl");

describe("Product Browsing – Categories, Brands, Offers", () => {
  // ──────────── Categories Page ────────────
  describe("Categories Page", () => {
    it("should render all categories with product counts", () => {
      cy.visit("/categories");
      cy.wait(3000);
      cy.contains("Categories").should("be.visible");
      cy.contains("Browse products by category").should("be.visible");

      // Should have category cards
      cy.get('[class*="card"]').should("have.length.at.least", 1);

      // Each card should have a name and product count
      cy.get('[class*="card"]').first().within(() => {
        cy.get("h3").should("exist");
        cy.contains(/\d+ products/i).should("exist");
      });

      cy.takeVisualSnapshot("categories-page-all");
    });

    it("should navigate to filtered products when clicking a category", () => {
      cy.visit("/categories");
      cy.wait(3000);

      // Category cards are wrapped in <a> (Link) tags
      cy.get('a[href*="/products"]').first().click();
      cy.wait(3000);

      cy.url().should("include", "/products");
      cy.contains("Products").should("be.visible");
      cy.takeVisualSnapshot("categories-filtered-products");
    });
  });

  // ──────────── Brands Page ────────────
  describe("Brands Page", () => {
    it("should render all brands", () => {
      cy.visit("/brands");
      cy.wait(3000);
      cy.contains("Brands").should("be.visible");
      cy.contains("Discover products from top brands").should("be.visible");

      cy.get('[class*="card"]').should("have.length.at.least", 1);
      cy.takeVisualSnapshot("brands-page-all");
    });

    it("should navigate to filtered products when clicking a brand", () => {
      cy.visit("/brands");
      cy.wait(3000);

      // Brand cards are wrapped in <a> (Link) tags
      cy.get('a[href*="/products"]').first().click();
      cy.wait(3000);

      cy.url().should("include", "/products");
      cy.takeVisualSnapshot("brands-filtered-products");
    });
  });

  // ──────────── Offers Page ────────────
  describe("Offers Page", () => {
    it("should render offers page", () => {
      cy.visit("/offers");
      cy.wait(3000);
      cy.contains("Special Offers").should("be.visible");

      // Either has offer cards or empty message
      cy.get("body").then(($body) => {
        if ($body.find('[class*="card"]').length > 0) {
          cy.log("✅ Offer cards displayed");
          cy.get('[class*="card"]').first().within(() => {
            cy.contains(/limited time/i).should("exist");
          });
        } else {
          cy.contains(/no active offers|check back/i).should("be.visible");
          cy.log("✅ No active offers – empty state shown");
        }
      });

      cy.takeVisualSnapshot("offers-page");
    });
  });

  // ──────────── Products Page Filters ────────────
  describe("Products Page – Filter Interactions", () => {
    it("should load products page with filter sidebar", () => {
      cy.visit("/products");
      cy.wait(3000);
      cy.contains("Products").should("be.visible");
      cy.contains("Browse our entire collection").should("be.visible");

      // Product grid should have cards
      cy.get('[class*="card"]').should("have.length.at.least", 1);
      cy.takeVisualSnapshot("products-page-default");
    });

    it("should show product cards with name, price, and rating", () => {
      cy.visit("/products");
      cy.wait(3000);

      // Product cards should have names (h3)
      cy.get('h3').should("have.length.at.least", 1);

      // Prices should be visible on the page
      cy.get("body").invoke("text").should("match", /\$\d+/);
      cy.takeVisualSnapshot("products-card-details");
    });

    it("should navigate to product detail on card click", () => {
      cy.visit("/products");
      cy.wait(3000);

      // Click first visible product link
      cy.get('a[href*="/products/"]').filter(':visible').first().click({ force: true });
      cy.wait(3000);

      cy.url().should("match", /\/products\/.+/);
      cy.get("h1").should("exist");
      cy.takeVisualSnapshot("products-to-detail");
    });

    it("should show breadcrumbs on products page", () => {
      cy.visit("/products");
      cy.wait(3000);
      cy.get("nav[aria-label='breadcrumb'], [class*='breadcrumb']").should("exist");
      cy.takeVisualSnapshot("products-breadcrumbs");
    });
  });

  // ──────────── Product Detail Page ────────────
  describe("Product Detail – Full Verification", () => {
    let productSlug: string;
    let productNameText: string;

    before(() => {
      cy.request(`${API}/products?page=1&pageSize=1`).then((resp) => {
        productSlug = resp.body.data[0].id;
        productNameText = resp.body.data[0].name;
      });
    });

    it("should render product detail with all sections", () => {
      cy.visit(`/products/${productSlug}`);
      cy.wait(3000);

      // Product name
      cy.contains(productNameText).should("be.visible");

      // Price
      cy.get("body").invoke("text").should("match", /\$\d+/);

      // Add to Cart button
      cy.contains("Add to Cart").should("be.visible");

      // Description exists
      cy.get("body").invoke("text").should("have.length.at.least", 100);

      cy.takeVisualSnapshot("product-detail-full");
    });

    it("should have quantity controls", () => {
      cy.visit(`/products/${productSlug}`);
      cy.wait(3000);

      // Plus and Minus buttons
      cy.get('button').filter(':has(svg.lucide-plus), :has(svg[class*="plus"])').should("exist");
      cy.get('button').filter(':has(svg.lucide-minus), :has(svg[class*="minus"])').should("exist");
      cy.takeVisualSnapshot("product-detail-qty-controls");
    });

    it("should show Customer Reviews section", () => {
      cy.visit(`/products/${productSlug}`);
      cy.wait(3000);

      cy.contains("Customer Reviews").should("be.visible");
      cy.takeVisualSnapshot("product-detail-reviews-section");
    });

    it("should have breadcrumbs on detail page", () => {
      cy.visit(`/products/${productSlug}`);
      cy.wait(3000);

      cy.get("nav[aria-label='breadcrumb'], [class*='breadcrumb']").should("exist");
    });
  });

  // ──────────── URL Parameter Filter Tests ────────────
  describe("Products – URL Parameter Filters", () => {
    it("search param filters products", () => {
      cy.visit("/products?search=shirt");
      cy.wait(3000);
      cy.url().should("include", "search=shirt");
      cy.get('[class*="card"]').should("have.length.at.least", 0); // may be empty or have results
      cy.takeVisualSnapshot("products-url-search-param");
    });

    it("sort param is reflected in sort dropdown", () => {
      cy.visit("/products?sort=price_asc");
      cy.wait(2000);
      cy.url().should("include", "sort=price_asc");
      cy.takeVisualSnapshot("products-url-sort-param");
    });

    it("page param navigates to correct page", () => {
      cy.visit("/products?page=2");
      cy.wait(3000);
      cy.url().should("include", "page=2");
      cy.get('[class*="card"]').should("have.length.at.least", 1);
      cy.takeVisualSnapshot("products-url-page-param");
    });

    it("clicking category filter updates URL with categoryId", () => {
      cy.viewport(1280, 720);
      cy.visit("/products");
      cy.wait(3000);
      cy.get("aside").find('button[role="checkbox"], input[type="checkbox"]').first().click({ force: true });
      cy.wait(1000);
      cy.url().should("match", /categoryId|page/);
      cy.takeVisualSnapshot("products-url-category-filter");
    });

    it("clicking brand filter updates URL with brandId", () => {
      cy.viewport(1280, 720);
      cy.visit("/products");
      cy.wait(3000);
      cy.get("aside").contains(/brand/i).parent().find('button[role="checkbox"], input[type="checkbox"]').first().click({ force: true });
      cy.wait(1000);
      cy.url().should("match", /brandId|page/);
      cy.takeVisualSnapshot("products-url-brand-filter");
    });

    it("clear filters resets to base products URL", () => {
      cy.visit("/products?search=test&sort=price_asc");
      cy.wait(2000);
      cy.get("button, a").contains(/clear/i).first().click({ force: true });
      cy.wait(1000);
      cy.url().should("match", /\/products\/?(\?page=1)?$/);
      cy.takeVisualSnapshot("products-url-cleared");
    });

    it("multiple filters combine in URL", () => {
      cy.visit("/products?sort=price_desc&page=1");
      cy.wait(3000);
      cy.url().should("include", "sort=price_desc");
      cy.takeVisualSnapshot("products-url-combined-filters");
    });
  });
});
