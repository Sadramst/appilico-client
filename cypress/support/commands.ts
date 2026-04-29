/// <reference types="cypress" />

// ***********************************************
// Custom commands for Appilico E2E tests
// ***********************************************

Cypress.Commands.add("login", (email?: string, password?: string) => {
  const userEmail = email ?? Cypress.env("customerEmail");
  const userPassword = password ?? Cypress.env("customerPassword");

  cy.session([userEmail], () => {
    cy.request("POST", `${Cypress.env("apiUrl")}/auth/login`, {
      email: userEmail,
      password: userPassword,
    }).then((resp) => {
      const { accessToken, refreshToken, user } = resp.body.data;
      window.localStorage.setItem("appilico_access_token", accessToken);
      window.localStorage.setItem("appilico_refresh_token", refreshToken);
      // Store in Zustand persist format so isAuthenticated hydrates correctly
      window.localStorage.setItem(
        "appilico_user",
        JSON.stringify({
          state: {
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          },
          version: 0,
        })
      );
    });
  });
});

Cypress.Commands.add("loginViaUI", (email?: string, password?: string) => {
  const userEmail = email ?? Cypress.env("customerEmail");
  const userPassword = password ?? Cypress.env("customerPassword");

  cy.visit("/login");
  cy.get('input[type="email"], input[name="email"]').clear().type(userEmail);
  cy.get('input[type="password"], input[name="password"]').first().clear().type(userPassword);
  cy.get('button[type="submit"]').click();
  cy.url().should("not.include", "/login");
});

Cypress.Commands.add("loginAsAdmin", () => {
  cy.login(Cypress.env("adminEmail"), Cypress.env("adminPassword"));
});

Cypress.Commands.add("takeVisualSnapshot", (name: string) => {
  cy.wait(500); // let animations settle
  cy.screenshot(name, { capture: "viewport" });
});

// Declare custom commands on the Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      loginViaUI(email?: string, password?: string): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      takeVisualSnapshot(name: string): Chainable<void>;
    }
  }
}

export {};
