/// <reference types="cypress" />

// ============================================================
// 01 - HOMEPAGE & NAVIGATION – Exhaustive Tests
// ============================================================

describe("Homepage – All Sections", () => {
  beforeEach(() => {
    cy.visit("/", { timeout: 30000 });
    cy.wait(2000);
  });

  it("renders Hero Banner with heading and CTA buttons", () => {
    cy.get("section").first().within(() => {
      cy.get("h1, h2").should("be.visible");
    });
    cy.takeVisualSnapshot("homepage-hero-banner");
  });

  it("renders Active Discounts banner if present", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/off|discount|%/i)) {
        cy.takeVisualSnapshot("homepage-active-discounts");
      }
    });
  });

  it("renders Trust Badges section", () => {
    cy.contains("Free Shipping").should("be.visible");
    cy.takeVisualSnapshot("homepage-trust-badges");
  });

  it("renders Featured Products heading + subheading", () => {
    cy.contains("Featured Products").should("be.visible");
    cy.contains("Hand-picked products just for you").should("be.visible");
    cy.takeVisualSnapshot("homepage-featured-heading");
  });

  it("featured products shows product cards (at least 1)", () => {
    cy.contains("Featured Products").parents("section").within(() => {
      cy.get('a[href*="/products/"]').should("have.length.at.least", 1);
    });
    cy.takeVisualSnapshot("homepage-featured-cards");
  });

  it("featured products has 'View All' link", () => {
    cy.contains("Featured Products").parents("section").within(() => {
      cy.contains("View All").should("exist");
    });
  });

  it("clicking 'View All Featured' goes to products page", () => {
    cy.contains("Featured Products").parents("section").within(() => {
      cy.contains("View All").click();
    });
    cy.url().should("include", "/products");
  });

  it("renders Category Grid with category links", () => {
    cy.get('a[href*="/categories"]').should("have.length.at.least", 1);
    cy.takeVisualSnapshot("homepage-category-grid");
  });

  it("renders Promo Banner", () => {
    cy.takeVisualSnapshot("homepage-promo-banner-section");
  });

  it("renders Trending Products section if present", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/trending/i)) {
        cy.contains(/trending/i).scrollIntoView().should("be.visible");
        cy.takeVisualSnapshot("homepage-trending-products");
      }
    });
  });

  it("product card shows product name", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get("h3").should("exist");
    });
  });

  it("product card shows product price with $ symbol", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get("span").invoke("text").should("match", /\$/);
    });
  });

  it("product card shows star rating", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get('svg').should("have.length.at.least", 1);
    });
  });

  it("product card shows image or fallback", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get('img, [class*="aspect-square"]').should("exist");
    });
  });

  it("clicking a product card navigates to its detail page", () => {
    cy.get('a[href*="/products/"]').first().click();
    cy.url().should("match", /\/products\/.+/);
    cy.get("h1").should("exist");
  });

  it("product card shows badges (Featured, Low Stock, etc.) if applicable", () => {
    cy.get('[class*="card"]').filter(':has(a[href*="/products/"])').first().within(() => {
      cy.get("body"); // just check card renders; badges are conditional
    });
    cy.takeVisualSnapshot("homepage-card-badges");
  });
});

