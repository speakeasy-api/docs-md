import type { FullConfig } from '@playwright/test';

/**
 * Global setup that runs once before all tests.
 *
 * Use this to:
 * - Start development servers for example apps
 * - Set up test databases
 * - Generate authentication tokens
 * - Perform any one-time setup needed for all tests
 *
 * Example:
 * async function globalSetup(config: FullConfig) {
 *   // Start dev server for an example app
 *   const server = exec('npm run dev', {
 *     cwd: path.resolve(__dirname, '../../examples/docusaurus/pokeapi'),
 *   });
 *
 *   // Wait for server to be ready
 *   await waitForServer('http://localhost:3000');
 *
 *   // Store server process for cleanup in teardown
 *   process.env.DEV_SERVER_PID = server.pid?.toString();
 * }
 */

function globalSetup(_config: FullConfig) {
  console.log('Running global setup...');

  // TODO: Add setup logic here
  // Example: Start dev servers, seed databases, etc.

  console.log('Global setup complete');
}

// eslint-disable-next-line fast-import/no-unused-exports
export default globalSetup;
