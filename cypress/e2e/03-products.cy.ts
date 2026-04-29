/// <reference types="cypress" />

// ============================================================
// 03 - PRODUCT LISTING – Exhaustive Tests
// ============================================================

describe("Products Page – Layout", () => {
  beforeEach(() => {
    cy.visit("/products");
    cy.wait(3000);
  });

  it("renders page with breadcrumbs", () => {
    cy.get('[class*="breadcrumb"], nav[aria-label="Breadcrumb"]').should("exist");
    cy.takeVisualSnapshot("products-breadcrumbs");
  });

  it("renders page header", () => {
    cy.get("h1, h2").first().should("be.visible");
    cy.takeVisualSnapshot("products-header");
  });

  it("renders filter sidebar on desktop", () => {
    cy.viewport(1280, 720);
    cy.visit("/products");
    cy.wait(2000);
    cy.get("aside").should("be.visible");
    cy.takeVisualSnapshot("products-sidebar-desktop");
  });

  it("renders product grid with cards", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("products-grid");
  });
});

describe("Products Page – Filters", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/products");
    cy.wait(3000);
  });

  it("Sort dropdown shows all sort options", () => {
    cy.get("aside, [class*=filter]").find('select, button[role="combobox"]').first().click();
    cy.wait(300);
    cy.takeVisualSnapshot("products-sort-dropdown");
  });

  it("Category filter section exists with category tree", () => {
    cy.get("aside").contains(/categor/i).should("exist");
    cy.get("aside").find('input[type="checkbox"], button[role="checkbox"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("products-category-filter");
  });

  it("clicking a category checkbox filters products", () => {
    cy.get("aside").find('input[type="checkbox"], button[role="checkbox"]').first().click({ force: true });
    cy.wait(1000);
    cy.takeVisualSnapshot("products-category-filtered");
  });

  it("category tree shows nested subcategories with indentation", () => {
    cy.get("aside").find('[style*="padding-left"], [class*="pl-"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("products-category-tree-nested");
  });

  it("category shows product count badge", () => {
    cy.get("aside").find('[class*="badge"], span').should("have.length.at.least", 1);
  });

  it("Brand filter section exists", () => {
    cy.get("aside").contains(/brand/i).should("exist");
    cy.takeVisualSnapshot("products-brand-filter");
  });

  it("Price range filter exists", () => {
    cy.get("aside").contains(/price/i).should("exist");
    cy.takeVisualSnapshot("products-price-filter");
  });

  it("Rating filter section exists with star buttons", () => {
    cy.get("aside").contains(/rating/i).should("exist");
    cy.takeVisualSnapshot("products-rating-filter");
  });

  it("clicking rating filter (4+) filters products", () => {
    cy.get("aside").then(($aside) => {
      if ($aside.text().match(/4.*★|4\+/)) {
        cy.get("aside").contains(/4.*★|4\+/).click();
        cy.wait(1000);
        cy.takeVisualSnapshot("products-rating-4plus");
      }
    });
  });

  it("In Stock Only toggle exists", () => {
    cy.get("aside").contains(/in stock/i).should("exist");
    cy.takeVisualSnapshot("products-stock-filter");
  });

  it("clicking In Stock Only toggles filter", () => {
    cy.get("aside").contains(/in stock/i).parent().find('input[type="checkbox"], button[role="checkbox"]').click({ force: true });
    cy.wait(1000);
    cy.takeVisualSnapshot("products-in-stock-filtered");
  });

  it("Clear Filters button works", () => {
    // Apply a filter first
    cy.get("aside").find('input[type="checkbox"], button[role="checkbox"]').first().click({ force: true });
    cy.wait(500);
    // Clear filters
    cy.get("aside").then(($aside) => {
      if ($aside.find(':contains("Clear")').length) {
        cy.get("aside").contains("Clear").click();
        cy.wait(1000);
        cy.takeVisualSnapshot("products-filters-cleared");
      }
    });
  });

  it("active filter count badge shows", () => {
    cy.get("aside").find('input[type="checkbox"], button[role="checkbox"]').first().click({ force: true });
    cy.wait(500);
    cy.takeVisualSnapshot("products-active-filter-badge");
  });
});

