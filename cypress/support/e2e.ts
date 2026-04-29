/// <reference types="cypress" />

import "./commands";

// Prevent uncaught exceptions from failing tests (3rd party scripts, etc.)
Cypress.on("uncaught:exception", () => false);
