import { expect, test } from '../fixtures.ts';

// Helper to get the correct path for the current project
function getPath(path: string): string {
  // Docusaurus uses /docs/ prefix, Nextra doesn't
  const projectName = test.info().project.name;
  if (projectName.includes('docusaurus')) {
    return `/docs${path}`;
  }
  return path;
}

test.describe('Generated Documentation UI', () => {
  test('should load models endpoint with TryItNow', async ({ page }) => {
    await page.goto(getPath('/api/endpoint/models'));

    // Wait for TryItNow to load
    const runButton = page.getByRole('button', { name: /Run/i });
    await expect(runButton.first()).toBeVisible();

    // Verify page content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Models');
    expect(bodyText).toContain('/v1/models');
  });

  test('should load beta libraries accesses endpoint', async ({ page }) => {
    await page.goto(getPath('/api/endpoint/beta/libraries/accesses'));

    // Verify TryItNow is present
    const runButton = page.getByRole('button', { name: /Run/i });
    await expect(runButton.first()).toBeVisible();
  });

  test('should load conversations endpoint', async ({ page }) => {
    await page.goto(getPath('/api/endpoint/beta/conversations'));

    // Verify TryItNow is present
    const runButton = page.getByRole('button', { name: /Run/i });
    await expect(runButton.first()).toBeVisible();

    // Verify page content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Conversations');
  });

  test('should load chat endpoint', async ({ page }) => {
    await page.goto(getPath('/api/endpoint/chat'));

    // Verify TryItNow is present
    const runButton = page.getByRole('button', { name: /Run/i });
    await expect(runButton.first()).toBeVisible();

    // Verify page content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('chat');
  });

  test('should display Copy and Reset buttons', async ({ page }) => {
    await page.goto(getPath('/api/endpoint/beta/libraries/accesses'));

    const runButton = page.getByRole('button', { name: /Run/i });
    await expect(runButton.first()).toBeVisible();

    const copyButton = page.getByRole('button', { name: /Copy/i });
    await expect(copyButton.first()).toBeVisible();

    const resetButton = page.getByRole('button', { name: /Reset/i });
    await expect(resetButton.first()).toBeVisible();
  });

  test('should display code sample tabs', async ({ page }) => {
    await page.goto(getPath('/api/endpoint/beta/libraries/accesses'));

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify TypeScript tab exists
    const tsTab = page.getByText('TypeScript');
    await expect(tsTab.first()).toBeVisible();
  });

  test('should load multiple endpoints successfully', async ({ page }) => {
    const endpoints = [
      '/api/endpoint/beta/libraries/accesses',
      '/api/endpoint/beta/conversations',
      '/api/endpoint/beta/agents',
    ];

    for (const endpoint of endpoints) {
      await page.goto(getPath(endpoint));
      const runButton = page.getByRole('button', { name: /Run/i });
      await expect(runButton.first()).toBeVisible();
    }
  });

  test('should display operation information', async ({ page }) => {
    await page.goto(getPath('/api/endpoint/beta/libraries/accesses'));
    await page.waitForLoadState('networkidle');

    // Verify page has content
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toBeNull();
    expect(bodyText && bodyText.length > 100);
  });
});
