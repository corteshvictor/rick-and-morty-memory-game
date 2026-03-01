import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env
	.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string;

let instance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
	if (!instance) {
		if (!supabaseUrl || !supabaseKey) {
			throw new Error(
				"Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY. Copia .env.example a .env y configúralas.",
			);
		}
		instance = createClient(supabaseUrl, supabaseKey);
	}
	return instance;
}
