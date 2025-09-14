import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // If you prefer Playwright to start the dev server automatically, uncomment below and adjust command/cwd
  // webServer: [
  //   { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: !process.env.CI, cwd: '.' },
  // ],
});
