## 1. Fix Auth Store State Updates

- [x] 1.1 Update `signIn` in `auth.store.ts` to call `set({ user: result.user, status: "authenticated" })` on success
- [x] 1.2 Update `signUp` in `auth.store.ts` to call `set({ user: result.user, status: "authenticated" })` on success
- [x] 1.3 Update `signOut` in `auth.store.ts` to call `set({ user: null, status: "unauthenticated" })` on success

## 2. Fix Game Board Rendering

- [x] 2.1 Diagnose why cards are not rendering: run the app with Chrome DevTools, check if Rick and Morty API call succeeds and returns character data
- [x] 2.2 Verify `useGame` hook data flow: ensure `characters` from TanStack Query reaches `generateBoard()` and `startGame()` is called
- [x] 2.3 Fix `GameCard.tsx` 3D CSS: verify `perspective-[600px]`, `transform-3d`, `backface-hidden`, `rotate-y-180` work in Tailwind CSS 4 — replace custom CSS in `index.css` with `@utility` directives or native Tailwind utilities where supported
- [x] 2.4 Ensure cards have visible dimensions: verify `aspect-square` and grid layout produce cards with adequate size in the 4-column grid
- [x] 2.5 Replace teal gradient card back with `card-back.webp` image from `@/assets/images/card-back.webp` in `GameCard.tsx`
- [x] 2.6 Integrate Figma assets into layouts: `game-background.png` as game page background, `ricky_morty_logo.svg` in headers, `portal-poster.png` or `hero-banner.png` where applicable
- [x] 2.7 Test full game board render: confirm 12 cards appear face-up during preview, flip face-down after 3 seconds showing `card-back.webp`, and are clickable during playing phase

## 3. Update Specs and Documentation

- [x] 3.1 Update `build-memory-game/tasks.md` to add section 12 reflecting post-implementation fixes (lazy Supabase init, publishable key rename, auth store state updates, a11y fixes)
- [x] 3.2 Verify `build-memory-game` specs align with current implementation: `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, lazy Supabase client, semantic HTML elements

## 4. Fix GameOverModal "Inicio" Button

- [x] 4.1 Fix "Inicio" button in `GameOverModal.tsx`: call `signOut()` from auth store before navigating, so the user returns to the login page (vista principal) instead of looping back to `/game`
- [x] 4.2 Rename button labels to match spec: "Repetir" (replay) and "Inicio" (sign out + redirect to login)

## 5. Fix Game Store Reset on Re-authentication

- [x] 5.1 Reset game store on `useGame` mount so re-authenticating after "Inicio" starts a fresh game instead of showing the completed modal with stale state

## 6. Fix OAuth Provider Error Handling

- [x] 6.1 Use `skipBrowserRedirect: true` in `signInWithOAuth` to prevent navigating away to a raw JSON error page when a provider is not enabled in Supabase
- [x] 6.2 Fetch the authorization URL before redirecting; if Supabase returns a 400 "provider is not enabled", show a friendly error in the login form instead of leaving the app

## 7. Add Password Visibility Toggle

- [x] 7.1 Add show/hide password toggle button to `Input` component when `type="password"`, with eye/eye-off SVG icons and `aria-label` for accessibility

## 8. Verification

- [x] 8.1 Verify end-to-end: sign in → redirect to `/game` → 12 cards visible → card flip works → match/mismatch logic → game completion modal
- [x] 8.2 Verify "Inicio" → sign out → re-login → fresh game starts (no stale completed modal)
- [x] 8.3 Verify OAuth buttons show friendly error when providers are not enabled in Supabase
- [x] 8.4 Verify password toggle shows/hides text in login and signup forms
- [x] 8.5 Run `pnpm lint` and `pnpm build` — zero errors
