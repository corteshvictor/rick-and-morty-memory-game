# Rick and Morty Memory Game

Juego de memoria construido con React y TypeScript donde el jugador debe encontrar pares de cartas con personajes de Rick and Morty. La aplicación incluye autenticación con manejo de tokens y consume la [Rick and Morty API](https://rickandmortyapi.com/) para obtener los personajes.

## Funcionalidades

- **Registro e inicio de sesión:** autenticación con email/contraseña y OAuth (GitHub, Gmail) a través de Supabase. Incluye confirmación de correo electrónico.
- **Inicio del juego:** las cartas se barajan con Fisher-Yates, se muestran durante 3 segundos (fase de preview) y luego se voltean boca abajo.
- **Desarrollo del juego:** el jugador selecciona dos cartas por turno. Si coinciden quedan visibles y aumenta el contador de aciertos; si no coinciden se voltean de nuevo. Cada par de selecciones incrementa el contador de turnos.
- **Fin del juego:** al encontrar todos los pares se muestra el total de turnos con animación de confeti y opciones para repetir o cerrar sesión.

## Demo
<p align="center">
  <img src="https://github.com/user-attachments/assets/d04cf086-c91a-4fe4-a970-702be40a6a2f" alt="rick-and-morty" />
</p>

## Enfoque de desarrollo

### Arquitectura: Hexagonal + Vertical Slicing + Screaming Architecture

El proyecto combina tres conceptos arquitectónicos:

- **Arquitectura hexagonal:** separa dominio, aplicación e infraestructura mediante ports (interfaces) y adapters (implementaciones), aislando la lógica de negocio de frameworks y servicios externos.
- **Vertical slicing:** cada feature (`auth/`, `game/`) es un corte vertical que contiene todas sus capas (domain, application, infrastructure), en vez de organizar por capas técnicas horizontales (`components/`, `hooks/`, `services/`).
- **Screaming architecture:** la estructura de carpetas y archivos comunica el propósito del sistema. Al ver `game-engine.ts`, `card-matching.ts` o `auth.gateway.ts` se entiende de qué trata la aplicación, no de qué framework usa.

```
src/
├── auth/                  # Feature de autenticación
│   ├── domain/            # Modelos, ports (interfaces)
│   ├── application/       # Componentes React, stores, hooks
│   └── infrastructure/    # Implementación con Supabase
├── game/                  # Feature del juego
│   ├── domain/            # Game engine, modelos de cartas, board generator
│   ├── application/       # Componentes del tablero, store de Zustand
│   └── infrastructure/    # Fetching de personajes con TanStack Query
├── shared/                # Código transversal (UI primitives, Supabase client)
└── app/                   # Router, providers, layouts
```

**Regla de dependencias:** `domain/` no depende de nada externo (ni React, ni Supabase, ni APIs). `application/` depende de `domain/`. `infrastructure/` implementa los ports definidos en `domain/`. Las comunicaciones entre features pasan exclusivamente por barrel exports (`index.ts`).

### Decisiones técnicas

| Decisión | Razonamiento |
|---|---|
| **Arquitectura hexagonal** | Permite testear la lógica de negocio (game engine, card matching) de forma aislada, sin frameworks ni servicios externos. Los ports definen contratos claros entre capas. |
| **Game engine como máquina de estados** | El juego tiene fases bien definidas (idle → shuffling → preview → playing → completed) y transiciones explícitas. Modelarlo como un reducer puro (`transition(state, action) → state`) hace la lógica predecible y testeable sin DOM. |
| **Supabase para autenticación** | Proporciona auth con tokens (JWT) lista para usar, sin necesidad de montar un backend propio. Soporta email/contraseña y OAuth. |
| **TanStack Query para data fetching** | Maneja cache, estados de carga/error y deduplicación de requests de forma declarativa, evitando useEffect manuales para el fetching. |
| **Zustand para estado local** | Un store por feature (auth store, game store). Más simple que Redux para este alcance, sin boilerplate de actions/reducers globales. |
| **Zod para validación de env vars** | El plugin de Vite valida las variables de entorno al arrancar. Si faltan credenciales de Supabase, la app falla rápido con un mensaje claro en vez de errores crípticos en runtime. |
| **Biome en lugar de ESLint + Prettier** | Linter y formatter unificados en una sola herramienta, más rápida y con menos configuración. |
| **Fisher-Yates shuffle** | Algoritmo de barajado uniforme O(n) que garantiza distribución equitativa de todas las permutaciones posibles. |

## Tech Stack

**Core:** React 19 · TypeScript 5 · Vite 7 (SWC) · Tailwind CSS 4

**Estado y data:** Zustand · TanStack Query · Zod

**Servicios externos:** Supabase (auth) · Rick and Morty API (personajes)

**Testing:** Vitest · Testing Library · MSW · Playwright · Storybook

**Calidad de código:** Biome · Husky · lint-staged · Commitlint

## Instrucciones para correr el proyecto

### Requisitos previos

- Node.js >= 24 (ver `.nvmrc`)
- pnpm >= 10

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/corteshvictor/rick-and-morty-memory-game.git
cd rick-and-morty-memory-game

# Instalar dependencias
pnpm install
```

### Configuración de entorno

Copiar `.env.example` a `.env` y completar las credenciales de Supabase:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=<tu-url-de-supabase>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<tu-anon-key>
VITE_RICK_AND_MORTY_API_URL=https://rickandmortyapi.com/api
```

> Sin las variables de Supabase configuradas, Vite no arrancará (validación con Zod al inicio).

### Ejecución

```bash
pnpm dev       # Servidor de desarrollo
pnpm build     # Build de producción (TypeScript check + Vite)
pnpm preview   # Previsualizar build de producción
```

### Scripts disponibles

| Script | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Compila TypeScript y genera el build de producción |
| `pnpm preview` | Previsualiza el build de producción |
| `pnpm lint` | Ejecuta el linter con Biome |
| `pnpm lint:fix` | Corrige problemas de lint automáticamente |
| `pnpm format` | Formatea el código con Biome |
| `pnpm storybook` | Inicia Storybook en el puerto 6006 |
| `pnpm test` | Ejecuta Vitest en modo watch |
| `pnpm test:ci` | Ejecuta todos los tests (modo CI) |
| `pnpm test:coverage` | Tests con reporte de cobertura V8 |
| `pnpm e2e` | Ejecuta tests E2E con Playwright |
| `pnpm e2e:ui` | Tests E2E con interfaz visual de Playwright |

## Autor

**Victor Cortés**
