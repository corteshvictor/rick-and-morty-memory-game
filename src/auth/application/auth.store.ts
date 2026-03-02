import { create } from "zustand";
import {
	type AuthStatus,
	type AuthUser,
	type Credentials,
	type OAuthProvider,
} from "@/auth/domain/auth.model";
import { type AuthGateway } from "@/auth/domain/auth.repository";
import { createSupabaseAuthGateway } from "@/auth/infrastructure/auth.api";
import { notifyError } from "@/shared/ui/notifications";

interface AuthState {
	user: AuthUser | null;
	status: AuthStatus;
	error: string | null;
	signUp: (credentials: Credentials) => Promise<void>;
	signIn: (credentials: Credentials) => Promise<void>;
	signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
	signOut: () => Promise<void>;
	initialize: () => () => void;
}

let gateway: AuthGateway | null = null;
function getGateway(): AuthGateway {
	gateway ??= createSupabaseAuthGateway();
	return gateway;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	status: "loading",
	error: null,

	signUp: async (credentials) => {
		set({ error: null });
		const result = await getGateway().signUp(credentials);
		if (result.error) {
			set({ error: result.error });
			notifyError({ message: result.error, title: "Error de registro" });
		} else if (result.user) {
			set({ user: result.user, status: "authenticated" });
		}
	},

	signIn: async (credentials) => {
		set({ error: null });
		const result = await getGateway().signIn(credentials);
		if (result.error) {
			set({ error: result.error });
			notifyError({
				message: result.error,
				title: "Error de inicio de sesión",
			});
		} else if (result.user) {
			set({ user: result.user, status: "authenticated" });
		}
	},

	signInWithOAuth: async (provider) => {
		set({ error: null });
		const result = await getGateway().signInWithOAuth(provider);
		if (result.error) {
			set({ error: result.error });
			notifyError({ message: result.error, title: "Error de autenticación" });
		}
	},

	signOut: async () => {
		const result = await getGateway().signOut();
		if (result.error) {
			set({ error: result.error });
			notifyError({ message: result.error, title: "Error al cerrar sesión" });
		} else {
			set({ user: null, status: "unauthenticated" });
		}
	},

	initialize: () => {
		let gw: AuthGateway;
		try {
			gw = getGateway();
		} catch {
			set({ status: "unauthenticated", error: null });
			return () => {};
		}

		gw.getSession().then((user) => {
			set({
				user,
				status: user ? "authenticated" : "unauthenticated",
			});
		});

		const unsubscribe = gw.onAuthStateChange((user) => {
			set({
				user,
				status: user ? "authenticated" : "unauthenticated",
			});
		});

		return unsubscribe;
	},
}));
