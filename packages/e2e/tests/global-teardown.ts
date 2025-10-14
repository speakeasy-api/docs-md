import type { FullConfig } from '@playwright/test';

/**
 * Global teardown that runs once after all tests complete.
 *
 * Use this to:
 * - Stop development servers
 * - Clean up test databases
 * - Remove temporary files
 * - Perform any cleanup needed after all tests
 *
 * Example:
 * async function globalTeardown(config: FullConfig) {
 *   // Stop dev server started in global-setup
 *   const pid = process.env.DEV_SERVER_PID;
 *   if (pid) {
 *     process.kill(parseInt(pid));
 *   }
 * }
 */

function globalTeardown(_config: FullConfig) {
  console.log('Running global teardown...');

  // TODO: Add teardown logic here
  // Example: Stop dev servers, clean up resources, etc.

  console.log('Global teardown complete');
}

// eslint-disable-next-line fast-import/no-unused-exports
export default globalTeardown;
