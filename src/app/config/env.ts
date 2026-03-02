import { envSchema } from "./env-schema";

const parsed = envSchema.parse(import.meta.env);

export const envs = {
	MODE: parsed.MODE,
	SUPABASE_URL: parsed.VITE_SUPABASE_URL,
	SUPABASE_PUBLISHABLE_DEFAULT_KEY:
		parsed.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
	RICK_AND_MORTY_API_URL: parsed.VITE_RICK_AND_MORTY_API_URL,
};
