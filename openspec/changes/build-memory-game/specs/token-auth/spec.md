## ADDED Requirements

### Requirement: Sign up with email and password
The system SHALL allow users to create a new account by providing an email address and a password. The system SHALL delegate account creation to Supabase Auth, which generates a JWT session upon successful sign up.

#### Scenario: Successful sign up
- **WHEN** user enters a valid email and password (minimum 6 characters) and submits the sign up form
- **THEN** Supabase creates the account, returns a session with JWT, the auth store persists the session, and the user is redirected to `/game`

#### Scenario: Sign up with existing email
- **WHEN** user submits a sign up form with an email that already has an account
- **THEN** the system SHALL display an error message and remain on the sign up page

#### Scenario: Sign up with invalid input
- **WHEN** user submits the form with an empty email, invalid email format, or password shorter than 6 characters
- **THEN** the system SHALL display validation errors and not call Supabase

### Requirement: Sign in with email and password
The system SHALL allow existing users to authenticate by providing their email and password. The system SHALL delegate authentication to Supabase Auth.

#### Scenario: Successful sign in
- **WHEN** user enters a registered email and correct password and submits the sign in form
- **THEN** Supabase returns a session with JWT, the auth store persists the session, and the user is redirected to `/game`

#### Scenario: Sign in with wrong credentials
- **WHEN** user submits incorrect email or password
- **THEN** the system SHALL display an error message and remain on the login page

### Requirement: OAuth sign in with Google
The system SHALL allow users to authenticate using their Google account via Supabase OAuth. If the Google account has no existing Supabase user, one SHALL be created automatically.

#### Scenario: Successful Google OAuth
- **WHEN** user clicks the "Google" button on the login or sign up page
- **THEN** the system redirects to Google's OAuth consent screen, and upon approval, Supabase creates or retrieves the user, returns a session with JWT, and the user is redirected to `/game`

### Requirement: OAuth sign in with GitHub
The system SHALL allow users to authenticate using their GitHub account via Supabase OAuth. If the GitHub account has no existing Supabase user, one SHALL be created automatically.

#### Scenario: Successful GitHub OAuth
- **WHEN** user clicks the "GitHub" button on the login or sign up page
- **THEN** the system redirects to GitHub's OAuth consent screen, and upon approval, Supabase creates or retrieves the user, returns a session with JWT, and the user is redirected to `/game`

### Requirement: Session persistence with JWT
The system SHALL persist the Supabase session (including JWT access token and refresh token) so that users remain authenticated across page reloads. Supabase JS client handles storage automatically.

#### Scenario: Page reload while authenticated
- **WHEN** an authenticated user reloads the browser
- **THEN** Supabase client restores the session from storage, the auth store reflects the authenticated state, and the user remains on their current page

#### Scenario: Expired token refresh
- **WHEN** the JWT access token expires but the refresh token is still valid
- **THEN** Supabase client automatically refreshes the session and the user continues without interruption

### Requirement: Logout
The system SHALL allow authenticated users to sign out. Signing out SHALL clear the Supabase session and redirect to the login page.

#### Scenario: User logs out
- **WHEN** an authenticated user clicks the logout button
- **THEN** the Supabase session is destroyed, the auth store resets to unauthenticated state, and the user is redirected to `/login`

### Requirement: Auth state management
The system SHALL maintain auth state in a Zustand store within `auth/application/`. The store SHALL expose the current user, authentication status (loading, authenticated, unauthenticated), and actions (login, signup, loginWithOAuth, logout).

#### Scenario: Auth store reflects Supabase session changes
- **WHEN** the Supabase `onAuthStateChange` listener fires (sign in, sign out, token refresh)
- **THEN** the auth Zustand store updates to reflect the new state
