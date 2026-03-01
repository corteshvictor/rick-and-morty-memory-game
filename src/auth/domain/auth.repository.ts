import {
	type AuthUser,
	type Credentials,
	type OAuthProvider,
} from "./auth.model";

export interface AuthResult {
	user: AuthUser | null;
	error: string | null;
}

export interface AuthGateway {
	signUp(credentials: Credentials): Promise<AuthResult>;
	signIn(credentials: Credentials): Promise<AuthResult>;
	signInWithOAuth(provider: OAuthProvider): Promise<{ error: string | null }>;
	signOut(): Promise<{ error: string | null }>;
	getSession(): Promise<AuthUser | null>;
	onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
