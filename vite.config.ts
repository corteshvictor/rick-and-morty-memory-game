/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, type Plugin } from "vite";
import { envSchema } from "./src/app/config/env-schema";

const dirname =
	typeof __dirname === "undefined"
		? path.dirname(fileURLToPath(import.meta.url))
		: __dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const validateEnv = (): Plugin => ({
	name: "validate-env",
	configResolved(config) {
		const result = envSchema.safeParse(config.env);
		if (!result.success) {
			const missing = result.error.issues
				.map((i) => `  - ${i.path.join(".")}: ${i.message}`)
				.join("\n");
			throw new Error(
				`\n\nMissing or invalid environment variables:\n${missing}\n\nCopy .env.example to .env and fill in the values.\n`,
			);
		}
	},
});

// https://vite.dev/config/
export default defineConfig({
	plugins: [validateEnv(), tailwindcss(), react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					environment: "happy-dom",
					include: ["src/**/*.test.{ts,tsx}"],
					setupFiles: ["./src/test-setup.ts"],
				},
			},
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: path.join(dirname, ".storybook"),
					}),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [
							{
								browser: "chromium",
							},
						],
					},
					setupFiles: [".storybook/vitest.setup.ts"],
					deps: {
						optimizer: {
							web: {
								include: ["react-router"],
							},
						},
					},
				},
			},
		],
	},
});
