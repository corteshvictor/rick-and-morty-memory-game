# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rick and Morty memory card game with token-based authentication. Built with React 19, TypeScript 5, Vite 7, Tailwind CSS 4, and pnpm. The project uses spec-driven development — see `openspec/config.yaml` for the architectural specification.

## Environment Setup

Copy `.env.example` to `.env` and fill in the Supabase credentials:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

## Commands

```bash
pnpm dev            # Start dev server
pnpm build          # TypeScript check + Vite production build
pnpm lint           # Biome linter check
pnpm lint:fix       # Auto-fix lint issues
pnpm format         # Format with Biome
pnpm preview        # Preview production build
pnpm storybook      # Start Storybook dev server on port 6006
pnpm build-storybook # Build static Storybook site
```

### Testing

```bash
pnpm test                          # Run Vitest in watch mode (unit + storybook projects)
pnpm test:ci                       # Run all tests once (CI mode)
pnpm test:coverage                 # Run with V8 coverage
pnpm vitest --project unit         # Run only unit tests
pnpm vitest --project storybook    # Run only Storybook interaction tests
pnpm vitest run src/auth           # Run tests in a specific directory
pnpm e2e                           # Run Playwright E2E tests (auto-starts dev server)
pnpm e2e:ui                        # Run E2E with Playwright UI
pnpm e2e:report                    # Show last E2E HTML report
```

## Storybook

Component documentation and visual development environment. Stories live alongside components (`*.stories.tsx`). Includes `@storybook/addon-a11y` for accessibility auditing and `@storybook/addon-docs` for auto-generated docs. Stories also double as interaction tests via the `@storybook/addon-vitest` integration (see Testing Stack below).

## Testing Stack

- **Unit/Integration**: Vitest + Testing Library + happy-dom. Tests live alongside source files (`*.test.tsx`).
- **API mocking**: MSW (Mock Service Worker). Handlers in `src/mocks/handlers/`, server setup in `src/mocks/node.ts`, auto-started via `src/test-setup.ts`.
- **Storybook interaction tests**: Stories (`*.stories.tsx`) run as Vitest browser tests via `@storybook/addon-vitest` + Playwright (headless Chromium).
- **E2E**: Playwright. Tests in `e2e/` directory, config in `playwright.config.ts`. Runs against Chromium, Firefox, and WebKit.
- **Vitest projects** (configured in `vite.config.ts`): `unit` (happy-dom) and `storybook` (browser/Playwright).

## Architecture

**Hexagonal Architecture + Vertical Slicing + Screaming Architecture**

Features are organized by domain (`auth/`, `game/`), not by technical layer. Each feature slice has three layers:

- **`domain/`** — Pure TypeScript only. Entities, business rules, port interfaces. Zero framework dependencies (no React, Zustand, TanStack Query, or browser APIs).
- **`application/`** — React components, hooks, Zustand stores (one per feature). Imports from `domain/` and consumes `infrastructure/` through port interfaces.
- **`infrastructure/`** — API clients (TanStack Query), localStorage adapters, external services. Implements port interfaces defined in `domain/`.

Cross-cutting code:
- `shared/ui/` — Reusable UI primitives
- `shared/infrastructure/` — HTTP client config
- `app/` — Router, providers, layouts

**Dependency rule**: domain → nothing; application → domain; infrastructure → domain. Cross-slice imports go through `index.ts` barrel exports only.

## Path Alias

`@/*` maps to `./src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`). Use `@/game/domain/game-engine` style imports.

## Key External Services

- **Supabase** — Authentication backend (token-based auth). Client singleton in `shared/infrastructure/supabase.ts`.
- **Rick and Morty API** (`https://rickandmortyapi.com`) — Character data for game cards, fetched via TanStack Query in `game/infrastructure/`.

## Routes

- `/login` — Login page (public)
- `/signup` — Sign-up page (public)
- `/game` — Game board (protected by `AuthGuard`)
- `*` — Redirects to `/game` if authenticated, `/login` otherwise

## Code Style

- **Biome** handles linting and formatting (not ESLint/Prettier)
- Indentation: tabs
- Quotes: double quotes
- Imports: use inline `type` keyword (`import { type Foo }`) — enforced by Biome's `useImportType` rule
- Commits: conventional commits enforced by Commitlint + Husky (`feat:`, `fix:`, `chore:`, etc.)

## Git Hooks

- **pre-commit** — Runs `lint-staged` (Biome check + format on staged `*.{js,jsx,ts,tsx,cjs,mjs,json}` files)
- **commit-msg** — Validates conventional commit format via Commitlint

## Requirements

- Node.js >= 24 (see `.nvmrc`)
- pnpm 10.30.3 (exact versions enforced via `.npmrc` `save-exact=true`)
