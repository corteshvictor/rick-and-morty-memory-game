import {
	type AuthResult,
	type Credentials,
	type OAuthProvider,
} from "./auth.model";

export interface SignInPort {
	signIn(credentials: Credentials): Promise<AuthResult>;
	signInWithOAuth(provider: OAuthProvider): Promise<{ error: string | null }>;
}
