import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.resolve(__dirname, "..", ".env.e2e"));

const e2eEnvSchema = z.object({
	E2E_BASE_URL: z.url().default("http://localhost:5173"),
	E2E_USER_EMAIL: z.email(),
	E2E_USER_PASSWORD: z.string().min(6),
});

export const e2eEnvs = e2eEnvSchema.parse(process.env);
