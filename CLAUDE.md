# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rick and Morty memory card game with token-based authentication. Built with React 19, TypeScript 5, Vite 7, Tailwind CSS 4, and pnpm. The project uses spec-driven development — see `openspec/config.yaml` for the architectural specification.

## Commands

```bash
pnpm dev        # Start dev server
pnpm build      # TypeScript check + Vite production build
pnpm lint       # Biome linter check
pnpm lint:fix   # Auto-fix lint issues
pnpm format     # Format with Biome
pnpm preview    # Preview production build
```

No test framework is configured yet.

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

## Code Style

- **Biome** handles linting and formatting (not ESLint/Prettier)
- Indentation: tabs
- Quotes: double quotes
- Imports: use inline `type` keyword (`import { type Foo }`) — enforced by Biome's `useImportType` rule
- Commits: conventional commits enforced by Commitlint + Husky (`feat:`, `fix:`, `chore:`, etc.)

## Requirements

- Node.js >= 24 (see `.nvmrc`)
- pnpm 10.30.3 (exact versions enforced via `.npmrc` `save-exact=true`)
