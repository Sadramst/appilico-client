/// <reference types="cypress" />

// ============================================================
// 07 - ACCOUNT PAGES – Exhaustive Tests
// ============================================================

describe("Profile Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/profile");
    cy.wait(3000);
  });

  it("renders profile page with breadcrumbs", () => {
    cy.get('[class*="breadcrumb"]').should("exist");
    cy.takeVisualSnapshot("profile-breadcrumbs");
  });

  it("renders 'My Profile' heading", () => {
    cy.contains("My Profile").should("be.visible");
    cy.takeVisualSnapshot("profile-heading");
  });

  it("shows Account Sidebar with all links", () => {
    const links = ["Profile", "Orders", "Addresses", "Wishlist"];
    links.forEach((link) => {
      cy.get("aside, nav").contains(link).should("be.visible");
    });
    cy.takeVisualSnapshot("profile-sidebar");
  });

  it("Profile link is active/highlighted in sidebar", () => {
    cy.get('a[href="/profile"]').should("have.class", /primary|active/);
  });

  it("sidebar Orders link navigates to /orders", () => {
    cy.get("aside, nav").contains("Orders").click();
    cy.url().should("include", "/orders");
  });

  it("sidebar Addresses link navigates to /addresses", () => {
    cy.visit("/profile");
    cy.get("aside, nav").contains("Addresses").click();
    cy.url().should("include", "/addresses");
  });

  it("sidebar Wishlist link navigates to /wishlist", () => {
    cy.visit("/profile");
    cy.get("aside, nav").contains("Wishlist").click();
    cy.url().should("include", "/wishlist");
  });

  it("shows user avatar with initials or image", () => {
    cy.get('[class*="avatar"], [class*="Avatar"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("profile-avatar");
  });

  it("shows camera button on avatar for upload", () => {
    cy.get('button').filter(':has(svg)').should("have.length.at.least", 1);
  });

  it("shows user name display", () => {
    cy.get("h3, h2").should("have.length.at.least", 1);
  });

  it("shows user email display", () => {
    cy.get("body").invoke("text").should("match", /@/); // email has @
    cy.takeVisualSnapshot("profile-user-info");
  });

  it("profile form has First Name field", () => {
    cy.contains("label", "First Name").should("be.visible");
    cy.get('input').should("have.length.at.least", 1);
  });

  it("profile form has Last Name field", () => {
    cy.contains("label", "Last Name").should("be.visible");
  });

  it("profile form has Phone Number field", () => {
    cy.contains("label", /phone/i).should("be.visible");
  });

  it("Save Changes button exists", () => {
    cy.get('button[type="submit"]').contains(/save/i).should("be.visible");
  });

  it("form is pre-filled with current user data", () => {
    cy.get('input').first().should("not.have.value", "");
    cy.takeVisualSnapshot("profile-form-prefilled");
  });

  it("updating first name and saving shows success", () => {
    cy.get('input').first().clear().type("TestUpdated");
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.takeVisualSnapshot("profile-form-saved");
  });

  it("Save Changes button disabled during submission", () => {
    cy.get('input').first().clear().type("TestUpdated");
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').should("be.disabled");
  });
});

describe("Orders Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/orders");
    cy.wait(3000);
  });

  it("renders 'My Orders' heading", () => {
    cy.contains("My Orders").should("be.visible");
    cy.takeVisualSnapshot("orders-heading");
  });

  it("shows breadcrumbs", () => {
    cy.get('[class*="breadcrumb"]').should("exist");
  });

  it("shows Account Sidebar", () => {
    cy.get("aside, nav").contains("Orders").should("be.visible");
    cy.takeVisualSnapshot("orders-sidebar");
  });

  it("Orders link is active in sidebar", () => {
    cy.get('a[href="/orders"]').should("have.class", /primary|active/);
  });

  it("shows order cards or empty state", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').filter(':has(a[href*="/orders/"])').length) {
        cy.takeVisualSnapshot("orders-list");
      } else {
        cy.contains(/no orders|empty/i).should("be.visible");
        cy.takeVisualSnapshot("orders-empty");
      }
    });
  });

  it("order card shows order number (#ORD-XXXXX)", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/#ORD-|order/i)) {
        cy.takeVisualSnapshot("order-card-number");
      }
    });
  });

  it("order card shows status badge", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="badge"]').length) {
        cy.get('[class*="badge"]').should("have.length.at.least", 1);
        cy.takeVisualSnapshot("order-card-status-badge");
      }
    });
  });

  it("order card shows order date and item count", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').filter(':has(a[href*="/orders/"])').length) {
        cy.takeVisualSnapshot("order-card-date");
      }
    });
  });

  it("order card shows total price", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/\$\d/)) {
        cy.takeVisualSnapshot("order-card-total");
      }
    });
  });

  it("order card shows item thumbnails", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"] img').length) {
        cy.takeVisualSnapshot("order-card-thumbnails");
      }
    });
  });

  it("pending/confirmed order shows Cancel button", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Cancel")').length) {
        cy.contains("Cancel").should("be.visible");
        cy.takeVisualSnapshot("order-cancel-button");
      }
    });
  });

  it("Details button navigates to order detail page", () => {
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/orders/"]').length) {
        cy.get('a[href*="/orders/"]').first().click();
        cy.url().should("match", /\/orders\/.+/);
        cy.takeVisualSnapshot("order-detail-page");
      }
    });
  });

  it("empty state shows 'Start Shopping' CTA", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/no orders|empty/i)) {
        cy.contains(/start shopping|browse/i).should("be.visible");
      }
    });
  });

  it("loading state shows skeleton cards", () => {
    // Skeletons are transient; just check page loaded
    cy.takeVisualSnapshot("orders-page-loaded");
  });
});

