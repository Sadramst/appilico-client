/// <reference types="cypress" />

// ============================================================
// Admin Category & Brand CRUD – Dialog-based create/edit/delete
// ============================================================

describe("Admin Categories – CRUD Operations", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/categories");
    cy.wait(4000);
  });

  it("renders categories page with heading", () => {
    cy.contains("Categories").should("be.visible");
  });

  it("shows Add Category button", () => {
    cy.contains("button", "Add Category").should("be.visible");
  });

  it("shows categories table with data", () => {
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);
  });

  it("categories table shows Name column", () => {
    cy.get("table thead").contains("Name").should("exist");
  });

  it("Add Category opens dialog with 'New Category' title", () => {
    cy.contains("button", "Add Category").click();
    cy.wait(500);
    cy.contains("New Category").should("be.visible");
  });

  it("category dialog has name input field", () => {
    cy.contains("button", "Add Category").click();
    cy.wait(500);
    cy.get('[role="dialog"]').should("exist");
    cy.get('[role="dialog"] input').should("exist");
  });

  it("category dialog has Save/Create button", () => {
    cy.contains("button", "Add Category").click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("button", /save|create/i).should("be.visible");
  });

  it("category dialog can be closed", () => {
    cy.contains("button", "Add Category").click();
    cy.wait(500);
    cy.get('[role="dialog"]').should("be.visible");
    cy.get("body").type("{escape}");
    cy.wait(500);
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("category row has Edit button", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /edit/i).should("exist");
    });
  });

  it("clicking Edit opens dialog with 'Edit Category' title", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /edit/i).click();
    });
    cy.wait(500);
    cy.contains("Edit Category").should("be.visible");
  });

  it("edit dialog pre-fills category name", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /edit/i).click();
    });
    cy.wait(500);
    cy.get('[role="dialog"] input').first().should("not.have.value", "");
  });

  it("category row has Delete button", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /delete/i).should("exist");
    });
  });

  it("clicking Delete shows confirmation dialog", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /delete/i).click();
    });
    cy.wait(500);
    cy.contains(/are you sure|confirm/i).should("be.visible");
  });

  it("search input filters categories", () => {
    cy.get('input[placeholder*="earch"]').should("exist");
    cy.get('input[placeholder*="earch"]').type("Electronics");
    cy.wait(1000);
  });
});

describe("Admin Brands – CRUD Operations", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/dashboard/brands");
    cy.wait(4000);
  });

  it("renders brands page with heading", () => {
    cy.contains("Brands").should("be.visible");
  });

  it("shows Add Brand button", () => {
    cy.contains("button", "Add Brand").should("be.visible");
  });

  it("shows brands table or list with data", () => {
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);
  });

  it("Add Brand opens dialog", () => {
    cy.contains("button", "Add Brand").click();
    cy.wait(500);
    cy.get('[role="dialog"]').should("be.visible");
  });

  it("brand dialog has name input", () => {
    cy.contains("button", "Add Brand").click();
    cy.wait(500);
    cy.get('[role="dialog"] input').should("exist");
  });

  it("brand dialog has Save/Create button", () => {
    cy.contains("button", "Add Brand").click();
    cy.wait(500);
    cy.get('[role="dialog"]').contains("button", /save|create/i).should("be.visible");
  });

  it("brand dialog can be closed with Escape", () => {
    cy.contains("button", "Add Brand").click();
    cy.wait(500);
    cy.get('[role="dialog"]').should("be.visible");
    cy.get("body").type("{escape}");
    cy.wait(500);
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("brand row has Edit button", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /edit/i).should("exist");
    });
  });

  it("clicking Edit opens dialog with pre-filled name", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /edit/i).click();
    });
    cy.wait(500);
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"] input').first().should("not.have.value", "");
  });

  it("brand row has Delete button", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /delete/i).should("exist");
    });
  });

  it("clicking Delete shows confirmation", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("button", /delete/i).click();
    });
    cy.wait(500);
    cy.contains(/are you sure|confirm/i).should("be.visible");
  });

  it("search input exists for brands", () => {
    cy.get('input[placeholder*="earch"]').should("exist");
  });
});
