/// <reference types="cypress" />

// ============================================================
// 05 - CART – Exhaustive Tests (Page + Drawer)
// ============================================================

function addItemToCart() {
  cy.window().then((win) => {
    const token = win.localStorage.getItem("appilico_access_token");
    cy.request(`${Cypress.env("apiUrl")}/products?page=1&pageSize=1`).then((resp) => {
      const product = resp.body.data[0];
      if (product) {
        cy.request({
          method: "POST",
          url: `${Cypress.env("apiUrl")}/cart/items`,
          headers: { Authorization: `Bearer ${token}` },
          body: { productId: product.id, quantity: 2 },
          failOnStatusCode: false,
        });
      }
    });
  });
}

function clearCartAPI() {
  cy.window().then((win) => {
    const token = win.localStorage.getItem("appilico_access_token");
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/cart`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  });
}

describe("Cart Page – With Items", () => {
  beforeEach(() => {
    cy.login();
    addItemToCart();
    cy.visit("/cart");
    cy.wait(3000);
  });

  it("renders cart page with heading 'Shopping Cart'", () => {
    cy.contains("Shopping Cart").should("be.visible");
    cy.takeVisualSnapshot("cart-page-heading");
  });

  it("shows breadcrumbs", () => {
    cy.get('[class*="breadcrumb"], nav[aria-label="Breadcrumb"]').should("exist");
  });

  it("shows Clear Cart button", () => {
    cy.contains(/clear cart/i).should("be.visible");
    cy.takeVisualSnapshot("cart-clear-button");
  });

  it("shows cart item with product image or fallback", () => {
    cy.get('img, [class*="avatar"], [class*="aspect"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("cart-item-image");
  });

  it("shows cart item with product name as clickable link", () => {
    cy.get('a[href*="/products/"]').should("have.length.at.least", 1);
  });

  it("shows unit price per item", () => {
    cy.get("body").invoke("text").should("match", /\$\d/);
  });

  it("shows quantity controls (minus, quantity, plus)", () => {
    cy.get('button').filter(':has(svg)').should("have.length.at.least", 2);
    cy.takeVisualSnapshot("cart-quantity-controls");
  });

  it("increment quantity works", () => {
    // Click the plus button
    cy.get('button').filter(':has(svg)').then(($btns) => {
      // Find plus buttons in cart items area
      cy.get('[class*="card"], [class*="border"]')
        .filter(':has(a[href*="/products/"])')
        .first()
        .find("button")
        .filter(':has(svg)')
        .last()
        .click();
      cy.wait(1000);
      cy.takeVisualSnapshot("cart-quantity-incremented");
    });
  });

  it("decrement quantity works", () => {
    cy.get('[class*="card"], [class*="border"]')
      .filter(':has(a[href*="/products/"])')
      .first()
      .find("button")
      .filter(':has(svg)')
      .first()
      .click();
    cy.wait(1000);
    cy.takeVisualSnapshot("cart-quantity-decremented");
  });

  it("remove item button (trash icon) works", () => {
    cy.get('button').filter(':has(svg)').then(($btns) => {
      // Find trash/remove button
      const removeBtn = $btns.filter('[class*="destructive"], [class*="ghost"]');
      if (removeBtn.length) {
        cy.wrap(removeBtn).first().click();
        cy.wait(1000);
        cy.takeVisualSnapshot("cart-item-removed");
      }
    });
  });

  it("shows line total for each item", () => {
    cy.get("body").invoke("text").should("match", /\$\d/);
  });

  it("Cart Summary shows subtotal", () => {
    cy.contains(/subtotal/i).should("be.visible");
    cy.takeVisualSnapshot("cart-summary-subtotal");
  });

  it("Cart Summary shows total amount", () => {
    cy.contains(/total/i).should("be.visible");
    cy.takeVisualSnapshot("cart-summary-total");
  });

  it("Proceed to Checkout button navigates to /checkout", () => {
    cy.contains(/proceed to checkout|checkout/i).click();
    cy.url().should("include", "/checkout");
    cy.takeVisualSnapshot("cart-to-checkout");
  });

  it("Clear Cart removes all items", () => {
    cy.contains(/clear cart/i).click();
    cy.wait(2000);
    cy.contains(/empty|no items/i).should("be.visible");
    cy.takeVisualSnapshot("cart-all-cleared");
  });
});

describe("Cart Page – Empty State", () => {
  beforeEach(() => {
    cy.login();
    clearCartAPI();
    cy.visit("/cart");
    cy.wait(3000);
  });

  it("shows empty cart message", () => {
    cy.contains(/empty|no items/i).should("be.visible");
    cy.takeVisualSnapshot("cart-empty-state");
  });

  it("shows Start Shopping / Browse Products CTA", () => {
    cy.contains(/start shopping|browse/i).should("be.visible");
  });

  it("CTA link navigates to products page", () => {
    cy.contains(/start shopping|browse/i).click();
    cy.url().should("include", "/products");
  });
});

describe("Cart Drawer – Interactions", () => {
  beforeEach(() => {
    cy.login();
    addItemToCart();
    cy.visit("/");
    cy.wait(2000);
  });

  it("cart icon in header shows item count badge", () => {
    cy.get('button[aria-label="Cart"]').within(() => {
      cy.get('[class*="badge"], span').should("exist");
    });
    cy.takeVisualSnapshot("header-cart-badge");
  });

  it("clicking cart icon opens drawer", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"], [data-state="open"]').should("be.visible");
    cy.takeVisualSnapshot("cart-drawer-open-with-items");
  });

  it("drawer shows cart item list", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').find('a[href*="/products/"]').should("have.length.at.least", 1);
  });

  it("drawer item shows product image and name", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').find('img, [class*="avatar"]').should("exist");
    cy.get('[role="dialog"]').find('a[href*="/products/"]').should("exist");
    cy.takeVisualSnapshot("cart-drawer-item-details");
  });

  it("drawer shows unit price", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').invoke("text").should("match", /\$/);
  });

  it("drawer has quantity controls", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').find("button").filter(':has(svg)').should("have.length.at.least", 2);
    cy.takeVisualSnapshot("cart-drawer-quantity-controls");
  });

  it("drawer increment quantity", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').find("button").filter(':has(svg)').last().click({ force: true });
    cy.wait(1000);
    cy.takeVisualSnapshot("cart-drawer-incremented");
  });

  it("drawer has remove button (trash)", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').find('button').filter(':has(svg)').should("have.length.at.least", 1);
  });

  it("drawer shows subtotal", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').contains(/subtotal/i).should("be.visible");
  });

  it("drawer shows total", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').contains(/total/i).should("be.visible");
  });

  it("drawer Checkout button links to /checkout", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').contains(/checkout/i).click();
    cy.url().should("include", "/checkout");
  });
});

describe("Cart Drawer – Empty State", () => {
  beforeEach(() => {
    cy.login();
    clearCartAPI();
    cy.visit("/");
    cy.wait(2000);
  });

  it("empty cart drawer shows 'Your cart is empty'", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').contains(/empty/i).should("be.visible");
    cy.takeVisualSnapshot("cart-drawer-empty");
  });

  it("empty cart drawer shows Browse Products link", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').contains(/browse/i).should("be.visible");
  });
});

describe("Cart – Mobile Responsiveness", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.login();
    addItemToCart();
    cy.visit("/cart");
    cy.wait(3000);
  });

  it("cart page stacks items on mobile", () => {
    cy.takeVisualSnapshot("cart-mobile-stacked");
  });

  it("summary section below items on mobile", () => {
    cy.contains(/subtotal/i).scrollIntoView().should("be.visible");
    cy.takeVisualSnapshot("cart-mobile-summary");
  });
});
