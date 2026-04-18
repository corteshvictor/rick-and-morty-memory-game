import { type User } from "@supabase/supabase-js";
import { type AuthGateway } from "@/auth/domain/auth.gateway";
import {
	type AuthResult,
	type AuthUser,
	type Credentials,
	type OAuthProvider,
} from "@/auth/domain/auth.model";
import { supabase } from "@/shared/infrastructure/supabase";

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
	return {
		async signUp(credentials: Credentials): Promise<AuthResult> {
			const { data, error } = await supabase.auth.signUp({
				email: credentials.email,
				password: credentials.password,
			});
			if (error) return { user: null, error: error.message };

			const alreadyRegistered = data.user?.identities?.length === 0;

			if (alreadyRegistered) {
				return {
					user: null,
					error:
						"Este correo electrónico ya está registrado. Intenta iniciar sesión.",
				};
			}

			const needsEmailConfirmation = data.user != null && data.session == null;

			return {
				user: needsEmailConfirmation ? null : mapUser(data.user),
				error: null,
				needsEmailConfirmation,
			};
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
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${globalThis.location.origin}/game`,
					skipBrowserRedirect: true,
				},
			});
			if (error) return { error: error.message };
			if (!data.url) return { error: "No se pudo iniciar la autenticación." };

			// Prefetch para detectar si el proveedor OAuth no está habilitado en Supabase
			// antes de redirigir al usuario. Cuando el proveedor SÍ está habilitado,
			// Supabase responde con un 302 hacia Google/GitHub. El navegador sigue ese
			// redirect dentro del fetch, pero el servidor OAuth (Google, etc.) no envía
			// cabeceras CORS, así que el fetch falla con un "CORS error" en la pestaña
			// Network. Esto es esperado y no es un problema: el catch lo ignora y la
			// redirección real se hace con `location.href` más abajo (navegación completa,
			// no sujeta a CORS).
			try {
				const res = await fetch(data.url, { redirect: "manual" });
				if (res.type !== "opaqueredirect" && !res.ok) {
					const body = await res.json().catch(() => null);
					const msg = body?.msg ?? body?.error_description;
					if (msg?.includes("provider is not enabled")) {
						return {
							error: `El proveedor ${provider} no está habilitado. Configúralo en el dashboard de Supabase.`,
						};
					}
					return { error: msg ?? `Error del proveedor (${res.status})` };
				}
			} catch (error) {
				console.error(
					"OAuth prefetch failed, proceeding with redirect:",
					error,
				);
			}

			globalThis.location.href = data.url;
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
