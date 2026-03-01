import { type User } from "@supabase/supabase-js";
import {
	type AuthUser,
	type Credentials,
	type OAuthProvider,
} from "@/auth/domain/auth.model";
import {
	type AuthGateway,
	type AuthResult,
} from "@/auth/domain/auth.repository";
import { getSupabase } from "@/shared/infrastructure/supabase";

function mapUser(user: User | null): AuthUser | null {
	if (!user) return null;
	return {
		id: user.id,
		email: user.email ?? "",
		displayName:
			user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
	};
}

export function createSupabaseAuthGateway(): AuthGateway {
	const supabase = getSupabase();
	return {
		async signUp(credentials: Credentials): Promise<AuthResult> {
			const { data, error } = await supabase.auth.signUp({
				email: credentials.email,
				password: credentials.password,
			});
			if (error) return { user: null, error: error.message };
			return { user: mapUser(data.user), error: null };
		},

		async signIn(credentials: Credentials): Promise<AuthResult> {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password,
			});
			if (error) return { user: null, error: error.message };
			return { user: mapUser(data.user), error: null };
		},

		async signInWithOAuth(
			provider: OAuthProvider,
		): Promise<{ error: string | null }> {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: { redirectTo: `${window.location.origin}/game` },
			});
			if (error) return { error: error.message };
			return { error: null };
		},

		async signOut(): Promise<{ error: string | null }> {
			const { error } = await supabase.auth.signOut();
			if (error) return { error: error.message };
			return { error: null };
		},

		async getSession(): Promise<AuthUser | null> {
			const { data } = await supabase.auth.getSession();
			return mapUser(data.session?.user ?? null);
		},

		onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
			const { data } = supabase.auth.onAuthStateChange((_event, session) => {
				callback(mapUser(session?.user ?? null));
			});
			return () => data.subscription.unsubscribe();
		},
	};
}
