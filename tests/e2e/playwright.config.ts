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
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
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
        baseURL: "http://localhost:3003",
      },
    },
    {
      name: "nextra-mistral",
      testMatch: ["**/shared/**/*.spec.ts", "**/nextra-mistral/**/*.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3004",
      },
    },
  ],

  /* Run dev servers for both example sites before starting tests */
  webServer: [
    {
      command: "npm run build && npm run start -- --port 3003",
      cwd: "../../examples/docusaurus/",
      url: "http://localhost:3003",
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      timeout: 5 * 60 * 1000, // 5 minutes
    },
    {
      command: "npm run build && npm run start -- --port 3004",
      cwd: "../../examples/nextra/",
      url: "http://localhost:3004",
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      timeout: 5 * 60 * 1000, // 5 minutes
    },
  ],
});
