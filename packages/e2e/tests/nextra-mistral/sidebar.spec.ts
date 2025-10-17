
import { expect,test } from '../fixtures.ts';
// Helper to get the correct path for the current project
function getPath(path: string): string {
  // Docusaurus uses /docs/ prefix, Nextra doesn't
  const projectName = test.info().project.name;
  if (projectName.includes('docusaurus')) {
    return `/docs${path}`;
  }
  return path;
}

test.describe('Sidebar', () => {
  test('should render the sidebar', async ({ page }) => {
    await page.goto(getPath('mistral/api/endpoint/agents'));

    // Wait for page to be loaded
    await page.waitForLoadState('networkidle');
    const sidebar = page.getByRole('complementary')
    await expect(sidebar).toBeVisible();
  });
});
