import { create } from "zustand";
import {
	AUTH_STATUS,
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
	oauthProvider: OAuthProvider | null;
	signingOut: boolean;
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
	status: AUTH_STATUS.LOADING,
	error: null,
	oauthProvider: null,
	signingOut: false,

	signUp: async (credentials) => {
		set({ error: null });
		const result = await getGateway().signUp(credentials);
		if (result.error) {
			set({ error: result.error });
			notifyError({ message: result.error, title: "Error de registro" });
		} else if (result.user) {
			set({ user: result.user, status: AUTH_STATUS.AUTHENTICATED });
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
			set({ user: result.user, status: AUTH_STATUS.AUTHENTICATED });
		}
	},

	signInWithOAuth: async (provider) => {
		set({ error: null, oauthProvider: provider });
		const result = await getGateway().signInWithOAuth(provider);
		if (result.error) {
			set({ error: result.error, oauthProvider: null });
			notifyError({ message: result.error, title: "Error de autenticación" });
		}
	},

	signOut: async () => {
		set({ signingOut: true });
		const result = await getGateway().signOut();
		if (result.error) {
			set({ error: result.error, signingOut: false });
			notifyError({ message: result.error, title: "Error al cerrar sesión" });
		} else {
			set({
				user: null,
				status: AUTH_STATUS.UNAUTHENTICATED,
				signingOut: false,
			});
		}
	},

	initialize: () => {
		let gw: AuthGateway;
		try {
			gw = getGateway();
		} catch {
			set({ status: AUTH_STATUS.UNAUTHENTICATED, error: null });
			return () => {};
		}

		gw.getSession().then((user) => {
			set({
				user,
				status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED,
			});
		});

		const unsubscribe = gw.onAuthStateChange((user) => {
			set({
				user,
				status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED,
			});
		});

		return unsubscribe;
	},
}));
