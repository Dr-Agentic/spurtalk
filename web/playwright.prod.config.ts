/**
 * Playwright config override for production QA
 * Usage: npx playwright test --config=playwright.prod.config.ts
 *
 * Key differences from dev config:
 * - Points to real prod URLs
 * - No webServer (no auto-start; prod is already running)
 * - Explicit creds from env
 */
import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'https://app.spurtalk.com';
const backendURL = process.env.QA_BACKEND_URL || 'https://api.spurtalk.com';

export default defineConfig({
  testDir: './tests-e2e',
  timeout: 90000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    screenshot: 'on',
    trace: 'on',
    video: 'on',
    // Explicit test user creds from env (fallback to script defaults)
    ...(process.env.QA_TEST_EMAIL && {
      extraHTTPHeaders: {
        // You can inject auth headers here if needed
      }
    }),
  },
  // No webServer — prod is already running
  projects: [
    {
      name: 'chromium',
      use: {
        channel: undefined, // use default Chrome
      },
    },
  ],
});
