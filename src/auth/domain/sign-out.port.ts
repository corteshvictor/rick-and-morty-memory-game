export interface SignOutPort {
	signOut(): Promise<{ error: string | null }>;
}
