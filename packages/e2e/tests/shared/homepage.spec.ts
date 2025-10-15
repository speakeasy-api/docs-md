import { expect,test } from '../fixtures.ts';

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be loaded
    await page.waitForLoadState('networkidle');
    const mistralText = page.getByText('Mistral');
    // Verify page loaded successfully
    await expect(mistralText).toBeVisible();
  });
});
