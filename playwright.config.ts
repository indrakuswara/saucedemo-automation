import { defineConfig, devices } from '@playwright/test';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const defaultWorkers = process.env.CI
  ? 2
  : Math.max(2, Math.min(4, Math.floor(os.cpus().length / 2)));

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : defaultWorkers,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: './test-results/results.json' }],
    ['list'],
  ],
  timeout: 45000,
  expect: {
    timeout: 8000,
  },

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    headless: process.env.HEADLESS !== 'false',
    launchOptions: {
      slowMo: 0,
    },
    actionTimeout: 10000,
    navigationTimeout: 30000,
    contextOptions: {
      locale: 'en-US',
      timezoneId: 'Asia/Jakarta',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
