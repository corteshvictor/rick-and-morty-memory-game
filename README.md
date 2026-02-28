# Rick and Morty Memory Game

Juego de memoria construido con React y TypeScript donde el jugador debe encontrar pares de cartas con personajes de Rick and Morty. La aplicación incluye autenticación, manejo de tokens y consume la API pública [The Rick and Morty API](https://rickandmortyapi.com/) para obtener la información de los personajes.

## Funcionalidades

- **Autenticación:** pantalla de login con manejo de tokens.
- **Inicio del juego:** las cartas se barajan, se muestran durante 3 segundos y se voltean boca abajo.
- **Desarrollo del juego:** el jugador selecciona dos cartas por turno. Si coinciden se eliminan y aumenta el contador de aciertos; si no coinciden se voltean de nuevo. Cada intento incrementa el contador de turnos.
- **Fin del juego:** al encontrar todos los pares se muestra el total de turnos con opciones para repetir el juego o volver al inicio.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/) con SWC
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Biome](https://biomejs.dev/) (linter + formatter)
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) + [Commitlint](https://commitlint.js.org/) (calidad de commits)

## Requisitos previos

- Node.js >= 24
- pnpm >= 10

## Instalacion y ejecucion

```bash
# Clonar el repositorio
git clone https://github.com/corteshvictor/rick-and-morty-memory-game.git
cd rick-and-morty-memory-game

# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm dev
```

## Scripts disponibles

| Script | Descripcion |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Compila TypeScript y genera el build de produccion |
| `pnpm preview` | Previsualiza el build de produccion |
| `pnpm lint` | Ejecuta el linter con Biome |
| `pnpm lint:fix` | Corrige problemas de lint automaticamente |
| `pnpm format` | Formatea el codigo con Biome |

## Autor

**Victor Cortes**
