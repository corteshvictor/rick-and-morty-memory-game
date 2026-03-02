## MODIFIED Requirements

### Requirement: Environment variable configuration
The system SHALL read `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` from environment variables to initialize the Supabase client. The Supabase client SHALL use lazy initialization — it is created on first use, not at module load time. A `.env.example` file SHALL document the required variables.

#### Scenario: Missing environment variables
- **WHEN** the application starts without `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` defined
- **THEN** the Supabase client is NOT created, the auth store catches the error and sets `status: "unauthenticated"`, and the app renders the login page without crashing

#### Scenario: Environment variables present
- **WHEN** the application starts with valid environment variables
- **THEN** the Supabase client is created on first use (lazy) and shared as a singleton across the app

### Requirement: Application providers
The system SHALL wrap the application in the necessary providers: TanStack Query's `QueryClientProvider` and React Router's `BrowserRouter`. Supabase client SHALL be initialized as a lazy singleton in `shared/infrastructure/supabase.ts` using `getSupabase()` function.

#### Scenario: Providers are mounted at app root
- **WHEN** the application starts
- **THEN** `QueryClientProvider` and `BrowserRouter` are available to all child components, and the Supabase client is available via `getSupabase()` when needed
