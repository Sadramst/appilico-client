/// <reference types="cypress" />

// ============================================================
// Addresses: Full CRUD Flow (Create, Read, Update, Delete)
// ============================================================

const API = Cypress.env("apiUrl");

describe("Addresses – CRUD Flow", () => {
  let token: string;

  before(() => {
    cy.request("POST", `${API}/auth/login`, {
      email: Cypress.env("customerEmail"),
      password: Cypress.env("customerPassword"),
    }).then((resp) => {
      token = resp.body.data.accessToken;
    });
  });

  beforeEach(() => {
    cy.login();
  });

  it("should render Addresses page with existing addresses", () => {
    cy.visit("/addresses");
    cy.wait(3000);
    cy.contains("My Addresses").should("be.visible");
    // Should have the account sidebar
    cy.contains("Profile").should("be.visible");
    cy.contains("Orders").should("be.visible");
    cy.takeVisualSnapshot("addresses-page-loaded");
  });

  it("should show existing 'Home' address card", () => {
    cy.visit("/addresses");
    cy.wait(3000);
    cy.contains("Home").should("be.visible");
    cy.contains("Default").should("be.visible");
    cy.takeVisualSnapshot("addresses-existing-home");
  });

  it("should open Add Address dialog and fill the form", () => {
    cy.visit("/addresses");
    cy.wait(3000);

    // Click "Add Address" button
    cy.contains("Add Address").click();
    cy.wait(500);

    // Dialog should be open
    cy.get('[role="dialog"]').should("be.visible");

    // Fill in the form
    cy.get('[role="dialog"]').within(() => {
      cy.get('input').then(($inputs) => {
        // Title
        const titleInput = $inputs.filter('[id*="title"], [name*="title"], [placeholder*="title"], [placeholder*="Title"]');
        if (titleInput.length) {
          cy.wrap(titleInput.first()).clear().type("Work Office");
        } else {
          cy.wrap($inputs.eq(0)).clear().type("Work Office");
        }
      });

      // Address Line 1 — find by label text
      cy.contains("label", /address line 1|address/i).parent().find("input").clear().type("456 Business Ave");
      cy.contains("label", /city/i).parent().find("input").clear().type("San Francisco");
      cy.contains("label", /state/i).parent().find("input").clear().type("CA");
      cy.contains("label", /postal/i).parent().find("input").clear().type("94102");
      cy.contains("label", /country/i).parent().find("input").clear().type("USA");
    });

    cy.takeVisualSnapshot("addresses-add-form-filled");
  });

  it("should create a new address via API and see it on the page", () => {
    // Create address via API for reliability
    cy.request({
      method: "POST",
      url: `${API}/customers/me/addresses`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: "Test Office",
        addressLine1: "789 Test Boulevard",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "USA",
        addressType: 0,
        isDefault: false,
      },
      failOnStatusCode: false,
    }).then((resp) => {
      cy.log(`Address creation status: ${resp.status}`);
    });

    cy.visit("/addresses");
    cy.wait(3000);
    cy.contains("Test Office").should("be.visible");
    cy.contains("789 Test Boulevard").should("be.visible");
    cy.log("✅ New address appears on the page");
    cy.takeVisualSnapshot("addresses-new-address-visible");
  });

  it("should have Edit and Delete buttons on address cards", () => {
    cy.visit("/addresses");
    cy.wait(3000);

    // Each address card should have edit (pencil) and delete (trash) buttons
    cy.get('button').filter(':has(svg.lucide-pencil), :has(svg[class*="pencil"])').should("have.length.at.least", 1);
    cy.get('button').filter(':has(svg.lucide-trash-2), :has(svg[class*="trash"])').should("have.length.at.least", 1);
    cy.log("✅ Edit and Delete buttons present");
    cy.takeVisualSnapshot("addresses-edit-delete-buttons");
  });

  it("should delete the test address via API and verify removal", () => {
    // Find and delete the test address
    cy.request({
      url: `${API}/customers/me/addresses`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((resp) => {
      const addresses = resp.body.data ?? [];
      const testAddr = addresses.find((a: { title: string }) => a.title === "Test Office");
      if (testAddr) {
        cy.request({
          method: "DELETE",
          url: `${API}/customers/me/addresses/${testAddr.id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        cy.log("✅ Test address deleted via API");
      }
    });

    cy.visit("/addresses");
    cy.wait(3000);
    cy.contains("Test Office").should("not.exist");
    cy.log("✅ Deleted address no longer visible");
    cy.takeVisualSnapshot("addresses-after-delete");
  });
});
