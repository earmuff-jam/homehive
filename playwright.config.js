import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

// defineConfig ...
// defines the config for the playwright configuration
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:8888",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
  webServer: {
    command: process.env.CI
      ? "npm run build && npm run preview"
      : "netlify dev",
    url: "http://127.0.0.1:8888",
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
