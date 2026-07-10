import { defineConfig, devices } from "@playwright/test";

/**
 * Assumes the frontend (:3000) and backend (:8081) are already running.
 * Run with: npx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
