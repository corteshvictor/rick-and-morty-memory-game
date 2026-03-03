import { type Card } from "./card.model";

export const GAME_PHASE = {
	IDLE: "idle",
	SHUFFLING: "shuffling",
	PREVIEW: "preview",
	PLAYING: "playing",
	COMPLETED: "completed",
} as const;

export type GamePhase = (typeof GAME_PHASE)[keyof typeof GAME_PHASE];

export interface GameStats {
	turns: number;
	matches: number;
	totalPairs: number;
}

export interface GameState {
	phase: GamePhase;
	cards: Card[];
	flippedCardIds: string[];
	stats: GameStats;
}

export const GAME_ACTION = {
	START_GAME: "START_GAME",
	END_SHUFFLE: "END_SHUFFLE",
	END_PREVIEW: "END_PREVIEW",
	FLIP_CARD: "FLIP_CARD",
	MATCH_FOUND: "MATCH_FOUND",
	MATCH_FAILED: "MATCH_FAILED",
	RESET: "RESET",
} as const;

export type GameAction =
	| { type: typeof GAME_ACTION.START_GAME; cards: Card[] }
	| { type: typeof GAME_ACTION.END_SHUFFLE }
	| { type: typeof GAME_ACTION.END_PREVIEW }
	| { type: typeof GAME_ACTION.FLIP_CARD; cardId: string }
	| { type: typeof GAME_ACTION.MATCH_FOUND }
	| { type: typeof GAME_ACTION.MATCH_FAILED }
	| { type: typeof GAME_ACTION.RESET };
