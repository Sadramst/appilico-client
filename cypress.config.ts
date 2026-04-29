import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      apiUrl: "https://appilico-server.onrender.com/api",
      customerEmail: "customer1@appilico.com",
      customerPassword: "Customer@123!",
      adminEmail: "admin@appilico.com",
      adminPassword: "Admin@123!",
    },
  },
});
