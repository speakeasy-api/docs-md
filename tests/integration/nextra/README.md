# Nextra Integration Tests

Integration tests for the Nextra documentation framework.

## Running Tests

```bash
# From the integration directory
npm run test:nextra

# From the project root
make test-integration
```

## Configuration

See `playwright.config.ts` for test configuration specific to Nextra.

## Test Structure

- `tests/` - Test files for Nextra-specific functionality
- `playwright.config.ts` - Playwright configuration for Nextra tests
