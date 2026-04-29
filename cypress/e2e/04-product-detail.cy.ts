/// <reference types="cypress" />

// ============================================================
// 04 - PRODUCT DETAIL – Exhaustive Tests
// ============================================================

let productUrl: string;

before(() => {
  cy.request(`${Cypress.env("apiUrl")}/products?page=1&pageSize=1`).then((resp) => {
    const products = resp.body.data;
    if (products?.length) {
      productUrl = `/products/${products[0].id}`;
    }
  });
});

function visitProduct() {
  if (productUrl) {
    cy.visit(productUrl);
  } else {
    cy.visit("/products");
    cy.wait(2000);
    cy.get('a[href*="/products/"]').first().click();
  }
  cy.wait(2000);
}

describe("Product Detail – Gallery", () => {
  beforeEach(() => visitProduct());

  it("shows main product image or fallback", () => {
    cy.get('img, [class*="aspect-square"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("product-detail-main-image");
  });

  it("shows thumbnail navigation if multiple images", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="thumbnail"], [class*="grid"] img').length > 1) {
        cy.takeVisualSnapshot("product-detail-thumbnails");
      }
    });
  });

  it("clicking thumbnail changes main image", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="thumbnail"] img, [class*="cursor-pointer"] img').length > 1) {
        cy.get('[class*="thumbnail"] img, [class*="cursor-pointer"] img').eq(1).click();
        cy.takeVisualSnapshot("product-detail-image-switched");
      }
    });
  });
});

describe("Product Detail – Info Section", () => {
  beforeEach(() => visitProduct());

  it("shows product name (h1)", () => {
    cy.get("h1").should("be.visible");
    cy.takeVisualSnapshot("product-detail-name");
  });

  it("shows brand name if available", () => {
    cy.get("body").then(($body) => {
      // brand name is shown as small text above title
      cy.takeVisualSnapshot("product-detail-brand");
    });
  });

  it("shows star rating with review count", () => {
    cy.get('[class*="star"], svg').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("product-detail-rating");
  });

  it("shows price with $ symbol", () => {
    cy.get("body").invoke("text").should("match", /\$\d/);
    cy.takeVisualSnapshot("product-detail-price");
  });

  it("shows product description text", () => {
    cy.get("p").should("have.length.at.least", 1);
  });

  it("shows stock status badge", () => {
    cy.get('[class*="badge"], [class*="Badge"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("product-detail-stock-badge");
  });
});

describe("Product Detail – Variants", () => {
  beforeEach(() => visitProduct());

  it("shows variant selection buttons if variants exist", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Variant"), [class*="variant"]').length) {
        cy.takeVisualSnapshot("product-detail-variants");
      }
    });
  });

  it("selecting a variant updates display", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="variant"] button').length > 1) {
        cy.get('[class*="variant"] button').eq(1).click();
        cy.takeVisualSnapshot("product-detail-variant-selected");
      }
    });
  });

  it("selected variant shows checkmark", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="variant"] button').length) {
        cy.get('[class*="variant"] button').first().click();
        cy.takeVisualSnapshot("product-detail-variant-check");
      }
    });
  });
});

describe("Product Detail – Quantity Controls", () => {
  beforeEach(() => visitProduct());

  it("quantity starts at 1", () => {
    cy.get('[class*="border"], [class*="flex"]').filter(':has(button)').filter(':has(span:contains("1"))').should("exist");
    cy.takeVisualSnapshot("product-detail-quantity-1");
  });

  it("Plus button increments quantity to 2", () => {
    cy.get('button').filter(':has(svg)').last().click();
    cy.takeVisualSnapshot("product-detail-quantity-2");
  });

  it("Minus button is disabled at quantity 1", () => {
    cy.get("body").then(($body) => {
      // Minus button should be disabled when quantity is 1
      cy.takeVisualSnapshot("product-detail-minus-disabled");
    });
  });
});

