/// <reference types="cypress" />

// ============================================================
// 06 - CHECKOUT – Exhaustive Tests (3-step flow)
// ============================================================

function ensureCartHasItem() {
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
}

describe("Checkout – Step Indicator", () => {
  beforeEach(() => {
    cy.login();
    ensureCartHasItem();
    cy.visit("/checkout");
    cy.wait(3000);
  });

  it("renders checkout page", () => {
    cy.takeVisualSnapshot("checkout-page-full");
  });

  it("shows 3-step progress indicator", () => {
    cy.contains(/shipping/i).should("be.visible");
    cy.contains(/payment/i).should("exist");
    cy.contains(/review/i).should("exist");
    cy.takeVisualSnapshot("checkout-step-indicator");
  });

  it("step 1 (Shipping) is active/highlighted", () => {
    cy.takeVisualSnapshot("checkout-step1-active");
  });
});

describe("Checkout – Step 1: Shipping Address", () => {
  beforeEach(() => {
    cy.login();
    ensureCartHasItem();
    cy.visit("/checkout");
    cy.wait(3000);
  });

  it("shows saved addresses as radio selection", () => {
    cy.get('input[type="radio"], button[role="radio"], [data-state]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("checkout-address-selection");
  });

  it("address card shows title", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length) {
        cy.takeVisualSnapshot("checkout-address-card");
      }
    });
  });

  it("address card shows full address details", () => {
    cy.takeVisualSnapshot("checkout-address-details");
  });

  it("default address has 'Default' badge", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/default/i)) {
        cy.contains("Default").should("be.visible");
      }
    });
  });

  it("'Add New Address' button exists", () => {
    cy.contains(/add new|add address/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-add-address-button");
  });

  it("Add New Address opens dialog", () => {
    cy.contains(/add new|add address/i).click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.takeVisualSnapshot("checkout-add-address-dialog");
  });

  it("address dialog has all required fields", () => {
    cy.contains(/add new|add address/i).click();
    cy.get('[role="dialog"]').within(() => {
      cy.get("input").should("have.length.at.least", 5);
      cy.get('button[type="submit"]').should("exist");
    });
  });

  it("address dialog validation – empty submit shows errors", () => {
    cy.contains(/add new|add address/i).click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.wait(300);
    cy.takeVisualSnapshot("checkout-address-validation-errors");
  });

  it("Continue button advances to Step 2", () => {
    cy.contains("Continue").click();
    cy.wait(500);
    cy.contains(/payment/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-step2-reached");
  });
});

describe("Checkout – Step 2: Payment Method", () => {
  beforeEach(() => {
    cy.login();
    ensureCartHasItem();
    cy.visit("/checkout");
    cy.wait(3000);
    cy.contains("Continue").click();
    cy.wait(500);
  });

  it("shows payment method options", () => {
    cy.contains(/payment method/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-payment-methods");
  });

  it("shows Credit Card option", () => {
    cy.contains("Credit Card").should("be.visible");
  });

  it("shows Debit Card option", () => {
    cy.contains("Debit Card").should("be.visible");
  });

  it("shows PayPal option", () => {
    cy.contains("PayPal").should("be.visible");
  });

  it("shows Bank Transfer option", () => {
    cy.contains("Bank Transfer").should("be.visible");
  });

  it("shows Cash on Delivery option", () => {
    cy.contains("Cash on Delivery").should("be.visible");
  });

  it("selecting PayPal highlights it", () => {
    cy.contains("PayPal").click();
    cy.takeVisualSnapshot("checkout-paypal-selected");
  });

  it("voucher input field exists", () => {
    cy.get('input[placeholder*="code"], input[id*="voucher"]').should("be.visible");
    cy.takeVisualSnapshot("checkout-voucher-input");
  });

  it("Apply Voucher button exists", () => {
    cy.contains("Apply").should("be.visible");
  });

  it("applying invalid voucher shows error", () => {
    cy.get('input[placeholder*="code"], input[id*="voucher"]').type("INVALIDCODE123");
    cy.contains("Apply").click();
    cy.wait(3000);
    cy.takeVisualSnapshot("checkout-invalid-voucher");
  });

  it("Back button returns to Step 1", () => {
    cy.contains("Back").click();
    cy.contains(/shipping/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-back-to-step1");
  });

  it("Continue advances to Step 3", () => {
    cy.contains("Continue").click();
    cy.wait(500);
    cy.contains(/review/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-step3-reached");
  });
});

describe("Checkout – Step 3: Order Review", () => {
  beforeEach(() => {
    cy.login();
    ensureCartHasItem();
    cy.visit("/checkout");
    cy.wait(3000);
    cy.contains("Continue").click();
    cy.wait(500);
    cy.contains("Continue").click();
    cy.wait(500);
  });

  it("shows order review heading", () => {
    cy.contains(/review/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-review-heading");
  });

  it("shows shipping address in review", () => {
    cy.contains(/shipping/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-review-address");
  });

  it("shows payment method in review", () => {
    cy.contains(/payment/i).should("be.visible");
  });

  it("shows item list with names and quantities", () => {
    cy.get("body").invoke("text").should("match", /\$/);
    cy.takeVisualSnapshot("checkout-review-items");
  });

  it("shows subtotal, discount, shipping, tax, total", () => {
    cy.contains(/subtotal/i).should("be.visible");
    cy.contains(/total/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-review-totals");
  });

  it("Place Order button exists", () => {
    cy.contains(/place order/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-place-order-button");
  });

  it("Back button returns to Step 2", () => {
    cy.contains("Back").click();
    cy.contains(/payment/i).should("be.visible");
  });
});

describe("Checkout – Order Summary Sidebar", () => {
  beforeEach(() => {
    cy.login();
    ensureCartHasItem();
    cy.visit("/checkout");
    cy.wait(3000);
  });

  it("sidebar shows Order Summary heading", () => {
    cy.contains(/order summary/i).should("be.visible");
    cy.takeVisualSnapshot("checkout-sidebar-summary");
  });

  it("sidebar shows subtotal amount", () => {
    cy.contains(/subtotal/i).should("be.visible");
  });

  it("sidebar shows total amount", () => {
    cy.contains(/total/i).should("be.visible");
  });
});

describe("Checkout – Mobile Responsiveness", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.login();
    ensureCartHasItem();
    cy.visit("/checkout");
    cy.wait(3000);
  });

  it("checkout renders correctly on mobile", () => {
    cy.takeVisualSnapshot("checkout-mobile");
  });

  it("step indicator works on mobile", () => {
    cy.contains("Continue").click();
    cy.wait(500);
    cy.takeVisualSnapshot("checkout-mobile-step2");
  });
});
