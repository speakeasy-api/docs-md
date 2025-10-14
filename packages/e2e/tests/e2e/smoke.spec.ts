import { expect,test } from '../fixtures.ts';

/**
 * Smoke test to verify Playwright setup is working correctly.
 *
 * This is a basic test that you can expand upon to test your
 * example applications (pokeapi, mistral, glean, etc.)
 *
 * To test your example apps:
 * 1. Start the dev server in global-setup.ts
 * 2. Configure the baseURL in playwright.config.ts or per-project
 * 3. Write tests that navigate to your app and verify functionality
 */

test.describe('Smoke tests', () => {
  test('basic test example', async ({ page }) => {
    // Example: Navigate to a page
    await page.goto('https://playwright.dev/');

    // Example: Verify page title
    await expect(page).toHaveTitle(/Playwright/);

    // Example: Click a link and verify navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('should pass', () => {
    // Simple assertion to verify test framework is working
    expect(1 + 1).toBe(2);
  });
});

/**
 * Example test structure for testing your docs apps:
 *
 * test.describe('Docusaurus PokeAPI', () => {
 *   test.use({ baseURL: 'http://localhost:3000' });
 *
 *   test('should load homepage', async ({ page }) => {
 *     await page.goto('/');
 *     await expect(page).toHaveTitle(/PokeAPI/);
 *   });
 *
 *   test('should navigate to API reference', async ({ page }) => {
 *     await page.goto('/');
 *     await page.getByRole('link', { name: 'API Reference' }).click();
 *     // Add assertions for your API docs
 *   });
 * });
 */
