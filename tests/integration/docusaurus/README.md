# Docusaurus Integration Tests

Integration tests for the Docusaurus documentation framework.

## Running Tests

```bash
# From the integration directory
npm run test:docusaurus

# From the project root
make test-integration
```

## Configuration

See `playwright.config.ts` for test configuration specific to Docusaurus.

## Test Structure

- `tests/` - Test files for Docusaurus-specific functionality
- `playwright.config.ts` - Playwright configuration for Docusaurus tests
