## Context

The project is an empty Vite + React scaffold with tooling (Biome, Husky, Commitlint) and architecture configuration (hexagonal + vertical slicing). No application code exists yet. We need to build the full app: Supabase authentication (sign up, sign in, OAuth) and a memory card game consuming the Rick and Morty API.

The architecture mandates three layers per feature slice (`domain/`, `application/`, `infrastructure/`) with strict dependency rules — domain is pure TypeScript with zero framework imports.

## Goals / Non-Goals

**Goals:**

- Deliver a fully playable memory game behind real authentication
- Follow hexagonal architecture strictly: domain logic is pure TS, infrastructure implements port interfaces
- Use Supabase Auth for real JWT-based sessions (email/password + OAuth)
- Fetch characters from the Rick and Morty API and display them as matchable card pairs
- UI in Spanish following the Figma reference design

**Non-Goals:**

- Custom backend, database tables, or server-side logic
- Email verification, password reset, or account management
- Persistent scores, leaderboards, or difficulty settings
- Complex animations or mobile-first responsive design
- Test coverage (no test framework yet)

## Decisions

### 1. Auth: Supabase Auth with `@supabase/supabase-js`

**Choice**: Use Supabase as a managed auth provider — sign up/sign in with email+password, OAuth with Google and GitHub.

**Why over alternatives**:
- vs. Firebase Auth: Supabase is open-source, simpler API, PostgreSQL-based (easier to extend later)
- vs. Client-side JWT with `jose`: No real identity verification — doesn't satisfy "tokens must be handled" requirement authentically
- vs. Auth0: More complex setup, heavier SDK, overkill for this scope

**How it fits the architecture**:
- `auth/domain/`: `AuthUser` entity, `AuthGateway` port interface (pure TS types)
- `auth/infrastructure/`: Supabase client implementing `AuthGateway` — all Supabase imports are confined here
- `auth/application/`: `auth.store.ts` (Zustand), `useAuth` hook, `LoginPage`, `SignUpPage`, `AuthGuard`

### 2. Game state machine: Pure TypeScript in domain layer

**Choice**: Model the game as an explicit state machine with phases: `idle → preview → playing → completed`.

**Why**: The game has clear states with different allowed transitions (can't flip cards during preview, can't start new turn while comparing). A state machine makes these rules explicit and testable without React.

**State transitions**:
```
idle → preview (startGame: shuffle cards, reveal all for 3s)
preview → playing (after 3s timeout: hide all cards)
playing → playing (flipCard, checkMatch — loop)
playing → completed (when all pairs matched)
completed → idle (replay or go home)
```

**How it fits the architecture**:
- `game/domain/game-engine.ts`: Pure function `transition(state, action) → state` — no side effects, no timers
- `game/application/game.store.ts`: Zustand store that calls domain transitions and manages timers (setTimeout for preview/comparison delays)
- Timers live in application layer because they're side effects — domain stays pure

### 3. Character fetching: TanStack Query in infrastructure

**Choice**: Use TanStack Query to fetch characters from `https://rickandmortyapi.com/api/character`, with the query hook in `game/infrastructure/`.

**Why**: TanStack Query handles caching, loading states, and error handling. Characters are fetched once at game start and reused — fits the stale-while-revalidate model.

**Data flow**:
1. `game/domain/character.repository.ts`: Port interface `CharacterRepository { getCharacters(count: number): Promise<Character[]> }`
2. `game/infrastructure/character.api.ts`: Implements port — fetches from API, maps response to domain `Character` entity
3. `game/infrastructure/character.queries.ts`: TanStack Query wrapper (`useCharactersQuery`)
4. `game/application/useGame.ts`: Consumes query result, passes characters to domain's `board-generator`

### 4. Board generation: Fisher-Yates shuffle in domain

**Choice**: `game/domain/board-generator.ts` takes N characters, duplicates each (creating pairs), then shuffles using Fisher-Yates algorithm.

**Why**: Fisher-Yates is O(n), unbiased, and simple. Lives in domain because it's pure logic (array in → shuffled array out).

**Card structure**: Each card gets a unique `id` (for React keys and comparison) plus a `pairId` (shared between matching cards). Matching compares `pairId`, not `id`.

### 5. Routing: React Router with auth guard

**Choice**: Three routes — `/login`, `/signup`, `/game`. An `AuthGuard` component wraps protected routes and redirects to `/login` if no session exists.

**Route structure**:
```
/login    → LoginPage (public)
/signup   → SignUpPage (public)
/game     → GamePage (protected by AuthGuard)
/         → redirect to /game (if authenticated) or /login
```

### 6. Supabase client: Single instance in shared/infrastructure

**Choice**: Create the Supabase client in `shared/infrastructure/supabase.ts` using env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

**Why**: The Supabase client is cross-cutting (used by auth infrastructure). Placing it in `shared/infrastructure/` avoids duplicating the instance and keeps the auth slice's infrastructure layer focused on implementing the `AuthGateway` port.

### 7. UI styling: Tailwind CSS 4 utility classes

**Choice**: All styling with Tailwind utility classes. Shared UI primitives (`Button`, `Input`, `Spinner`, `Modal`) in `shared/ui/` accept style-related props via Tailwind class composition.

**Color palette** (derived from Figma):
- Background: dark navy (`#1a1a2e` or similar)
- Primary action: green (`#4CAF50` range)
- Card backs: teal/cyan
- Game completion: cream/light background
- Text: white on dark backgrounds

## Risks / Trade-offs

**[Supabase dependency for auth]** → The app depends on an external service for login. If Supabase is down, users can't authenticate. **Mitigation**: Supabase has 99.9% uptime SLA on free tier; session tokens are cached locally so authenticated users can continue playing.

**[Rick and Morty API availability]** → Character data comes from a public API with no SLA. **Mitigation**: TanStack Query caching means characters are fetched once per session. If the API is down at game start, show an error with retry option.

**[No email verification]** → Users can sign up with any email without verification. **Mitigation**: Acceptable for a demo/portfolio project. Can be enabled in Supabase dashboard later without code changes.

**[OAuth redirect flow]** → Google/GitHub OAuth requires configuring redirect URLs in both Supabase dashboard and provider consoles. **Mitigation**: Document setup steps in README. The app works with email/password alone if OAuth isn't configured.

**[3-second preview timing]** → Timer lives in application layer (Zustand store), not domain. If React re-renders unexpectedly, the timer could reset. **Mitigation**: Use `useRef` for timer cleanup; Zustand state updates are synchronous and don't cause unnecessary re-renders.
