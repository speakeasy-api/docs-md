import { expect,test } from '../fixtures.ts';


test.describe('Sidebar', () => {
  test('should render the sidebar and correct number of items', async ({ page }) => {
    await page.goto('/docs/api/endpoint/agents');

    // Wait for page to be loaded
    await page.waitForLoadState('networkidle');
    const sidebar = page.getByRole('navigation', { name: 'Docs sidebar' });
    await expect(sidebar).toBeVisible();

    const sidebarList = sidebar.getByRole('list');
    // Assert the correct number of side 
    await expect(sidebarList).toHaveCount(15);
  });
  test('should collapse and expand sidebar items', async ({ page }) => {
    await page.goto('/docs/api/endpoint/agents');

    // Wait for page to be loaded
    await page.waitForLoadState('networkidle');
    const sidebar = page.getByRole('navigation', { name: 'Docs sidebar' });

    const agentsItem = sidebar.getByRole('link', {name: 'audio'});
    await expect(agentsItem).toBeVisible();

    await agentsItem.click();
    await expect(agentsItem).toHaveAttribute('aria-expanded', 'true');
  });
});