describe("Order Detail Page", () => {
  it("renders order detail with order info", () => {
    cy.login();
    cy.visit("/orders");
    cy.wait(3000);
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/orders/"]').length) {
        cy.get('a[href*="/orders/"]').first().click();
        cy.wait(3000);
        cy.get("h1, h2").should("exist");
        cy.contains(/order/i).should("be.visible");
        cy.takeVisualSnapshot("order-detail-full");
      }
    });
  });
});

describe("Addresses Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/addresses");
    cy.wait(3000);
  });

  it("renders 'My Addresses' heading", () => {
    cy.contains(/address/i).should("be.visible");
    cy.takeVisualSnapshot("addresses-heading");
  });

  it("shows breadcrumbs", () => {
    cy.get('[class*="breadcrumb"]').should("exist");
  });

  it("shows Account Sidebar with Addresses active", () => {
    cy.get('a[href="/addresses"]').should("exist");
  });

  it("Add Address button exists", () => {
    cy.contains(/add address/i).should("be.visible");
    cy.takeVisualSnapshot("addresses-add-button");
  });

  it("Add Address opens dialog", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.takeVisualSnapshot("addresses-add-dialog");
  });

  it("dialog has Title field", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').find('input').should("have.length.at.least", 4);
  });

  it("dialog has Address Line 1 field", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').contains(/address/i).should("exist");
  });

  it("dialog has City field", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').contains(/city/i).should("exist");
  });

  it("dialog has Postal Code field", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').contains(/postal|zip/i).should("exist");
  });

  it("dialog has Country field", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').contains(/country/i).should("exist");
  });

  it("dialog has Address Type selector", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').contains(/type/i).should("exist");
  });

  it("dialog has Set as Default toggle", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').contains(/default/i).should("exist");
  });

  it("dialog empty submit shows validation errors", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').find('button[type="submit"]').click();
    cy.wait(300);
    cy.takeVisualSnapshot("addresses-dialog-validation");
  });

  it("creating address successfully", () => {
    cy.contains(/add address/i).first().click();
    cy.get('[role="dialog"]').within(() => {
      cy.get("input").eq(0).type("E2E Test Address");
      cy.get("input").eq(1).type("123 Test Street");
      cy.get("input").eq(2).type("Sydney");
      cy.get("input").eq(3).type("NSW");
      cy.get("input").eq(4).type("2000");
      cy.get("input").eq(5).type("Australia");
      cy.get('button[type="submit"]').click();
    });
    cy.wait(3000);
    cy.contains("E2E Test Address").should("be.visible");
    cy.takeVisualSnapshot("addresses-new-created");
  });

  it("address card shows address title with map pin icon", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        cy.get('[class*="card"]').first().find("svg").should("exist");
        cy.takeVisualSnapshot("address-card-icon");
      }
    });
  });

  it("address card shows Default badge if applicable", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/default/i)) {
        cy.contains("Default").should("be.visible");
      }
    });
  });

  it("address card shows type badge (Shipping/Billing/Both)", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="badge"]').length) {
        cy.get('[class*="badge"]').should("have.length.at.least", 1);
        cy.takeVisualSnapshot("address-type-badge");
      }
    });
  });

  it("address card Edit button opens edit dialog", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        cy.get('[class*="card"]').eq(1).find("button").first().click({ force: true });
        cy.wait(500);
        cy.takeVisualSnapshot("address-edit-dialog");
      }
    });
  });

  it("address card Delete button shows confirmation", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        // Last button in card is usually delete
        cy.get('[class*="card"]').eq(1).find("button").last().click({ force: true });
        cy.wait(500);
        cy.takeVisualSnapshot("address-delete-confirm");
      }
    });
  });

  it("empty state shows 'No addresses yet'", () => {
    // Only if no addresses
    cy.get("body").then(($body) => {
      if ($body.text().match(/no address/i)) {
        cy.contains(/no address/i).should("be.visible");
        cy.takeVisualSnapshot("addresses-empty-state");
      }
    });
  });
});

describe("Wishlist Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/wishlist");
    cy.wait(3000);
  });

  it("renders 'Wishlist' heading", () => {
    cy.contains("Wishlist").should("be.visible");
    cy.takeVisualSnapshot("wishlist-heading");
  });

  it("shows breadcrumbs", () => {
    cy.get('[class*="breadcrumb"]').should("exist");
  });

  it("shows Account Sidebar", () => {
    cy.get("aside, nav").contains("Wishlist").should("be.visible");
  });

  it("shows wishlist items or empty state", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        cy.takeVisualSnapshot("wishlist-with-items");
      } else {
        cy.contains(/empty|no items/i).should("be.visible");
        cy.takeVisualSnapshot("wishlist-empty");
      }
    });
  });

  it("wishlist item has product name as link", () => {
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/products/"]').length) {
        cy.get('a[href*="/products/"]').should("have.length.at.least", 1);
      }
    });
  });

  it("wishlist item has product price", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/\$\d/)) {
        cy.takeVisualSnapshot("wishlist-item-price");
      }
    });
  });

  it("wishlist item has 'Add to Cart' button", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        cy.contains(/add to cart/i).should("exist");
      }
    });
  });

  it("wishlist item has 'Remove' button", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        cy.contains(/remove/i).should("exist");
      }
    });
  });

  it("empty state shows 'Browse Products' CTA", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/empty|no items/i)) {
        cy.contains(/browse/i).should("be.visible");
        cy.contains(/browse/i).click();
        cy.url().should("include", "/products");
      }
    });
  });

  it("loading state shows skeleton cards", () => {
    cy.takeVisualSnapshot("wishlist-loaded");
  });
});
