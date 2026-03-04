import { HttpResponse, http } from "msw";
import { envs } from "@/app/config/env";
import { MOCK_AUTH_SESSION } from "../data/auth";

export const supabaseAuth = [
	http.post(`${envs.SUPABASE_URL}/auth/v1/token`, () => {
		return HttpResponse.json(MOCK_AUTH_SESSION);
	}),
];
