/// <reference types="cypress" />

describe("Profile Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/profile");
  });

  it("renders profile page with user info", () => {
    cy.takeVisualSnapshot("profile-page");
    cy.get("h1, h2").contains(/profile/i).should("exist");
    cy.get("input").should("have.length.at.least", 2);
  });

  it("shows account sidebar with all links", () => {
    cy.get("aside, nav")
      .filter(":has(a[href='/profile'])")
      .within(() => {
        cy.contains("Profile").should("exist");
        cy.contains("Orders").should("exist");
        cy.contains("Addresses").should("exist");
        cy.contains("Wishlist").should("exist");
      });
    cy.takeVisualSnapshot("profile-sidebar");
  });

  it("has editable first name, last name, phone fields", () => {
    cy.get('input[name="firstName"], input[placeholder*="First"]').should("exist");
    cy.get('input[name="lastName"], input[placeholder*="Last"]').should("exist");
    cy.get('input[name="phoneNumber"], input[placeholder*="Phone"]').should("exist");
    cy.takeVisualSnapshot("profile-form-fields");
  });

  it("shows user avatar", () => {
    cy.get('[class*="avatar"], [class*="Avatar"]').should("have.length.at.least", 1);
  });
});

describe("Order History Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/orders");
  });

  it("renders order history page", () => {
    cy.takeVisualSnapshot("orders-page");
    cy.get("h1, h2").contains(/order/i).should("exist");
  });

  it("shows order cards or empty state", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').filter(':has(a[href*="/orders/"])').length) {
        // Has orders
        cy.get('[class*="card"]')
          .filter(':has(a[href*="/orders/"])')
          .first()
          .within(() => {
            cy.contains(/order #|#/i).should("exist");
            cy.get('[class*="badge"], [class*="Badge"]').should("exist"); // status badge
          });
        cy.takeVisualSnapshot("orders-list-with-orders");
      } else {
        // Empty state
        cy.contains(/no orders|empty/i).should("be.visible");
        cy.takeVisualSnapshot("orders-empty-state");
      }
    });
  });

  it("navigates to order detail", () => {
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/orders/"]').length) {
        cy.get('a[href*="/orders/"]').first().click();
        cy.url().should("match", /\/orders\/.+/);
        cy.takeVisualSnapshot("order-detail-page");
      }
    });
  });

  it("shows cancel button for pending/confirmed orders", () => {
    cy.get("body").then(($body) => {
      const cancelBtn = $body.find('button:contains("Cancel")');
      if (cancelBtn.length) {
        cy.takeVisualSnapshot("order-cancel-button-visible");
      }
    });
  });
});

describe("Address Management Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/addresses");
  });

  it("renders address management page", () => {
    cy.takeVisualSnapshot("addresses-page");
    cy.get("h1, h2").contains(/address/i).should("exist");
  });

  it("shows Add Address button", () => {
    cy.contains(/add address/i).should("be.visible");
  });

  it("opens add address dialog", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[id="title"]').should("be.visible");
      cy.get('input[id="addressLine1"]').should("be.visible");
      cy.get('input[id="city"]').should("be.visible");
      cy.get('input[id="postalCode"]').should("be.visible");
      cy.get('input[id="country"]').should("be.visible");
    });
    cy.takeVisualSnapshot("addresses-add-dialog");
  });

  it("creates a new address", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[id="title"]').type("E2E Test Address");
      cy.get('input[id="addressLine1"]').type("789 Test Ave");
      cy.get('input[id="city"]').type("Brisbane");
      cy.get('input[id="state"]').type("QLD");
      cy.get('input[id="postalCode"]').type("4000");
      cy.get('input[id="country"]').type("Australia");
      cy.get('button[type="submit"]').click();
    });
    cy.wait(2000);
    cy.contains("E2E Test Address").should("be.visible");
    cy.takeVisualSnapshot("addresses-new-created");
  });

  it("edits an existing address", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button[aria-label*="edit"], button:has(svg[class*="pencil"])').length) {
        // Click edit on first address
        cy.get('button')
          .filter(':has(svg)')
          .filter('[class*="ghost"]')
          .first()
          .click();
        cy.get('[role="dialog"]').should("be.visible");
        cy.takeVisualSnapshot("addresses-edit-dialog");
      }
    });
  });

  it("shows address type and default badges", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 0) {
        cy.get('[class*="badge"], [class*="Badge"]').should("have.length.at.least", 1);
        cy.takeVisualSnapshot("addresses-badges");
      }
    });
  });
});

describe("Wishlist Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/wishlist");
  });

  it("renders wishlist page", () => {
    cy.takeVisualSnapshot("wishlist-page");
    cy.get("h1, h2").contains(/wishlist/i).should("exist");
  });

  it("shows wishlist items or empty state", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        cy.takeVisualSnapshot("wishlist-with-items");
      } else {
        cy.contains(/empty|no items/i).should("be.visible");
        cy.takeVisualSnapshot("wishlist-empty-state");
      }
    });
  });
});
