import { defineConfig, devices } from "@playwright/test";

/**
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
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Screenshot on failure */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "docusaurus-mistral",
      testMatch: [
        "**/shared/**/*.spec.ts",
        "**/docusaurus-mistral/**/*.spec.ts",
      ],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
    },
    {
      name: "nextra-mistral",
      testMatch: ["**/shared/**/*.spec.ts", "**/nextra-mistral/**/*.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002",
      },
    },
  ],

  /* Run dev servers for both example sites before starting tests */
  webServer: [
    {
      command: process.env.CI
        ? "npm run start"
        : "npm run build && npm run start",
      cwd: "../../examples/docusaurus/",
      reuseExistingServer: !process.env.CI,
      url: "http://localhost:3001",
      stdout: "pipe",
      timeout: 30000 
    },
    {
      command: process.env.CI
        ? "npm run start"
        : "npm run build && npm run start",
      cwd: "../../examples/nextra/",
      reuseExistingServer: !process.env.CI,
      url: "http://localhost:3002",
      stdout: "pipe",
      timeout: 30000 
    },
  ],
});
