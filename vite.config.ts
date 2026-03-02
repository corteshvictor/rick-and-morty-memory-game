import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin } from "vite";
import { envSchema } from "./src/app/config/env-schema";

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
});
