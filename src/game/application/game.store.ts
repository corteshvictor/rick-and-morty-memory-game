import { create } from "zustand";
import { type Card } from "@/game/domain/card.model";
import { doCardsMatch } from "@/game/domain/card-matching";
import {
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
} from "@/game/domain/difficulty.model";
import {
	GAME_ACTION,
	GAME_PHASE,
	type GameState,
} from "@/game/domain/game.model";
import {
	createInitialState,
	createStateBackToSettings,
	transition,
} from "@/game/domain/game-engine";
import { type GameMode, PLAYER_ID } from "../domain/multiplayer.model";

interface GameStore extends GameState {
	startGame: (cards: Card[]) => void;
	endShuffle: () => void;
	flipCard: (cardId: string) => void;
	clear: () => void;
	backToSettings: () => void;
	setMode: (mode: GameMode) => void;
	setupVersus: (name1: string, name2: string) => void;
	selectDifficulty: (level: DifficultyLevel) => void;
}

const COMPARISON_DURATION = 1000;

let previewTimerId: ReturnType<typeof setTimeout> | null = null;

function clearPreviewTimer() {
	if (previewTimerId) {
		clearTimeout(previewTimerId);
		previewTimerId = null;
	}
}

export const useGameStore = create<GameStore>((set, get) => ({
	...createInitialState(),

	startGame: (cards) => {
		clearPreviewTimer();
		const current = get();
		let base: GameState = current;
		if (current.phase !== GAME_PHASE.IDLE) {
			// Reset to IDLE preserving mode, player names and difficulty (matches reset to 0)
			const initial = createInitialState();
			base = {
				...initial,
				mode: current.mode,
				difficulty: current.difficulty,
				versus: current.versus
					? {
							players: [
								{ ...current.versus.players[0], matches: 0 },
								{ ...current.versus.players[1], matches: 0 },
							],
							activePlayerId: PLAYER_ID.ONE,
						}
					: null,
			};
		}
		const next = transition(base, { type: GAME_ACTION.START_GAME, cards });
		set(next);
	},

	endShuffle: () => {
		const next = transition(get(), { type: GAME_ACTION.END_SHUFFLE });
		set(next);
		const previewTime = DIFFICULTY_CONFIGS[next.difficulty].previewTime;

		previewTimerId = setTimeout(() => {
			previewTimerId = null;
			const afterPreview = transition(get(), { type: GAME_ACTION.END_PREVIEW });
			set(afterPreview);
		}, previewTime);
	},

	flipCard: (cardId) => {
		const state = get();
		const next = transition(state, { type: GAME_ACTION.FLIP_CARD, cardId });
		if (next === state) return;
		set(next);

		if (next.flippedCardIds.length === 2) {
			const [firstId, secondId] = next.flippedCardIds;
			const firstCard = next.cards.find((c) => c.id === firstId);
			const secondCard = next.cards.find((c) => c.id === secondId);

			if (firstCard && secondCard) {
				const isMatch = doCardsMatch(firstCard, secondCard);

				setTimeout(() => {
					const action = isMatch
						? ({ type: GAME_ACTION.MATCH_FOUND } as const)
						: ({ type: GAME_ACTION.MATCH_FAILED } as const);
					const result = transition(get(), action);
					set(result);
				}, COMPARISON_DURATION);
			}
		}
	},

	clear: () => {
		clearPreviewTimer();
		set(createInitialState());
	},

	backToSettings: () => {
		clearPreviewTimer();
		set(createStateBackToSettings(get()));
	},

	setMode: (mode) => {
		const next = transition(get(), { type: GAME_ACTION.SET_MODE, mode });
		set(next);
	},

	setupVersus: (name1, name2) => {
		const next = transition(get(), {
			type: GAME_ACTION.SETUP_VERSUS,
			name1,
			name2,
		});
		set(next);
	},

	selectDifficulty: (level) => {
		const next = transition(get(), {
			type: GAME_ACTION.SELECT_DIFFICULTY,
			difficulty: level,
		});
		set(next);
	},
}));
