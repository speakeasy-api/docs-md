# @speakeasy-api/docs-md-e2e

End-to-end integration tests for DocsMD using Playwright.

## Setup

Install dependencies from the monorepo root:

```bash
npm install
```

Install Playwright browsers:

```bash
cd packages/e2e
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

## Project Structure

```
packages/e2e/
├── playwright.config.ts      # Playwright configuration
├── tests/
│   ├── fixtures.ts           # Custom test fixtures
│   ├── global-setup.ts       # Global setup (runs once before all tests)
│   ├── global-teardown.ts    # Global teardown (runs once after all tests)
│   ├── .gitignore            # Ignore test artifacts
│   └── e2e/
│       └── home-page.spec.ts     # Example test file
```

## Writing Tests

Import the test and expect utilities from `fixtures.ts`:

```typescript
import { test, expect } from '../fixtures';

test('my test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/My App/);
});
```