## ADDED Requirements

### Requirement: Application providers
The system SHALL wrap the application in the necessary providers: TanStack Query's `QueryClientProvider` and React Router's `BrowserRouter`. Supabase client SHALL be initialized as a singleton in `shared/infrastructure/`.

#### Scenario: Providers are mounted at app root
- **WHEN** the application starts
- **THEN** `QueryClientProvider` and `BrowserRouter` are available to all child components, and the Supabase client is initialized with environment variables

### Requirement: Route configuration
The system SHALL define the following routes: `/login` (public), `/signup` (public), `/game` (protected), and `/` (redirect). The root path SHALL redirect to `/game` if authenticated or `/login` if not.

#### Scenario: Authenticated user visits root
- **WHEN** an authenticated user navigates to `/`
- **THEN** the system redirects to `/game`

#### Scenario: Unauthenticated user visits root
- **WHEN** an unauthenticated user navigates to `/`
- **THEN** the system redirects to `/login`

### Requirement: Auth guard for protected routes
The system SHALL protect the `/game` route with an `AuthGuard` component. Unauthenticated users SHALL be redirected to `/login`. While the auth state is loading, a spinner SHALL be displayed.

#### Scenario: Unauthenticated user visits /game
- **WHEN** an unauthenticated user navigates to `/game`
- **THEN** the system redirects to `/login`

#### Scenario: Auth state is loading
- **WHEN** the auth state is still being determined (e.g., checking Supabase session on page load)
- **THEN** the system displays a loading spinner instead of redirecting

### Requirement: Auth layout
The system SHALL provide an `AuthLayout` for the login and sign up pages. The layout SHALL render a centered card on a dark themed background with the Rick and Morty logo.

#### Scenario: Login page uses auth layout
- **WHEN** the user visits `/login`
- **THEN** the page is rendered within the auth layout with logo, centered form, and dark background

### Requirement: Game layout
The system SHALL provide a `GameLayout` for the game page. The layout SHALL include a header with the Rick and Morty logo, the authenticated user's display name or email, and a logout button.

#### Scenario: Game page uses game layout
- **WHEN** an authenticated user visits `/game`
- **THEN** the page is rendered within the game layout with header, user info, and logout action

### Requirement: Environment variable configuration
The system SHALL read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from environment variables to initialize the Supabase client. A `.env.example` file SHALL document the required variables.

#### Scenario: Missing environment variables
- **WHEN** the application starts without `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` defined
- **THEN** the Supabase client initialization fails and the application logs an error