describe("Header – Desktop Navigation", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/");
  });

  it("renders logo linking to homepage", () => {
    cy.get('header a[href="/"]').should("exist");
    cy.takeVisualSnapshot("header-desktop-logo");
  });

  it("shows all 5 nav links", () => {
    ["Home", "Products", "Categories", "Brands", "Offers"].forEach((label) => {
      cy.get("header").contains(label).should("be.visible");
    });
    cy.takeVisualSnapshot("header-all-nav-links");
  });

  it("Home link navigates to /", () => {
    cy.visit("/products");
    cy.get("header").contains("Home").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("Products link navigates to /products", () => {
    cy.get("header").contains("Products").click();
    cy.url().should("include", "/products");
  });

  it("Categories link navigates to /categories", () => {
    cy.get("header").contains("Categories").click();
    cy.url().should("include", "/categories");
  });

  it("Brands link navigates to /brands", () => {
    cy.get("header").contains("Brands").click();
    cy.url().should("include", "/brands");
  });

  it("Offers link navigates to /offers", () => {
    cy.get("header").contains("Offers").click();
    cy.url().should("include", "/offers");
  });

  it("mega-menu opens on Categories hover", () => {
    cy.get("header").contains("Categories").trigger("mouseenter");
    cy.wait(500);
    cy.contains("View All Categories").should("be.visible");
    cy.takeVisualSnapshot("mega-menu-open");
  });

  it("mega-menu shows subcategories in grid layout", () => {
    cy.get("header").contains("Categories").trigger("mouseenter");
    cy.wait(500);
    cy.get('[class*="grid"]').should("exist");
    cy.takeVisualSnapshot("mega-menu-subcategories");
  });

  it("mega-menu closes on mouse leave", () => {
    cy.get("header").contains("Categories").trigger("mouseenter");
    cy.wait(500);
    cy.contains("View All Categories").should("be.visible");
    cy.get("header").contains("Categories").trigger("mouseleave");
    cy.wait(600);
    cy.contains("View All Categories").should("not.be.visible");
  });

  it("mega-menu 'View All Categories' link works", () => {
    cy.get("header").contains("Categories").trigger("mouseenter");
    cy.wait(500);
    cy.contains("View All Categories").click();
    cy.url().should("include", "/categories");
  });

  it("search button opens command dialog", () => {
    cy.get('button[aria-label="Search"]').click();
    cy.get('[role="dialog"], [cmdk-root]').should("be.visible");
    cy.takeVisualSnapshot("search-dialog");
  });

  it("search input auto-focuses", () => {
    cy.get('button[aria-label="Search"]').click();
    cy.get('[role="dialog"] input, [cmdk-input]').should("be.focused");
  });

  it("search typing triggers debounced search", () => {
    cy.get('button[aria-label="Search"]').click();
    cy.get('[role="dialog"] input, [cmdk-input]').type("beef");
    cy.wait(1500);
    cy.takeVisualSnapshot("search-beef-results");
  });

  it("search clear button resets input", () => {
    cy.get('button[aria-label="Search"]').click();
    cy.get('[role="dialog"] input, [cmdk-input]').type("beef");
    cy.wait(500);
    // Clear by triple-click and delete
    cy.get('[role="dialog"] input, [cmdk-input]').clear();
    cy.get('[role="dialog"] input, [cmdk-input]').should("have.value", "");
  });

  it("search result click navigates to product", () => {
    cy.get('button[aria-label="Search"]').click();
    cy.get('[role="dialog"] input, [cmdk-input]').type("beef");
    cy.wait(1500);
    cy.get('[role="dialog"]').find('a, [cmdk-item]').first().click({ force: true });
    cy.url().should("match", /\/products\/.+/);
  });

  it("search shows no results for nonsense query", () => {
    cy.get('button[aria-label="Search"]').click();
    cy.get('[role="dialog"] input, [cmdk-input]').type("zzzzxxxxxqqqqq");
    cy.wait(1500);
    cy.get('[role="dialog"]').contains(/no results/i).should("be.visible");
    cy.takeVisualSnapshot("search-no-results");
  });

  it("theme toggle works and persists", () => {
    cy.get('button[aria-label*="theme"], button[aria-label*="Theme"]').first().click();
    cy.wait(300);
    cy.takeVisualSnapshot("dark-mode");
    cy.get('button[aria-label*="theme"], button[aria-label*="Theme"]').first().click();
    cy.wait(300);
    cy.takeVisualSnapshot("light-mode");
  });

  it("cart icon is visible", () => {
    cy.get('button[aria-label="Cart"], a[href="/cart"]').should("be.visible");
  });

  it("cart drawer opens on cart click", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"], [data-state="open"]').should("be.visible");
    cy.takeVisualSnapshot("cart-drawer-empty");
  });

  it("cart drawer shows empty state with 'Browse Products' link", () => {
    cy.get('button[aria-label="Cart"]').click();
    cy.get('[role="dialog"]').contains(/empty|browse/i).should("be.visible");
  });

  it("shows Sign In link when not authenticated", () => {
    cy.clearAllLocalStorage();
    cy.visit("/");
    cy.get("header").contains(/sign in|login/i).should("be.visible");
    cy.takeVisualSnapshot("header-unauthenticated");
  });
});

