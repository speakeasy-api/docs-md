import { test as base } from "@playwright/test";

/**
 * Extend base test with custom fixtures.
 *
 * Example:
 * export const test = base.extend<{ authenticatedPage: Page }>({
 *   authenticatedPage: async ({ page }, use) => {
 *     // Setup: authenticate
 *     await page.goto('/login');
 *     await page.fill('[name="username"]', 'testuser');
 *     await page.fill('[name="password"]', 'password');
 *     await page.click('button[type="submit"]');
 *
 *     // Use the authenticated page in tests
 *     await use(page);
 *
 *     // Teardown: logout
 *     await page.goto('/logout');
 *   },
 * });
 */

export const test = base;

// eslint-disable-next-line fast-import/no-unused-exports
export { expect } from "@playwright/test";
