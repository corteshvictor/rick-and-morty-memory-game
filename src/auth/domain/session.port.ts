import { type AuthUser } from "./auth.model";

export interface SessionPort {
	getSession(): Promise<AuthUser | null>;
	onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
