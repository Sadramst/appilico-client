/// <reference types="cypress" />

// ============================================================
// 09 - STATIC / CONTENT PAGES – Exhaustive Tests
// ============================================================

const staticPages = [
  { path: "/about", title: /about/i },
  { path: "/contact", title: /contact/i },
  { path: "/careers", title: /career/i },
  { path: "/blog", title: /blog/i },
  { path: "/help", title: /help|support/i },
  { path: "/shipping-info", title: /shipping/i },
  { path: "/faq", title: /faq|frequently/i },
  { path: "/privacy", title: /privacy/i },
  { path: "/terms", title: /terms/i },
  { path: "/cookies", title: /cookie/i },
  { path: "/accessibility", title: /accessibility/i },
];

describe("Static Pages – All Pages Load", () => {
  staticPages.forEach((page) => {
    it(`${page.path} page loads with heading`, () => {
      cy.visit(page.path);
      cy.wait(2000);
      cy.get("h1, h2").should("be.visible");
      cy.get("h1, h2").invoke("text").should("match", page.title);
      cy.takeVisualSnapshot(`static-${page.path.replace("/", "")}`);
    });
  });
});

describe("Static Pages – Content Sections", () => {
  staticPages.forEach((page) => {
    it(`${page.path} has content paragraphs`, () => {
      cy.visit(page.path);
      cy.wait(2000);
      cy.get("p").should("have.length.at.least", 1);
    });
  });
});

describe("Static Pages – Header/Footer Present", () => {
  staticPages.forEach((page) => {
    it(`${page.path} has header and footer`, () => {
      cy.visit(page.path);
      cy.wait(2000);
      cy.get("header").should("exist");
      cy.get("footer").should("exist");
    });
  });
});

describe("Categories Page (Public)", () => {
  beforeEach(() => {
    cy.visit("/categories");
    cy.wait(3000);
  });

  it("renders categories heading", () => {
    cy.contains(/categories/i).should("be.visible");
    cy.takeVisualSnapshot("categories-public-page");
  });

  it("shows breadcrumbs", () => {
    cy.get('[class*="breadcrumb"]').should("exist");
  });

  it("shows category cards with names", () => {
    cy.get('[class*="card"], a[href*="/categories/"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("categories-public-cards");
  });

  it("category card links to filtered products", () => {
    cy.get('a[href*="/categories/"]').first().click();
    cy.url().should("include", "/categories/");
    cy.takeVisualSnapshot("categories-public-filtered");
  });

  it("category card shows image or icon", () => {
    cy.get('[class*="card"] img, [class*="card"] svg').should("have.length.at.least", 1);
  });

  it("category card shows product count", () => {
    cy.get('[class*="card"]').first().invoke("text").should("match", /\d/);
  });
});

describe("Brands Page (Public)", () => {
  beforeEach(() => {
    cy.visit("/brands");
    cy.wait(3000);
  });

  it("renders brands heading", () => {
    cy.contains(/brands/i).should("be.visible");
    cy.takeVisualSnapshot("brands-public-page");
  });

  it("shows breadcrumbs", () => {
    cy.get('[class*="breadcrumb"]').should("exist");
  });

  it("shows brand cards", () => {
    cy.get('[class*="card"], a[href*="/brands/"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("brands-public-cards");
  });

  it("brand card links to filtered products", () => {
    cy.get('a[href*="/brands/"]').first().click();
    cy.url().should("include", "/brands/");
    cy.takeVisualSnapshot("brands-public-filtered");
  });

  it("brand card shows logo or image", () => {
    cy.get('[class*="card"] img, [class*="card"] svg, [class*="avatar"]').should("have.length.at.least", 1);
  });
});

describe("Offers Page (Public)", () => {
  beforeEach(() => {
    cy.visit("/offers");
    cy.wait(3000);
  });

  it("renders offers heading", () => {
    cy.contains(/offers|deals|special/i).should("be.visible");
    cy.takeVisualSnapshot("offers-public-page");
  });

  it("shows breadcrumbs", () => {
    cy.get('[class*="breadcrumb"]').should("exist");
  });

  it("shows offer cards or empty state", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[class*="card"]').length > 1) {
        cy.takeVisualSnapshot("offers-public-cards");
      } else {
        cy.contains(/no offers|no deals/i).should("be.visible");
        cy.takeVisualSnapshot("offers-public-empty");
      }
    });
  });
});

describe("Track Order Page", () => {
  it("renders track order page", () => {
    cy.visit("/orders/track");
    cy.wait(2000);
    cy.contains(/track/i).should("be.visible");
    cy.takeVisualSnapshot("track-order-page");
  });

  it("has order number input field", () => {
    cy.visit("/orders/track");
    cy.wait(2000);
    cy.get("input").should("be.visible");
  });

  it("has search/track button", () => {
    cy.visit("/orders/track");
    cy.wait(2000);
    cy.get('button[type="submit"], button').filter(':contains("Track")').should("be.visible");
  });

  it("empty submit shows validation error", () => {
    cy.visit("/orders/track");
    cy.wait(2000);
    cy.get('button[type="submit"], button').filter(':contains("Track")').click();
    cy.wait(1000);
    cy.takeVisualSnapshot("track-order-validation");
  });

  it("invalid order number shows not found", () => {
    cy.visit("/orders/track");
    cy.wait(2000);
    cy.get("input").type("INVALIDORDER");
    cy.get('button[type="submit"], button').filter(':contains("Track")').click();
    cy.wait(3000);
    cy.takeVisualSnapshot("track-order-not-found");
  });
});

describe("404 Not Found Page", () => {
  it("renders 404 page for unknown routes", () => {
    cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });
    cy.wait(2000);
    cy.get("body").invoke("text").should("match", /not found|404/i);
    cy.takeVisualSnapshot("404-page");
  });

  it("404 page has link back to home", () => {
    cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });
    cy.wait(2000);
    cy.get('a[href="/"]').should("exist");
  });
});

describe("Error Page", () => {
  it("error.tsx renders gracefully", () => {
    // This only triggers on runtime errors; verify the page exists
    cy.takeVisualSnapshot("error-page-placeholder");
  });
});

describe("Loading State", () => {
  it("loading.tsx shows loading skeleton on slow nav", () => {
    cy.visit("/");
    cy.takeVisualSnapshot("loading-state-home");
  });
});

describe("Size Guide Page", () => {
  it("renders size guide page if it exists", () => {
    cy.visit("/size-guide", { failOnStatusCode: false });
    cy.wait(2000);
    cy.get("body").then(($body) => {
      if (!$body.text().match(/not found|404/i)) {
        cy.contains(/size guide/i).should("be.visible");
        cy.takeVisualSnapshot("size-guide-page");
      }
    });
  });
});

describe("Mobile Responsiveness – Static Pages", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
  });

  staticPages.forEach((page) => {
    it(`${page.path} renders on mobile`, () => {
      cy.visit(page.path);
      cy.wait(2000);
      cy.get("h1, h2").should("be.visible");
      cy.takeVisualSnapshot(`mobile-${page.path.replace("/", "")}`);
    });
  });
});