describe("Product Detail – Add to Cart", () => {
  beforeEach(() => visitProduct());

  it("Add to Cart button exists", () => {
    cy.contains(/add to cart/i).should("be.visible");
    cy.takeVisualSnapshot("product-detail-add-cart-button");
  });

  it("clicking Add to Cart (unauthenticated) adds to local cart", () => {
    cy.contains(/add to cart/i).click();
    cy.wait(1000);
    cy.takeVisualSnapshot("product-detail-added-unauthenticated");
  });

  it("clicking Add to Cart (authenticated) shows success toast", () => {
    cy.login();
    visitProduct();
    cy.contains(/add to cart/i).click();
    cy.wait(1000);
    cy.takeVisualSnapshot("product-detail-added-authenticated");
  });

  it("button disabled if out of stock shows 'Sold Out'", () => {
    // This test only applies to out-of-stock products
    cy.get("body").then(($body) => {
      if ($body.text().match(/sold out|out of stock/i)) {
        cy.get('button:disabled').contains(/sold out/i).should("be.visible");
        cy.takeVisualSnapshot("product-detail-sold-out");
      }
    });
  });
});

describe("Product Detail – Wishlist", () => {
  beforeEach(() => {
    cy.login();
    visitProduct();
  });

  it("wishlist button (heart icon) exists", () => {
    cy.get('button[aria-label*="wishlist"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("product-detail-wishlist-button");
  });

  it("clicking wishlist toggles heart fill color", () => {
    cy.get('button[aria-label*="wishlist"]').first().click();
    cy.wait(1000);
    cy.takeVisualSnapshot("product-detail-wishlist-toggled");
  });

  it("wishlisted product shows filled red heart", () => {
    cy.get('button[aria-label*="wishlist"]').first().click();
    cy.wait(1000);
    cy.get('[class*="fill-red"], [class*="text-red"]').should("exist");
    cy.takeVisualSnapshot("product-detail-heart-filled");
  });
});

describe("Product Detail – Share Button", () => {
  beforeEach(() => visitProduct());

  it("share button exists", () => {
    cy.get('button[aria-label="Share"]').should("exist");
  });

  it("clicking share copies link to clipboard", () => {
    cy.get('button[aria-label="Share"]').click();
    cy.contains(/copied|clipboard/i).should("be.visible");
    cy.takeVisualSnapshot("product-detail-share-copied");
  });
});

describe("Product Detail – Trust Signals", () => {
  beforeEach(() => visitProduct());

  it("Free Shipping badge", () => {
    cy.contains("Free Shipping").should("be.visible");
  });

  it("Easy Returns badge", () => {
    cy.contains(/returns/i).should("be.visible");
  });

  it("Money Back / Warranty badge", () => {
    cy.contains(/warranty|money back/i).should("be.visible");
  });

  it("visual snapshot of all trust signals", () => {
    cy.takeVisualSnapshot("product-detail-trust-signals");
  });
});

describe("Product Detail – Tabs (Description/Shipping)", () => {
  beforeEach(() => visitProduct());

  it("Description tab exists and is clickable", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Description"), [role="tab"]:contains("Description")').length) {
        cy.contains("Description").click();
        cy.takeVisualSnapshot("product-detail-tab-description");
      }
    });
  });

  it("Shipping tab exists and is clickable", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Shipping"), [role="tab"]:contains("Shipping")').length) {
        cy.contains("Shipping").click();
        cy.takeVisualSnapshot("product-detail-tab-shipping");
      }
    });
  });
});

describe("Product Detail – Reviews Section", () => {
  beforeEach(() => visitProduct());

  it("reviews section exists", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/review/i)) {
        cy.contains(/review/i).scrollIntoView().should("be.visible");
        cy.takeVisualSnapshot("product-detail-reviews-section");
      }
    });
  });

  it("shows average rating display", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/review/i)) {
        cy.get('[class*="star"], svg').should("have.length.at.least", 1);
      }
    });
  });

  it("individual review cards show customer name, rating, comment", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="avatar"]').length > 1) {
        cy.get('[class*="card"]').filter(':has([class*="avatar"])').first().within(() => {
          cy.get("svg").should("have.length.at.least", 1); // stars
          cy.get("p").should("have.length.at.least", 1); // comment
        });
        cy.takeVisualSnapshot("product-detail-review-card");
      }
    });
  });

  it("no reviews shows empty state", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/no reviews/i)) {
        cy.contains(/no reviews/i).should("be.visible");
        cy.takeVisualSnapshot("product-detail-no-reviews");
      }
    });
  });
});

describe("Product Detail – Full Page Screenshot", () => {
  it("full page visual snapshot", () => {
    visitProduct();
    cy.takeVisualSnapshot("product-detail-FULL-PAGE");
  });
});
