import { create } from "zustand";
import { type Card } from "@/game/domain/card.model";
import { doCardsMatch } from "@/game/domain/card-matching";
import { GAME_ACTION, type GameState } from "@/game/domain/game.model";
import { createInitialState, transition } from "@/game/domain/game-engine";

interface GameStore extends GameState {
	startGame: (cards: Card[]) => void;
	flipCard: (cardId: string) => void;
	reset: () => void;
}

const PREVIEW_DURATION = 3000;
const COMPARISON_DURATION = 1000;

export const useGameStore = create<GameStore>((set, get) => ({
	...createInitialState(),

	startGame: (cards) => {
		const next = transition(get(), { type: GAME_ACTION.START_GAME, cards });
		set(next);

		setTimeout(() => {
			const afterPreview = transition(get(), { type: GAME_ACTION.END_SHUFFLE });
			set(afterPreview);
		}, PREVIEW_DURATION);
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

	reset: () => {
		set(createInitialState());
	},
}));
