## Context

The `build-memory-game` change delivered the full app scaffold but has three critical bugs preventing end-to-end usage:

1. **Auth store does not update on success**: `signIn`, `signUp`, and `signOut` only handle errors — on success they do nothing, so `status` stays `"loading"` and `<Navigate to="/game">` never triggers.
2. **Game board renders empty**: After logging in, the game page shows counters and a spinner but no cards. The Rick and Morty API call may succeed, but the cards are either not being rendered or are invisible due to CSS issues.
3. **Spec drift**: Several post-implementation fixes (lazy Supabase init, publishable key rename, a11y semantic elements) are not reflected in the specs.

## Goals / Non-Goals

**Goals:**

- Auth flow works end-to-end: sign up → redirect to game, sign in → redirect to game, sign out → redirect to login
- Game board renders 12 visible cards in a 4-column grid with working 3D flip animations
- Specs match the actual implementation state

**Non-Goals:**

- Redesigning the UI or changing game mechanics
- Adding new auth features (password reset, email verification)
- Adding test coverage

## Decisions

### 1. Auth store: set user and status on success

**Fix**: After `signIn`/`signUp` succeed, call `set({ user: result.user, status: "authenticated" })`. After `signOut` succeeds, call `set({ user: null, status: "unauthenticated" })`.

**Why not rely only on `onAuthStateChange`**: The Supabase `onAuthStateChange` listener fires asynchronously. There is a race condition where the component reads stale Zustand state before the listener fires. Explicitly setting state in the action guarantees immediate re-render and navigation.

### 2. Game board CSS: use Tailwind CSS 4 native utilities where possible

**Problem**: The custom CSS classes in `index.css` (`.perspective-\[600px\]`, `.transform-3d`, `.backface-hidden`, `.rotate-y-180`) may conflict with or be overridden by Tailwind CSS 4's layer system. Tailwind CSS 4 natively supports `perspective-[600px]` and `backface-hidden` as utilities.

**Fix**: Verify which utilities work natively in Tailwind CSS 4 and remove duplicates from `index.css`. For utilities not natively supported (`transform-style: preserve-3d`), use `@utility` directive instead of plain CSS classes to ensure correct layer ordering. Additionally, verify the `GameCard` component structure renders visible cards with proper dimensions.

### 3. Game board rendering: verify data flow end-to-end

**Fix**: Trace the complete data flow: API fetch → TanStack Query → `useGame` hook → `generateBoard` → `startGame` → `GameBoard` render. Add defensive checks if needed. Ensure `character.api.ts` handles the Rick and Morty API response format correctly for both single and multiple character responses.

### 4. Spec sync: use MODIFIED delta specs

**Fix**: Create delta specs for `token-auth`, `memory-game`, and `app-shell` documenting changes to requirements that have shifted since the original spec was written:
- `VITE_SUPABASE_ANON_KEY` → `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Supabase client uses lazy initialization
- Auth store updates state on action success
- Spinner uses `<output>` element, GameCard uses `<button>` element

## Risks / Trade-offs

**[Duplicate state updates]** → Setting state both in the action and via `onAuthStateChange` means the store updates twice on auth events. **Mitigation**: This is harmless — Zustand batches synchronous updates, and the second update is a no-op if state is already correct.

**[CSS layer specificity]** → Removing custom CSS and relying on Tailwind CSS 4 utilities may behave differently across browsers for 3D transforms. **Mitigation**: Test on Chrome and Firefox. The `@utility` directive ensures correct specificity within Tailwind's layer system.
