export interface AuthUser {
	id: string;
	email: string;
	displayName: string | null;
}

export interface Credentials {
	email: string;
	password: string;
}

export type OAuthProvider = "google" | "github";

export interface AuthResult {
	user: AuthUser | null;
	error: string | null;
	needsEmailConfirmation?: boolean;
}

export const AUTH_STATUS = {
	LOADING: "loading",
	AUTHENTICATED: "authenticated",
	UNAUTHENTICATED: "unauthenticated",
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];
