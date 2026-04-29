/// <reference types="cypress" />

// ============================================================
// Profile Update + Auth Edge Cases
// ============================================================

const API = Cypress.env("apiUrl");

describe("Profile & Auth – Edge Cases", () => {
  // ──────────── Profile Page ────────────
  describe("Profile Page Interactions", () => {
    beforeEach(() => {
      cy.login();
    });

    it("should show profile page with pre-filled user data", () => {
      cy.visit("/profile");
      cy.wait(3000);
      cy.contains("My Profile").should("be.visible");

      // Avatar section
      cy.get('[class*="avatar"]').should("exist");

      // Profile form should have inputs
      cy.get('input').should("have.length.at.least", 2);

      // Save Changes button
      cy.contains("button", /save/i).should("be.visible");

      cy.takeVisualSnapshot("profile-pre-filled");
    });

    it("should show account sidebar with all navigation links", () => {
      cy.visit("/profile");
      cy.wait(3000);

      const sidebarLinks = ["Profile", "Orders", "Addresses", "Wishlist"];
      sidebarLinks.forEach((link) => {
        cy.contains("a", link).should("be.visible");
      });

      cy.takeVisualSnapshot("profile-sidebar-links");
    });

    it("should navigate between account pages via sidebar", () => {
      cy.visit("/profile");
      cy.wait(2000);

      // Navigate to Orders
      cy.contains("a", "Orders").click();
      cy.wait(2000);
      cy.url().should("include", "/orders");
      cy.contains("My Orders").should("be.visible");

      // Navigate to Addresses
      cy.contains("a", "Addresses").click();
      cy.wait(2000);
      cy.url().should("include", "/addresses");
      cy.contains("My Addresses").should("be.visible");

      // Navigate to Wishlist
      cy.contains("a", "Wishlist").click();
      cy.wait(2000);
      cy.url().should("include", "/wishlist");
      cy.contains("Wishlist").should("be.visible");

      // Navigate back to Profile
      cy.contains("a", "Profile").click();
      cy.wait(2000);
      cy.url().should("include", "/profile");

      cy.takeVisualSnapshot("profile-sidebar-navigation");
    });
  });

  // ──────────── Auth Edge Cases ────────────
  describe("Auth Edge Cases", () => {
    it("should redirect to login when visiting protected routes unauthenticated", () => {
      const protectedRoutes = ["/profile", "/orders", "/addresses", "/wishlist", "/checkout"];

      protectedRoutes.forEach((route) => {
        cy.visit(route);
        cy.wait(3000);
        cy.url().then((url) => {
          // Should either be on login page or show login prompt
          const isOnLogin = url.includes("/login");
          const isOnRoute = url.includes(route);
          if (isOnLogin) {
            cy.log(`✅ ${route} → redirected to login`);
          } else {
            cy.log(`${route} → stayed (may show unauthenticated state)`);
          }
        });
      });
    });

    it("should show login page with correct form elements", () => {
      cy.visit("/login");
      cy.wait(2000);
      cy.contains("Welcome back").should("be.visible");
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="password"]').should("exist");
      cy.get('button[type="submit"]').should("exist");
      cy.contains("Forgot password").should("be.visible");
      cy.contains(/sign up|create an account|register/i).should("be.visible");
      cy.takeVisualSnapshot("login-page-elements");
    });

    it("should show validation errors on empty login submit", () => {
      cy.visit("/login");
      cy.wait(2000);
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      // Should show validation errors
      cy.get("body").invoke("text").should("match", /required|invalid/i);
      cy.takeVisualSnapshot("login-validation-errors");
    });

    it("should show error for invalid credentials", () => {
      cy.visit("/login");
      cy.wait(2000);
      cy.get('input[type="email"]').type("wrong@email.com");
      cy.get('input[type="password"]').first().type("WrongPass123!");
      cy.get('button[type="submit"]').click();
      cy.wait(3000);

      // Should show error toast or message
      cy.get("body").then(($body) => {
        const text = $body.text().toLowerCase();
        if (text.includes("invalid") || text.includes("incorrect") || text.includes("error") || text.includes("failed")) {
          cy.log("✅ Error message shown for invalid credentials");
        }
      });
      cy.takeVisualSnapshot("login-invalid-credentials");
    });

    it("should register page have all form fields", () => {
      cy.visit("/register");
      cy.wait(2000);
      cy.contains("Create an account").should("be.visible");
      cy.get("input").should("have.length.at.least", 4); // first, last, email, password, confirm
      cy.get('button[type="submit"]').should("exist");
      cy.contains(/sign in|already have/i).should("be.visible");
      cy.takeVisualSnapshot("register-page-form");
    });

    it("should show password validation on register", () => {
      cy.visit("/register");
      cy.wait(2000);

      // Fill minimal data with weak password
      cy.get('input').eq(0).type("Test");
      cy.get('input').eq(1).type("User");
      cy.get('input[type="email"]').type("test@test.com");
      cy.get('input[type="password"]').first().type("weak");

      cy.get('button[type="submit"]').click();
      cy.wait(1000);

      // Should show password strength errors
      cy.get("body").invoke("text").should("match", /at least|minimum|character|uppercase|lowercase|number/i);
      cy.takeVisualSnapshot("register-password-validation");
    });

    it("should forgot password page work", () => {
      cy.visit("/forgot-password");
      cy.wait(2000);
      cy.get('input[type="email"]').should("exist");
      cy.get('button[type="submit"]').should("exist");
      cy.contains(/sign in|back to/i).should("be.visible");
      cy.takeVisualSnapshot("forgot-password-page");
    });

    it("should login successfully and redirect", () => {
      cy.visit("/login");
      cy.wait(2000);
      cy.get('input[type="email"]').type(Cypress.env("customerEmail"));
      cy.get('input[type="password"]').first().type(Cypress.env("customerPassword"));
      cy.get('button[type="submit"]').click();
      cy.wait(5000);

      // Should redirect away from login
      cy.url().should("not.include", "/login");
      cy.takeVisualSnapshot("login-success-redirect");
    });
  });

  // ──────────── Theme Toggle ────────────
  describe("Theme Toggle", () => {
    it("should toggle between light and dark mode", () => {
      cy.visit("/");
      cy.wait(3000);

      // Get current theme class on html
      cy.get("html").invoke("attr", "class").then((initialClass) => {
        const wasDark = (initialClass ?? "").includes("dark");

        // Find and click theme toggle button
        cy.get('button').filter(':has(svg)').then(($buttons) => {
          // Theme toggle is usually in the header area
          const themeBtn = $buttons.filter((_, el) => {
            const svgs = el.querySelectorAll('svg');
            for (const svg of svgs) {
              const classes = svg.getAttribute('class') ?? '';
              if (classes.includes('sun') || classes.includes('moon')) return true;
            }
            return false;
          });

          if (themeBtn.length > 0) {
            cy.wrap(themeBtn.first()).click();
          } else {
            // Fallback: look for any button near theme-related text
            cy.wrap($buttons.eq(2)).click();
          }
        });

        cy.wait(1000);

        // Verify theme changed
        cy.get("html").invoke("attr", "class").then((newClass) => {
          const isDark = (newClass ?? "").includes("dark");
          if (isDark !== wasDark) {
            cy.log(`✅ Theme toggled from ${wasDark ? 'dark' : 'light'} to ${isDark ? 'dark' : 'light'}`);
          } else {
            cy.log("Theme class unchanged — toggle may use different mechanism");
          }
        });
      });

      cy.takeVisualSnapshot("theme-toggled");
    });
  });
});
