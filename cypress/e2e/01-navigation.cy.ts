/// <reference types="cypress" />

describe("Homepage & Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the homepage with all sections", () => {
    cy.takeVisualSnapshot("homepage-full");
    // Hero banner
    cy.get("section, [class*=hero]").should("exist");
    // Trust badges
    cy.contains("Free Shipping").should("be.visible");
    // Featured products section
    cy.contains(/featured|popular/i).should("exist");
    // Category grid
    cy.get("a[href*='/products']").should("have.length.at.least", 1);
  });

  it("navigates to all main nav links", () => {
    const navLinks = [
      { label: "Products", path: "/products" },
      { label: "Categories", path: "/categories" },
      { label: "Brands", path: "/brands" },
      { label: "Offers", path: "/offers" },
    ];

    navLinks.forEach(({ label, path }) => {
      cy.visit("/");
      cy.get("nav").contains(label).click();
      cy.url().should("include", path);
      cy.takeVisualSnapshot(`nav-${label.toLowerCase()}`);
    });
  });

  it("shows category mega-menu on hover (desktop)", () => {
    cy.viewport(1280, 720);
    cy.get("nav").contains("Categories").trigger("mouseenter");
    cy.contains("View All Categories").should("be.visible");
    cy.takeVisualSnapshot("mega-menu-open");
  });

  it("toggles theme between light and dark", () => {
    cy.get('button[aria-label*="theme"], button[aria-label*="Theme"]').click();
    cy.takeVisualSnapshot("theme-toggled");
  });

  it("opens and uses search modal", () => {
    cy.get('button[aria-label="Search"]').click();
    cy.get('[role="dialog"] input, [cmdk-input]').should("be.visible");
    cy.takeVisualSnapshot("search-modal-open");
    cy.get('[role="dialog"] input, [cmdk-input]').type("beef");
    cy.wait(1000); // debounce
    cy.takeVisualSnapshot("search-results");
  });

  it("opens cart drawer when clicking cart icon", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"], [data-state="open"]')
      .contains(/cart/i)
      .should("be.visible");
    cy.takeVisualSnapshot("cart-drawer-empty");
  });
});

describe("Footer Links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  const footerPages = [
    { text: "About Us", path: "/about" },
    { text: "Contact", path: "/contact" },
    { text: "Careers", path: "/careers" },
    { text: "Blog", path: "/blog" },
    { text: "Help Center", path: "/help" },
    { text: "Shipping", path: "/shipping" },
    { text: "FAQ", path: "/faq" },
    { text: "Privacy Policy", path: "/privacy" },
    { text: "Terms of Service", path: "/terms" },
    { text: "Cookie Policy", path: "/cookies" },
    { text: "Accessibility", path: "/accessibility" },
  ];

  footerPages.forEach(({ text, path }) => {
    it(`navigates to ${text} page`, () => {
      cy.get("footer").contains(text).click();
      cy.url().should("include", path);
      cy.get("h1, h2").should("exist");
      cy.takeVisualSnapshot(`footer-${path.replace("/", "")}`);
    });
  });
});

describe("Mobile Navigation", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.visit("/");
  });

  it("opens mobile menu and navigates", () => {
    cy.get('button[aria-label="Open menu"]').click();
    cy.takeVisualSnapshot("mobile-menu-open");
    cy.contains("Products").click();
    cy.url().should("include", "/products");
  });

  it("shows responsive product grid on mobile", () => {
    cy.visit("/products");
    cy.takeVisualSnapshot("mobile-product-grid");
  });
});
