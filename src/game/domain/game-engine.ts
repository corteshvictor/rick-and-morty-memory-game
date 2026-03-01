import { type GameAction, type GameState } from "./game.model";

export function createInitialState(): GameState {
	return {
		phase: "idle",
		cards: [],
		flippedCardIds: [],
		stats: { turns: 0, matches: 0, totalPairs: 0 },
	};
}

export function transition(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "START_GAME": {
			if (state.phase !== "idle") return state;
			const cards = action.cards.map((c) => ({
				...c,
				status: "faceUp" as const,
			}));
			return {
				phase: "preview",
				cards,
				flippedCardIds: [],
				stats: { turns: 0, matches: 0, totalPairs: cards.length / 2 },
			};
		}

		case "END_PREVIEW": {
			if (state.phase !== "preview") return state;
			return {
				...state,
				phase: "playing",
				cards: state.cards.map((c) => ({ ...c, status: "faceDown" })),
			};
		}

		case "FLIP_CARD": {
			if (state.phase !== "playing") return state;
			if (state.flippedCardIds.length >= 2) return state;

			const card = state.cards.find((c) => c.id === action.cardId);
			if (!card) return state;
			if (card.status !== "faceDown") return state;

			const newCards = state.cards.map((c) =>
				c.id === action.cardId ? { ...c, status: "faceUp" as const } : c,
			);
			const newFlipped = [...state.flippedCardIds, action.cardId];

			return {
				...state,
				cards: newCards,
				flippedCardIds: newFlipped,
				stats:
					newFlipped.length === 2
						? { ...state.stats, turns: state.stats.turns + 1 }
						: state.stats,
			};
		}

		case "MATCH_FOUND": {
			if (state.phase !== "playing") return state;
			if (state.flippedCardIds.length !== 2) return state;

			const newMatches = state.stats.matches + 1;
			const newCards = state.cards.map((c) =>
				state.flippedCardIds.includes(c.id)
					? { ...c, status: "matched" as const }
					: c,
			);
			const isComplete = newMatches === state.stats.totalPairs;

			return {
				...state,
				phase: isComplete ? "completed" : "playing",
				cards: newCards,
				flippedCardIds: [],
				stats: { ...state.stats, matches: newMatches },
			};
		}

		case "MATCH_FAILED": {
			if (state.phase !== "playing") return state;
			if (state.flippedCardIds.length !== 2) return state;

			return {
				...state,
				cards: state.cards.map((c) =>
					state.flippedCardIds.includes(c.id)
						? { ...c, status: "faceDown" as const }
						: c,
				),
				flippedCardIds: [],
			};
		}

		case "RESET": {
			return createInitialState();
		}

		default:
			return state;
	}
}
