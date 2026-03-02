import { createClient } from "@supabase/supabase-js";
import { envs } from "@/app/config/env";

export const supabase = createClient(
	envs.SUPABASE_URL,
	envs.SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);
