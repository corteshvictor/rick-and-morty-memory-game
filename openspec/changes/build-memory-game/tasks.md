## 1. Project Setup & Dependencies

- [x] 1.1 Install runtime dependencies: `@supabase/supabase-js`, `zustand`, `@tanstack/react-query`, `react-router`
- [x] 1.2 Create `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- [x] 1.3 Create folder structure: `src/app/`, `src/auth/`, `src/game/`, `src/shared/ui/`, `src/shared/infrastructure/`

## 2. Shared Infrastructure & UI Primitives

- [x] 2.1 Create Supabase client singleton in `shared/infrastructure/supabase.ts` reading env vars
- [x] 2.2 Create shared UI primitives: `Button`, `Input`, `Spinner`, `Modal` in `shared/ui/`

## 3. App Shell (Router, Providers, Layouts)

- [x] 3.1 Create `app/providers.tsx` wrapping `QueryClientProvider` and `BrowserRouter`
- [x] 3.2 Create `app/layout/AuthLayout.tsx` — centered card, dark background, Rick and Morty logo
- [x] 3.3 Create `app/layout/GameLayout.tsx` — header with logo, user info, logout button
- [x] 3.4 Create `app/router.tsx` with routes: `/login`, `/signup`, `/game`, `/` redirect
- [x] 3.5 Replace `src/App.tsx` and `src/main.tsx` to mount the app shell

## 4. Auth Domain Layer

- [x] 4.1 Create `auth/domain/auth.model.ts` — `AuthUser`, `Credentials`, `AuthStatus` types
- [x] 4.2 Create `auth/domain/auth.repository.ts` — `AuthGateway` port interface (signUp, signIn, signInWithOAuth, signOut, onAuthStateChange, getSession)

## 5. Auth Infrastructure Layer

- [x] 5.1 Create `auth/infrastructure/auth.api.ts` implementing `AuthGateway` with Supabase client calls

## 6. Auth Application Layer

- [x] 6.1 Create `auth/application/auth.store.ts` — Zustand store with auth state, actions, and `onAuthStateChange` listener
- [x] 6.2 Create `auth/application/AuthGuard.tsx` — redirect to `/login` if unauthenticated, spinner while loading
- [x] 6.3 Create `auth/application/LoginPage.tsx` — sign in form (email/password) + OAuth buttons (Google, GitHub)
- [x] 6.4 Create `auth/application/SignUpPage.tsx` — sign up form (email/password) + OAuth buttons
- [x] 6.5 Create `auth/index.ts` barrel export

## 7. Game Domain Layer

- [x] 7.1 Create `game/domain/card.model.ts` — `Card`, `CardStatus` types
- [x] 7.2 Create `game/domain/game.model.ts` — `GameState`, `GamePhase`, `GameStats`, `GameAction` types
- [x] 7.3 Create `game/domain/board-generator.ts` — takes characters, creates pairs, Fisher-Yates shuffle
- [x] 7.4 Create `game/domain/card-matching.ts` — compares two cards by `pairId`
- [x] 7.5 Create `game/domain/game-engine.ts` — pure state machine: `transition(state, action) → state`
- [x] 7.6 Create `game/domain/character.repository.ts` — `CharacterRepository` port interface

## 8. Game Infrastructure Layer

- [x] 8.1 Create `game/infrastructure/character.api.ts` — implements `CharacterRepository`, fetches from Rick and Morty API
- [x] 8.2 Create `game/infrastructure/character.queries.ts` — TanStack Query hook `useCharactersQuery`

## 9. Game Application Layer

- [x] 9.1 Create `game/application/game.store.ts` — Zustand store wiring domain engine, managing timers (3s preview, 1s comparison)
- [x] 9.2 Create `game/application/GameCard.tsx` — card component with flip animation (face-up/face-down/removed states)
- [x] 9.3 Create `game/application/GameBoard.tsx` — grid layout rendering cards
- [x] 9.4 Create `game/application/GameHeader.tsx` — displays match counter and turn counter
- [x] 9.5 Create `game/application/GameOverModal.tsx` — congratulations message, turn count, "Jugar de nuevo" and "Inicio" buttons
- [x] 9.6 Create `game/application/GamePage.tsx` — orchestrates board, header, modal; connects store and query
- [x] 9.7 Create `game/application/useGame.ts` — hook wiring character query → board generator → game store
- [x] 9.8 Create `game/index.ts` barrel export

## 10. Styling & Polish

- [x] 10.1 Apply Tailwind styles to auth pages matching Figma (dark navy background, green buttons, centered forms)
- [x] 10.2 Apply Tailwind styles to game board matching Figma (card grid, teal card backs, header bar)
- [x] 10.3 Style GameOverModal matching Figma (cream background, congratulations text, action buttons)
- [x] 10.4 Add CSS card flip animation (transform/perspective for face-up/face-down transition)

## 11. Integration & Verification

- [x] 11.1 Verify full auth flow: sign up → logout → sign in → access game
- [x] 11.2 Verify OAuth flow: Google and GitHub login redirect and callback
- [x] 11.3 Verify game flow: preview → play → match all pairs → completion → replay
- [x] 11.4 Run `pnpm lint` and `pnpm build` — zero errors

## 12. Post-implementation Fixes

- [x] 12.1 Fix lazy Supabase client initialization (`getSupabase()`) to prevent white screen without `.env`
- [x] 12.2 Migrate `VITE_SUPABASE_ANON_KEY` → `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- [x] 12.3 Fix auth store: update `user`/`status` on successful `signIn`/`signUp`/`signOut`
- [x] 12.4 Fix a11y: Spinner `div role="status"` → `<output>`, GameCard `div role="button"` → `<button>`
- [x] 12.5 Fix game board grid: add `w-full` to `GameBoard` grid container
- [x] 12.6 Replace card back gradient with `card-back.webp` from Figma assets
- [x] 12.7 Integrate Figma assets: `ricky_morty_logo.svg` in headers, `game-background.png` as game background
