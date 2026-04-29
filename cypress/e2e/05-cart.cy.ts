/// <reference types="cypress" />

describe("Shopping Cart Page", () => {
  beforeEach(() => {
    // Add an item to cart first via API then visit
    cy.login();
    cy.request(`${Cypress.env("apiUrl")}/products?page=1&pageSize=1`).then((resp) => {
      const product = resp.body.data[0];
      if (product) {
        cy.window().then((win) => {
          const token = win.localStorage.getItem("appilico_access_token");
          cy.request({
            method: "POST",
            url: `${Cypress.env("apiUrl")}/cart/items`,
            headers: { Authorization: `Bearer ${token}` },
            body: { productId: product.id, quantity: 2 },
            failOnStatusCode: false,
          });
        });
      }
    });
    cy.visit("/cart");
  });

  it("renders cart page with items", () => {
    cy.takeVisualSnapshot("cart-page-with-items");
  });

  it("shows product name, price, quantity, and line total", () => {
    cy.get('[class*="card"], [class*="border"]')
      .filter(":has(a[href*='/products/'])")
      .first()
      .within(() => {
        cy.get("a").should("exist"); // product name link
        cy.get("span").should("have.length.at.least", 1); // price
      });
  });

  it("increments item quantity", () => {
    cy.get('[class*="border"]')
      .filter(":has(a[href*='/products/'])")
      .first()
      .find("button")
      .filter(":has(svg)")
      .last()
      .click(); // plus button
    cy.wait(1000);
    cy.takeVisualSnapshot("cart-quantity-incremented");
  });

  it("decrements item quantity", () => {
    cy.get('[class*="border"]')
      .filter(":has(a[href*='/products/'])")
      .first()
      .find("button")
      .filter(":has(svg)")
      .first()
      .click(); // minus button
    cy.wait(1000);
    cy.takeVisualSnapshot("cart-quantity-decremented");
  });

  it("removes item from cart", () => {
    cy.get('button[class*="destructive"], button')
      .filter(':has(svg[class*="trash"], svg[class*="Trash"])')
      .first()
      .click();
    cy.contains(/removed/i).should("be.visible");
    cy.takeVisualSnapshot("cart-item-removed");
  });

  it("shows cart summary with subtotal and total", () => {
    cy.contains(/subtotal/i).should("be.visible");
    cy.contains(/total/i).should("be.visible");
    cy.takeVisualSnapshot("cart-summary");
  });

  it("navigates to checkout via Proceed button", () => {
    cy.contains(/proceed to checkout|checkout/i).click();
    cy.url().should("include", "/checkout");
    cy.takeVisualSnapshot("cart-to-checkout");
  });

  it("clears entire cart", () => {
    cy.contains(/clear cart/i).click();
    cy.wait(1000);
    cy.takeVisualSnapshot("cart-cleared");
  });
});

describe("Cart - Empty State", () => {
  beforeEach(() => {
    cy.login();
    // Clear cart first
    cy.window().then((win) => {
      const token = win.localStorage.getItem("appilico_access_token");
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/cart`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      });
    });
    cy.visit("/cart");
  });

  it("shows empty cart state with CTA", () => {
    cy.contains(/empty|no items/i).should("be.visible");
    cy.contains(/start shopping|browse/i).should("be.visible");
    cy.takeVisualSnapshot("cart-empty-state");
  });
});

describe("Cart Drawer", () => {
  it("opens cart drawer and shows items", () => {
    cy.login();
    cy.visit("/products");
    // Add something first
    cy.get('[class*="card"]')
      .first()
      .trigger('mouseover')
      .find('button[aria-label="Add to cart"]')
      .click({ force: true });
    cy.wait(1000);
    // Cart drawer should auto-open
    cy.get('[role="dialog"], [data-state="open"]')
      .contains(/cart/i)
      .should("be.visible");
    cy.takeVisualSnapshot("cart-drawer-with-item");
  });
});
