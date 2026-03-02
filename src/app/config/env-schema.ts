import { z } from "zod";

export const envSchema = z.object({
	MODE: z.string(),
	VITE_SUPABASE_URL: z.url(),
	VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
	VITE_RICK_AND_MORTY_API_URL: z
		.url()
		.default("https://rickandmortyapi.com/api"),
});
