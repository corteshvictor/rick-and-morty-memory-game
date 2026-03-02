## Why

The initial `build-memory-game` implementation has critical bugs that prevent the app from working end-to-end. Authentication succeeds but does not redirect to the game page. The game board renders a spinner instead of cards — the card grid and 3D flip animations are broken. Additionally, post-implementation fixes (lazy Supabase init, publishable key migration, a11y improvements) are not tracked in the specs, causing documentation drift.

## What Changes

- Fix auth store: update `user` and `status` on successful `signIn`, `signUp`, and `signOut` so React Router triggers navigation
- Fix game board rendering: diagnose and fix why cards do not appear after character fetch completes (CSS 3D transforms, Tailwind CSS 4 compatibility, API response handling)
- Fix card flip animation: ensure `perspective`, `transform-style: preserve-3d`, `backface-visibility`, and `rotateY` work correctly with Tailwind CSS 4
- Update specs to reflect post-implementation changes: lazy Supabase client, `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, a11y semantic elements

## Capabilities

### New Capabilities

_None — this is a bugfix and documentation sync change._

### Modified Capabilities

- `token-auth`: Auth store must update state on successful sign in/sign up/sign out to trigger route navigation. Environment variable renamed from `VITE_SUPABASE_ANON_KEY` to `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`. Supabase client uses lazy initialization pattern.
- `memory-game`: Game board must render 12 visible cards in a 4-column grid with working 3D flip animations. Cards must display character images face-up during preview phase.
- `app-shell`: Environment variable renamed. Supabase client initialization is lazy (deferred until first use) to prevent crashes without `.env`.

## Non-goals

- Redesigning the game UI beyond fixing what's broken
- Adding new features or game mechanics
- Changing the architecture or dependency structure
- Adding test coverage

## Impact

- **Modified files**: `auth.store.ts`, `GameCard.tsx`, `index.css`, `character.api.ts`, `supabase.ts`
- **Spec updates**: Delta specs for `token-auth`, `memory-game`, `app-shell` reflecting actual implementation state
- **No new dependencies**
