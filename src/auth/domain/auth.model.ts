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

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
