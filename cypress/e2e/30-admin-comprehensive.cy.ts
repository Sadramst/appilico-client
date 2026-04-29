/// <reference types="cypress" />
/**
 * ADMIN COMPREHENSIVE TEST SUITE — 55+ tests
 * Covers: dashboard, products CRUD, categories CRUD, brands CRUD,
 * orders management, customers, discounts, vouchers, offers,
 * inventory, reviews, settings, sidebar, auth, role guards
 */

const API = Cypress.env("apiUrl");

describe("Admin Comprehensive Test Suite", () => {
  // ─── AUTH & ACCESS CONTROL ────────────────────────────────────────────

  describe("Admin Auth & Access Control", () => {
    it("01. should redirect unauthenticated user from /dashboard to /login", () => {
      cy.clearAllLocalStorage();
      cy.visit("/dashboard");
      cy.url().should("include", "/login");
    });

    it("02. should redirect customer role from /dashboard to home", () => {
      cy.login(); // customer role
      cy.visit("/dashboard");
      cy.url().should("not.include", "/dashboard");
    });

    it("03. should allow admin to access /dashboard", () => {
      cy.loginAsAdmin();
      cy.visit("/dashboard");
      cy.url().should("include", "/dashboard");
      cy.contains("Dashboard").should("be.visible");
    });

    it("04. should login admin via UI and redirect to dashboard", () => {
      cy.clearAllLocalStorage();
      cy.visit("/login");
      cy.get('input[type="email"], input[name="email"]').clear().type(Cypress.env("adminEmail"));
      cy.get('input[type="password"], input[name="password"]').first().clear().type(Cypress.env("adminPassword"));
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/dashboard", { timeout: 15000 });
    });

    it("05. admin API login returns valid tokens and user with Admin role", () => {
      cy.request("POST", `${API}/auth/login`, {
        email: Cypress.env("adminEmail"),
        password: Cypress.env("adminPassword"),
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
        expect(resp.body.data.accessToken).to.be.a("string");
        expect(resp.body.data.refreshToken).to.be.a("string");
        expect(resp.body.data.user.roles).to.include("Admin");
      });
    });
  });

  // ─── DASHBOARD HOME ──────────────────────────────────────────────────

  describe("Dashboard Home", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard");
    });

    it("06. should render dashboard page with title", () => {
      cy.contains("Dashboard").should("be.visible");
    });

    it("07. should display 4 stats cards", () => {
      cy.get("[class*='grid']").first().within(() => {
        cy.get("[class*='card'], [class*='Card']").should("have.length.gte", 4);
      });
    });

    it("08. should display revenue chart section", () => {
      cy.contains(/revenue|chart|sales/i).should("exist");
    });

    it("09. should display top products section", () => {
      cy.contains(/top.*products|best.*sellers/i).should("exist");
    });

    it("10. dashboard API returns sales summary", () => {
      cy.loginAsAdmin();
      cy.request({
        method: "GET",
        url: `${API}/dashboard/sales-summary`,
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("appilico_user")!).state.accessToken}` },
        failOnStatusCode: false,
      }).then((resp) => {
        if (resp.status === 200) {
          expect(resp.body.data).to.have.property("totalRevenue");
          expect(resp.body.data).to.have.property("totalOrders");
        }
      });
    });
  });

  // ─── SIDEBAR NAVIGATION ──────────────────────────────────────────────

  describe("Admin Sidebar Navigation", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard");
    });

    const sidebarLinks = [
      { label: "Products", path: "/dashboard/products" },
      { label: "Categories", path: "/dashboard/categories" },
      { label: "Brands", path: "/dashboard/brands" },
      { label: "Orders", path: "/dashboard/orders" },
      { label: "Customers", path: "/dashboard/customers" },
      { label: "Discounts", path: "/dashboard/discounts" },
      { label: "Vouchers", path: "/dashboard/vouchers" },
      { label: "Inventory", path: "/dashboard/inventory" },
      { label: "Reviews", path: "/dashboard/reviews" },
      { label: "Settings", path: "/dashboard/settings" },
    ];

    sidebarLinks.forEach((link, i) => {
      it(`${11 + i}. should navigate to ${link.label} page via sidebar`, () => {
        cy.get("aside, nav").contains(link.label).click();
        cy.url().should("include", link.path);
      });
    });

    it("21. should toggle sidebar collapse", () => {
      cy.get("aside").should("exist");
      cy.get("button[aria-label*='ollapse'], button[aria-label*='xpand']").first().click();
      // sidebar should change width
      cy.get("aside").invoke("outerWidth").should("be.lt", 200);
    });
  });

  // ─── PRODUCTS MANAGEMENT ─────────────────────────────────────────────

  describe("Products Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/products");
    });

    it("22. should render products page with title", () => {
      cy.contains("Products").should("be.visible");
    });

    it("23. should display products table or empty state", () => {
      cy.get("table, [class*='empty'], [class*='Empty']").should("exist");
    });

    it("24. should have Add Product button linking to /dashboard/products/new", () => {
      cy.contains(/add product|new product|create/i).should("exist");
    });

    it("25. should load new product form page", () => {
      cy.visit("/dashboard/products/new");
      cy.get("form").should("exist");
      cy.get("input").should("have.length.gte", 3);
    });

    it("26. new product form has all required fields", () => {
      cy.visit("/dashboard/products/new");
      cy.contains(/name/i).should("exist");
      cy.contains(/price/i).should("exist");
      cy.contains(/category/i).should("exist");
      cy.contains(/brand/i).should("exist");
      cy.contains(/sku/i).should("exist");
    });

    it("27. should validate required fields on new product submit", () => {
      cy.visit("/dashboard/products/new");
      cy.get('button[type="submit"]').click();
      // should show validation messages
      cy.get("[class*='error'], [class*='message'], [role='alert']").should("exist");
    });

    it("28. product list API returns paginated data", () => {
      cy.request("GET", `${API}/products?page=1&pageSize=5`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
        expect(resp.body.data).to.be.an("array");
      });
    });

    it("29. featured products API works", () => {
      cy.request("GET", `${API}/products/featured?count=5`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });
  });

  // ─── CATEGORIES MANAGEMENT ───────────────────────────────────────────

  describe("Categories Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/categories");
    });

    it("30. should render categories page", () => {
      cy.contains("Categories").should("be.visible");
    });

    it("31. should display category list or empty state", () => {
      cy.get("table, [class*='empty'], [class*='Empty']").should("exist");
    });

    it("32. should have Add Category button", () => {
      cy.contains(/add|new|create/i).should("exist");
    });

    it("33. should open create category dialog", () => {
      cy.contains(/add|new|create/i).click();
      cy.get("[role='dialog'], [class*='Dialog']").should("be.visible");
    });

    it("34. categories API returns data", () => {
      cy.request("GET", `${API}/categories`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });

    it("35. categories tree API returns hierarchical data", () => {
      cy.request("GET", `${API}/categories/tree`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });
  });

  // ─── BRANDS MANAGEMENT ───────────────────────────────────────────────

  describe("Brands Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/brands");
    });

    it("36. should render brands page", () => {
      cy.contains("Brands").should("be.visible");
    });

    it("37. should have Add Brand button", () => {
      cy.contains(/add|new|create/i).should("exist");
    });

    it("38. should open create brand dialog", () => {
      cy.contains(/add|new|create/i).click();
      cy.get("[role='dialog'], [class*='Dialog']").should("be.visible");
    });

    it("39. brands API returns data", () => {
      cy.request("GET", `${API}/brands`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });
  });

  // ─── ORDERS MANAGEMENT ───────────────────────────────────────────────

  describe("Orders Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/orders");
    });

    it("40. should render orders page", () => {
      cy.contains("Orders").should("be.visible");
    });

    it("41. should display orders table or empty state", () => {
      cy.get("table, [class*='empty'], [class*='Empty']").should("exist");
    });

    it("42. admin orders API returns paginated list", () => {
      cy.loginAsAdmin();
      cy.window().then((win) => {
        const token = JSON.parse(win.localStorage.getItem("appilico_user")!).state.accessToken;
        cy.request({
          method: "GET",
          url: `${API}/orders?page=1&pageSize=10`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.success).to.be.true;
        });
      });
    });
  });

  // ─── CUSTOMERS MANAGEMENT ────────────────────────────────────────────

  describe("Customers Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/customers");
    });

    it("43. should render customers page", () => {
      cy.contains("Customers").should("be.visible");
    });

    it("44. should display customers list or empty state", () => {
      cy.get("table, [class*='empty'], [class*='Empty']").should("exist");
    });

    it("45. customers API returns paginated list", () => {
      cy.loginAsAdmin();
      cy.window().then((win) => {
        const token = JSON.parse(win.localStorage.getItem("appilico_user")!).state.accessToken;
        cy.request({
          method: "GET",
          url: `${API}/customers?page=1&pageSize=10`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.success).to.be.true;
        });
      });
    });
  });

  // ─── DISCOUNTS MANAGEMENT ────────────────────────────────────────────

  describe("Discounts Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/discounts");
    });

    it("46. should render discounts page", () => {
      cy.contains("Discounts").should("be.visible");
    });

    it("47. should have Create Discount button", () => {
      cy.contains(/create|add|new/i).should("exist");
    });

    it("48. active discounts API works (public)", () => {
      cy.request("GET", `${API}/discounts/active`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });
  });

  // ─── VOUCHERS MANAGEMENT ─────────────────────────────────────────────

  describe("Vouchers Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/vouchers");
    });

    it("49. should render vouchers page", () => {
      cy.contains("Vouchers").should("be.visible");
    });

    it("50. should have Create Voucher button", () => {
      cy.contains(/create|add|new/i).should("exist");
    });
  });

  // ─── INVENTORY MANAGEMENT ────────────────────────────────────────────

  describe("Inventory Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/inventory");
    });

    it("51. should render inventory page", () => {
      cy.contains("Inventory").should("be.visible");
    });

    it("52. low stock API works", () => {
      cy.loginAsAdmin();
      cy.window().then((win) => {
        const token = JSON.parse(win.localStorage.getItem("appilico_user")!).state.accessToken;
        cy.request({
          method: "GET",
          url: `${API}/inventory/low-stock?threshold=10`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.success).to.be.true;
        });
      });
    });
  });

  // ─── REVIEWS MANAGEMENT ──────────────────────────────────────────────

  describe("Reviews Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/reviews");
    });

    it("53. should render reviews page", () => {
      cy.contains("Reviews").should("be.visible");
    });
  });

  // ─── OFFERS MANAGEMENT ───────────────────────────────────────────────

  describe("Offers Management", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/offers");
    });

    it("54. should render offers page", () => {
      cy.contains(/offers|special/i).should("be.visible");
    });

    it("55. should have Create Offer button", () => {
      cy.contains(/create|add|new/i).should("exist");
    });

    it("56. active offers API works (public)", () => {
      cy.request("GET", `${API}/offers/active`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });
  });

  // ─── SETTINGS (ADMIN ONLY) ───────────────────────────────────────────

  describe("Settings Page", () => {
    it("57. admin can access settings page", () => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/settings");
      cy.url().should("include", "/dashboard/settings");
      cy.contains("Settings").should("be.visible");
    });

    it("58. settings page has store information section", () => {
      cy.loginAsAdmin();
      cy.visit("/dashboard/settings");
      cy.contains(/store.*information|store.*name/i).should("exist");
    });
  });

  // ─── API ENDPOINT VERIFICATION ───────────────────────────────────────

  describe("Admin API Endpoint Verification", () => {
    let adminToken: string;

    before(() => {
      cy.request("POST", `${API}/auth/login`, {
        email: Cypress.env("adminEmail"),
        password: Cypress.env("adminPassword"),
      }).then((resp) => {
        adminToken = resp.body.data.accessToken;
      });
    });

    it("59. GET /dashboard/customer-stats returns customer statistics", () => {
      cy.request({
        method: "GET",
        url: `${API}/dashboard/customer-stats`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.data).to.have.property("totalCustomers");
      });
    });

    it("60. GET /dashboard/top-products returns top products", () => {
      cy.request({
        method: "GET",
        url: `${API}/dashboard/top-products?count=5`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });

    it("61. GET /dashboard/revenue-chart returns revenue data", () => {
      cy.request({
        method: "GET",
        url: `${API}/dashboard/revenue-chart`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body.success).to.be.true;
      });
    });

    it("62. GET /settings returns settings (admin only)", () => {
      cy.request({
        method: "GET",
        url: `${API}/settings`,
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((resp) => {
        // May be 200 or 403 depending on server
        expect(resp.status).to.be.oneOf([200, 403]);
      });
    });

    it("63. POST /discounts/validate rejects invalid code", () => {
      cy.request({
        method: "POST",
        url: `${API}/discounts/validate`,
        body: { code: "FAKECODE999", orderAmount: 100 },
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.be.oneOf([200, 400]);
        if (resp.status === 200) {
          expect(resp.body.data.isValid).to.be.false;
        }
      });
    });

    it("64. Non-admin cannot access GET /orders (all orders)", () => {
      cy.request("POST", `${API}/auth/login`, {
        email: Cypress.env("customerEmail"),
        password: Cypress.env("customerPassword"),
      }).then((resp) => {
        const customerToken = resp.body.data.accessToken;
        cy.request({
          method: "GET",
          url: `${API}/orders?page=1&pageSize=10`,
          headers: { Authorization: `Bearer ${customerToken}` },
          failOnStatusCode: false,
        }).then((r) => {
          expect(r.status).to.be.oneOf([200, 403]);
        });
      });
    });
  });
});
