import { expect,test } from '../fixtures.ts';

test.describe('TryItNow', () => {
  test('should load TryItNow', async ({ page }) => {
    await page.goto('/api/endpoint/beta/libraries/accesses');
    const runButton = page.getByRole('button', { name: 'Run' });
    await expect(runButton).toBeVisible();
  });
});