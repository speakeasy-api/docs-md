import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Docusaurus integration tests.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  workers: process.env.CI ? 2 : undefined,
  use: {
    /* Base URL for tests */
    baseURL: "http://localhost:3001",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Screenshot on failure */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run Docusaurus dev server before starting the tests */
  webServer: {
    command: process.env.CI
      ? "npm run start"
      : "npm run build && npm run start",
    cwd: "../../../examples/docusaurus/",
    reuseExistingServer: !process.env.CI,
    url: "http://localhost:3001",
    stdout: "pipe" as const,
    timeout: 30000,
  },
});

