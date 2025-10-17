import { expect, test } from "../fixtures.ts";

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const title = page.getByRole('heading', {name: 'Speakeasy Docs Demo'});
    await expect(title).toBeVisible();
  });
});