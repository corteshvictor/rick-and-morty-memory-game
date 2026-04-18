import { type Card } from "./card.model";
import { type DifficultyLevel } from "./difficulty.model";
import { type GameMode, type VersusState } from "./multiplayer.model";

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
	mode: GameMode;
	versus: VersusState | null;
	difficulty: DifficultyLevel;
}

export const GAME_ACTION = {
	START_GAME: "START_GAME",
	END_SHUFFLE: "END_SHUFFLE",
	END_PREVIEW: "END_PREVIEW",
	FLIP_CARD: "FLIP_CARD",
	MATCH_FOUND: "MATCH_FOUND",
	MATCH_FAILED: "MATCH_FAILED",
	RESET: "RESET",
	SET_MODE: "SET_MODE",
	SETUP_VERSUS: "SETUP_VERSUS",
	SELECT_DIFFICULTY: "SELECT_DIFFICULTY",
} as const;

export type GameAction =
	| { type: typeof GAME_ACTION.START_GAME; cards: Card[] }
	| { type: typeof GAME_ACTION.END_SHUFFLE }
	| { type: typeof GAME_ACTION.END_PREVIEW }
	| { type: typeof GAME_ACTION.FLIP_CARD; cardId: string }
	| { type: typeof GAME_ACTION.MATCH_FOUND }
	| { type: typeof GAME_ACTION.MATCH_FAILED }
	| { type: typeof GAME_ACTION.RESET }
	| { type: typeof GAME_ACTION.SET_MODE; mode: GameMode }
	| { type: typeof GAME_ACTION.SETUP_VERSUS; name1: string; name2: string }
	| { type: typeof GAME_ACTION.SELECT_DIFFICULTY; difficulty: DifficultyLevel };
