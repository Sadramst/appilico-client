/// <reference types="cypress" />

// ============================================================
// Mobile Drawer Navigation – Verify fixed drawer works
// ============================================================

describe("Mobile Drawer – Opens and Navigates", () => {
  beforeEach(() => {
    cy.viewport(375, 667); // iPhone SE
    cy.visit("/");
    cy.wait(2000);
  });

  it("hamburger menu button is visible on mobile", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .should("be.visible");
  });

  it("clicking hamburger opens the drawer", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    // Drawer content should be visible and interactable
    cy.get('[role="dialog"]').should("be.visible");
  });

  it("drawer shows navigation links", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Home").should("be.visible");
      cy.contains("Products").should("be.visible");
      cy.contains("Categories").should("be.visible");
    });
  });

  it("drawer Home link navigates to homepage", () => {
    cy.visit("/products");
    cy.wait(2000);
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("Home").click();
    cy.wait(1000);
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("drawer Products link navigates to /products", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("Products").click();
    cy.wait(1000);
    cy.url().should("include", "/products");
  });

  it("drawer Categories link navigates to /categories", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("Categories").click();
    cy.wait(1000);
    cy.url().should("include", "/categories");
  });

  it("drawer Brands link navigates to /brands", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("Brands").click();
    cy.wait(1000);
    cy.url().should("include", "/brands");
  });

  it("drawer Offers link navigates to /offers", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("Offers").click();
    cy.wait(1000);
    cy.url().should("include", "/offers");
  });

  it("drawer closes after clicking a link", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("Home").click();
    cy.wait(1000);
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("drawer is NOT faded/blocked – links are clickable", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    // Verify the dialog links are actually interactive (not behind an overlay)
    cy.get('[role="dialog"]').find("a").first().should("not.have.css", "pointer-events", "none");
    cy.get('[role="dialog"]').find("a").first().click();
    cy.wait(500);
    // If we're navigating, the drawer worked
    cy.url().should("not.eq", "");
  });
});

describe("Mobile Drawer – Authenticated User", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.login();
    cy.visit("/");
    cy.wait(2000);
  });

  it("drawer shows profile-related links for logged-in user", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').within(() => {
      cy.contains(/profile|account/i).should("be.visible");
    });
  });

  it("drawer shows logout option for logged-in user", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').within(() => {
      cy.contains(/logout|sign out/i).should("be.visible");
    });
  });
});

describe("Mobile Drawer – Unauthenticated User", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.visit("/");
    cy.wait(2000);
  });

  it("drawer shows Sign In link for unauthenticated user", () => {
    cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[role="dialog"]').within(() => {
      cy.contains(/sign in|login/i).should("be.visible");
    });
  });
});

describe("Mobile Drawer – Multiple Viewports", () => {
  const viewports: Cypress.ViewportPreset[] = ["iphone-6", "iphone-x", "samsung-s10"];

  viewports.forEach((vp) => {
    it(`drawer works on ${vp}`, () => {
      cy.viewport(vp);
      cy.visit("/");
      cy.wait(2000);
      cy.get('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]')
        .first()
        .click();
      cy.wait(500);
      cy.get('[role="dialog"]').should("be.visible");
      cy.get('[role="dialog"]').contains("Products").click();
      cy.wait(1000);
      cy.url().should("include", "/products");
    });
  });
});
