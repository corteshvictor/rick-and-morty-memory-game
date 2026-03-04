export const MOCK_AUTH_SESSION = {
	access_token: "mock-access-token",
	token_type: "bearer",
	expires_in: 3600,
	expires_at: Math.floor(Date.now() / 1000) + 3600,
	refresh_token: "mock-refresh-token",
	user: {
		id: "user-123",
		aud: "authenticated",
		role: "authenticated",
		email: "test@example.com",
		email_confirmed_at: "2024-01-01T00:00:00Z",
		app_metadata: {
			provider: "email",
			providers: ["email"],
		},
		user_metadata: {
			full_name: "Test User",
		},
		identities: [],
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
};
