/// <reference types="cypress" />

describe("Static Pages", () => {
  const pages = [
    { path: "/about", title: /about/i },
    { path: "/contact", title: /contact/i },
    { path: "/careers", title: /career/i },
    { path: "/blog", title: /blog/i },
    { path: "/help", title: /help/i },
    { path: "/shipping", title: /shipping/i },
    { path: "/faq", title: /faq|frequently/i },
    { path: "/privacy", title: /privacy/i },
    { path: "/terms", title: /terms/i },
    { path: "/cookies", title: /cookie/i },
    { path: "/accessibility", title: /accessibility/i },
  ];

  pages.forEach(({ path, title }) => {
    it(`renders ${path} page`, () => {
      cy.visit(path);
      cy.get("h1").invoke("text").should("match", title);
      cy.takeVisualSnapshot(`static-page-${path.replace("/", "")}`);
    });
  });
});

describe("Category Pages", () => {
  it("renders categories page", () => {
    cy.visit("/categories");
    cy.takeVisualSnapshot("categories-page");
    cy.get('[class*="card"], a[href*="/categories/"]').should("have.length.at.least", 1);
  });
});

describe("Brands Page", () => {
  it("renders brands page", () => {
    cy.visit("/brands");
    cy.takeVisualSnapshot("brands-page");
    cy.get('[class*="card"], a[href*="/brands/"]').should("have.length.at.least", 1);
  });
});

describe("Offers Page", () => {
  it("renders offers page", () => {
    cy.visit("/offers");
    cy.takeVisualSnapshot("offers-page");
  });
});

describe("Error Pages", () => {
  it("renders 404 not found page", () => {
    cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });
    cy.takeVisualSnapshot("404-not-found");
    cy.contains(/not found|404/i).should("be.visible");
  });
});
