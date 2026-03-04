import { defineConfig, devices } from "@playwright/test";
import { e2eEnvs } from "./e2e/env";

const baseURL = e2eEnvs.E2E_BASE_URL;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL,
		trace: "on-first-retry",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],

	webServer: {
		command: "pnpm dev",
		url: baseURL,
		reuseExistingServer: !process.env.CI,
	},
});
