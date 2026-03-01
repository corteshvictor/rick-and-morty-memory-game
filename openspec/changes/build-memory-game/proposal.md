## Why

The project is greenfield — only tooling and architecture configuration exist. The core product (a Rick and Morty memory card game with authentication) needs to be built from scratch. This is the initial feature delivery that brings the application from empty scaffold to a fully playable game.

## What Changes

- Add authentication via Supabase Auth: sign up and sign in with email/password, plus OAuth with Google and GitHub. Supabase handles user management, JWT generation, token refresh, and session persistence
- Add a memory game board that fetches Rick and Morty characters from `https://rickandmortyapi.com` and displays them as shuffled card pairs
- Implement card matching gameplay: 3-second preview, flip-to-compare mechanics, 1-second reveal on match/mismatch, match and turn counters
- Add a game completion screen with stats and replay/home navigation
- Set up the application shell: React Router, providers (Zustand, TanStack Query, Supabase), layouts, and route protection
- Install runtime dependencies: `@supabase/supabase-js`, `zustand`, `@tanstack/react-query`, `react-router`

## Capabilities

### New Capabilities

- `token-auth`: Supabase Auth integration — sign up (email/password), sign in (email/password), OAuth (Google, GitHub), JWT session management, token refresh, auth state (Zustand store), route protection guard, logout
- `memory-game`: Board generation with shuffled character pairs, card flip mechanics, match/mismatch comparison logic, turn and match counters, game state machine (preview → playing → completed), game completion screen with replay and home actions
- `app-shell`: React Router setup, auth and game layouts, Supabase/TanStack Query/Zustand providers wiring, protected routes

### Modified Capabilities

_None — this is the initial build._

## Non-goals

- Custom backend or database tables (Supabase is used only for auth, not as a data store)
- Email verification flow or password reset
- Difficulty levels, leaderboards, or persistent score history
- Animations beyond basic card flip
- Mobile-first design (desktop-first, basic responsiveness only)
- Internationalization (UI in Spanish to match the Figma reference)
- Unit/integration tests (no test framework configured yet)

## Impact

- **New dependencies**: `@supabase/supabase-js`, `zustand`, `@tanstack/react-query`, `react-router`
- **New code**: `src/auth/`, `src/game/`, `src/shared/`, `src/app/` directories following hexagonal architecture
- **Replaced code**: Current `src/App.tsx` Vite template replaced with app shell
- **External services**: Supabase project (free tier) for auth, Rick and Morty API for character data
- **Environment variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