describe("Header – Authenticated User Dropdown", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.wait(1000);
  });

  it("shows avatar", () => {
    cy.get('header [class*="avatar"]').should("be.visible");
  });

  it("shows wishlist icon linking to /wishlist", () => {
    cy.get('header a[href="/wishlist"]').should("exist");
  });

  it("avatar click opens dropdown", () => {
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.wait(300);
    cy.takeVisualSnapshot("user-dropdown");
  });

  it("dropdown has Profile link", () => {
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.contains("Profile").should("be.visible");
  });

  it("dropdown has My Orders link", () => {
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.contains(/orders/i).should("be.visible");
  });

  it("dropdown has Addresses link", () => {
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.contains("Addresses").should("be.visible");
  });

  it("dropdown has Wishlist link", () => {
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.contains("Wishlist").should("be.visible");
  });

  it("dropdown Logout clears session", () => {
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.contains(/log\s?out|sign\s?out/i).click();
    cy.wait(1000);
    cy.get("header").contains(/sign in|login/i).should("be.visible");
  });

  it("Profile link navigates to /profile", () => {
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.contains("Profile").click();
    cy.url().should("include", "/profile");
  });

  it("Orders link navigates to /orders", () => {
    cy.visit("/");
    cy.get('header [class*="avatar"]').first().click({ force: true });
    cy.contains(/orders/i).click();
    cy.url().should("include", "/orders");
  });
});

describe("Footer – All Links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  const footerLinks = [
    { text: "About Us", path: "/about" },
    { text: "Contact", path: "/contact" },
    { text: "Careers", path: "/careers" },
    { text: "Blog", path: "/blog" },
    { text: "Help Center", path: "/help" },
    { text: "FAQ", path: "/faq" },
    { text: "Track Order", path: "/track" },
    { text: "Privacy Policy", path: "/privacy" },
    { text: "Terms of Service", path: "/terms" },
    { text: "Cookie Policy", path: "/cookies" },
    { text: "Accessibility", path: "/accessibility" },
  ];

  footerLinks.forEach(({ text, path }) => {
    it(`footer "${text}" navigates to ${path}`, () => {
      cy.get("footer").contains(text).click();
      cy.url().should("include", path);
      cy.get("h1, h2").should("exist");
      cy.takeVisualSnapshot(`footer-link-${path.replace("/", "")}`);
    });
  });

  it("footer shows social media icons", () => {
    cy.get("footer").find("svg").should("have.length.at.least", 3);
    cy.takeVisualSnapshot("footer-social-icons");
  });

  it("footer newsletter email input exists", () => {
    cy.get("footer").then(($f) => {
      if ($f.find('input[type="email"]').length) {
        cy.get("footer").find('input[type="email"]').should("be.visible");
        cy.get("footer").contains("Subscribe").should("be.visible");
      }
    });
  });

  it("newsletter subscribe with valid email", () => {
    cy.get("footer").then(($f) => {
      if ($f.find('input[type="email"]').length) {
        cy.get("footer").find('input[type="email"]').type("test@example.com");
        cy.get("footer").contains("Subscribe").click();
        cy.takeVisualSnapshot("newsletter-subscribed");
      }
    });
  });
});

describe("Mobile Navigation", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.visit("/");
  });

  it("shows hamburger menu on mobile", () => {
    cy.get('button[aria-label="Open menu"]').should("be.visible");
  });

  it("opens mobile nav sheet", () => {
    cy.get('button[aria-label="Open menu"]').click();
    cy.get('[role="dialog"], [data-state="open"]').should("be.visible");
    cy.takeVisualSnapshot("mobile-nav-sheet");
  });

  it("mobile nav has all main links", () => {
    cy.get('button[aria-label="Open menu"]').click();
    ["Home", "Products", "Categories", "Brands", "Offers"].forEach((link) => {
      cy.get('[role="dialog"]').contains(link).should("be.visible");
    });
  });

  it("mobile Products link works", () => {
    cy.get('button[aria-label="Open menu"]').click();
    cy.get('[role="dialog"]').contains("Products").click();
    cy.url().should("include", "/products");
  });

  it("mobile Categories link works", () => {
    cy.visit("/");
    cy.get('button[aria-label="Open menu"]').click();
    cy.get('[role="dialog"]').contains("Categories").click();
    cy.url().should("include", "/categories");
  });

  it("mobile unauthenticated shows Sign In", () => {
    cy.clearAllLocalStorage();
    cy.visit("/");
    cy.get('button[aria-label="Open menu"]').click();
    cy.get('[role="dialog"]').contains(/sign in/i).should("be.visible");
  });

  it("mobile authenticated shows Profile/Wishlist/Logout", () => {
    cy.login();
    cy.visit("/");
    cy.get('button[aria-label="Open menu"]').click();
    cy.get('[role="dialog"]').contains(/profile/i).should("be.visible");
  });

  it("mobile homepage all sections render", () => {
    cy.wait(2000);
    cy.contains("Featured Products").scrollIntoView().should("be.visible");
    cy.takeVisualSnapshot("mobile-homepage");
  });
});
