## MODIFIED Requirements

### Requirement: Sign up with email and password
The system SHALL allow users to create a new account by providing an email address and a password. The system SHALL delegate account creation to Supabase Auth, which generates a JWT session upon successful sign up. On success, the auth store SHALL immediately update `user` and `status` to `"authenticated"` and the UI SHALL redirect to `/game`.

#### Scenario: Successful sign up
- **WHEN** user enters a valid email and password (minimum 6 characters) and submits the sign up form
- **THEN** Supabase creates the account, the auth store sets `user` and `status: "authenticated"`, and the user is redirected to `/game`

#### Scenario: Sign up with existing email
- **WHEN** user submits a sign up form with an email that already has an account
- **THEN** the system SHALL display an error message and remain on the sign up page

#### Scenario: Sign up with invalid input
- **WHEN** user submits the form with an empty email, invalid email format, or password shorter than 6 characters
- **THEN** the system SHALL display validation errors and not call Supabase

### Requirement: Sign in with email and password
The system SHALL allow existing users to authenticate by providing their email and password. The system SHALL delegate authentication to Supabase Auth. On success, the auth store SHALL immediately update `user` and `status` to `"authenticated"` and the UI SHALL redirect to `/game`.

#### Scenario: Successful sign in
- **WHEN** user enters a registered email and correct password and submits the sign in form
- **THEN** Supabase returns a session with JWT, the auth store sets `user` and `status: "authenticated"`, and the user is redirected to `/game`

#### Scenario: Sign in with wrong credentials
- **WHEN** user submits incorrect email or password
- **THEN** the system SHALL display an error message and remain on the login page

### Requirement: Logout
The system SHALL allow authenticated users to sign out. Signing out SHALL clear the Supabase session, update the auth store to `status: "unauthenticated"` with `user: null`, and redirect to the login page.

#### Scenario: User logs out
- **WHEN** an authenticated user clicks the logout button
- **THEN** the Supabase session is destroyed, the auth store sets `user: null` and `status: "unauthenticated"`, and the user is redirected to `/login`

### Requirement: Environment variable configuration
The system SHALL read `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` from environment variables to initialize the Supabase client. A `.env.example` file SHALL document the required variables.

#### Scenario: Missing environment variables
- **WHEN** the application starts without `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` defined
- **THEN** the Supabase client initialization is deferred (lazy), and the auth store sets `status: "unauthenticated"` gracefully without crashing the app