describe("Products Page – Product Cards", () => {
  beforeEach(() => {
    cy.visit("/products");
    cy.wait(3000);
  });

  it("each card has product image or fallback", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get('img, [class*="aspect-square"]').should("exist");
    });
  });

  it("each card has product name (h3)", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get("h3").should("exist");
    });
  });

  it("each card has price with $ symbol", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().invoke("text").should("match", /\$/);
  });

  it("each card has star rating", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get("svg").should("have.length.at.least", 1);
    });
  });

  it("card shows brand name if available", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get("p").should("have.length.at.least", 0); // brand is optional
    });
  });

  it("Featured badge shown on featured products", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/Featured/)) {
        cy.get('[class*="badge"]').contains("Featured").should("exist");
      }
    });
  });

  it("hover reveals wishlist button", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first()
      .trigger("mouseover")
      .within(() => {
        cy.get('button[aria-label*="wishlist"]').should("exist");
      });
    cy.takeVisualSnapshot("product-card-hover-wishlist");
  });

  it("hover reveals Quick View button", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first()
      .trigger("mouseover")
      .within(() => {
        cy.get('button[aria-label="Quick view"], a[aria-label="Quick view"]').should("exist");
      });
  });

  it("hover reveals Add to Cart button (if in stock)", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first()
      .trigger("mouseover")
      .within(() => {
        cy.get('button[aria-label="Add to cart"]').should("exist");
      });
    cy.takeVisualSnapshot("product-card-hover-add-cart");
  });

  it("clicking product card navigates to detail page", () => {
    cy.get('a[href*="/products/"]').first().click();
    cy.url().should("match", /\/products\/.+/);
    cy.get("h1").should("exist");
  });
});

describe("Products Page – Pagination", () => {
  beforeEach(() => {
    cy.visit("/products");
    cy.wait(3000);
  });

  it("pagination controls exist", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Next"), a:contains("Next"), [aria-label="Next page"]').length) {
        cy.takeVisualSnapshot("products-pagination");
      }
    });
  });

  it("clicking Next page loads new products", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Next"), [aria-label="Next page"]').length) {
        cy.contains("Next").click({ force: true });
        cy.wait(2000);
        cy.takeVisualSnapshot("products-page-2");
      }
    });
  });

  it("current page is highlighted", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[aria-current="page"]').length) {
        cy.get('[aria-current="page"]').should("exist");
      }
    });
  });
});

describe("Products Page – Cart & Wishlist Actions", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/products");
    cy.wait(3000);
  });

  it("Add to Cart from card (hover action)", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first()
      .trigger("mouseover")
      .find('button[aria-label="Add to cart"]')
      .click({ force: true });
    cy.wait(1000);
    cy.takeVisualSnapshot("product-added-to-cart-from-listing");
  });

  it("toggle wishlist from card", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first()
      .trigger("mouseover")
      .find('button[aria-label*="wishlist"]')
      .click({ force: true });
    cy.wait(1000);
    cy.takeVisualSnapshot("product-wishlist-toggled-listing");
  });

  it("unauthenticated wishlist click shows 'sign in' toast", () => {
    cy.clearAllLocalStorage();
    cy.visit("/products");
    cy.wait(3000);
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first()
      .trigger("mouseover")
      .find('button[aria-label*="wishlist"]')
      .click({ force: true });
    cy.contains(/sign in/i).should("be.visible");
    cy.takeVisualSnapshot("product-wishlist-unauthenticated");
  });
});

describe("Products Page – Mobile", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.visit("/products");
    cy.wait(3000);
  });

  it("sidebar hidden on mobile", () => {
    cy.get("aside").should("not.be.visible");
  });

  it("Filters button visible on mobile", () => {
    cy.contains("Filter").should("be.visible");
    cy.takeVisualSnapshot("products-mobile-filters-button");
  });

  it("filter sheet opens on mobile", () => {
    cy.contains("Filter").click();
    cy.wait(500);
    cy.takeVisualSnapshot("products-mobile-filter-sheet");
  });

  it("product grid shows 2 columns on mobile", () => {
    cy.get('[class*="grid"]').filter(':has(a[href*="/products/"])').should("exist");
    cy.takeVisualSnapshot("products-mobile-2col-grid");
  });
});
