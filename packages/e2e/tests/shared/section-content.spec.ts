import { expect, test } from "../fixtures.ts";
test.describe('SectionContent', () => {
  test('should render section content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const sectionContent = page.getByRole('region', {name: 'Section Content'});
    await expect(sectionContent).toBeVisible();
  });
});