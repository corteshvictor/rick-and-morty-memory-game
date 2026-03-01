import { type Card } from "./card.model";

export type GamePhase = "idle" | "preview" | "playing" | "completed";

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

export type GameAction =
	| { type: "START_GAME"; cards: Card[] }
	| { type: "END_PREVIEW" }
	| { type: "FLIP_CARD"; cardId: string }
	| { type: "MATCH_FOUND" }
	| { type: "MATCH_FAILED" }
	| { type: "RESET" };
