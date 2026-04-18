import { CARD_STATUS, type Card } from "./card.model";
import { DEFAULT_DIFFICULTY, type DifficultyLevel } from "./difficulty.model";
import {
	GAME_ACTION,
	GAME_PHASE,
	type GameAction,
	type GameState,
} from "./game.model";
import {
	DEFAULT_GAME_MODE,
	GAME_MODE,
	type GameMode,
} from "./multiplayer.model";
import {
	addMatchToPlayer,
	createVersusState,
	getOpponent,
} from "./turn-manager";

export function createInitialState(): GameState {
	return {
		phase: GAME_PHASE.IDLE,
		cards: [],
		flippedCardIds: [],
		stats: { turns: 0, matches: 0, totalPairs: 0 },
		mode: DEFAULT_GAME_MODE,
		versus: null,
		difficulty: DEFAULT_DIFFICULTY,
	};
}

function handleSetMode(state: GameState, mode: GameMode): GameState {
	if (state.phase !== GAME_PHASE.IDLE) return state;
	return {
		...state,
		mode,
		versus: null,
	};
}

function handleSetupVersus(
	state: GameState,
	name1: string,
	name2: string,
): GameState {
	if (state.phase !== GAME_PHASE.IDLE) return state;
	return {
		...state,
		mode: GAME_MODE.VERSUS,
		versus: createVersusState(name1, name2),
	};
}

function handleStartGame(state: GameState, cards: Card[]): GameState {
	if (state.phase !== GAME_PHASE.IDLE) return state;
	return {
		...state,
		phase: GAME_PHASE.SHUFFLING,
		cards,
		flippedCardIds: [],
		stats: { turns: 0, matches: 0, totalPairs: cards.length / 2 },
	};
}

function handleEndShuffle(state: GameState): GameState {
	if (state.phase !== GAME_PHASE.SHUFFLING) return state;
	return {
		...state,
		phase: GAME_PHASE.PREVIEW,
		cards: state.cards.map((card) => ({
			...card,
			status: CARD_STATUS.FACE_UP,
		})),
	};
}

function handleEndPreview(state: GameState): GameState {
	if (state.phase !== GAME_PHASE.PREVIEW) return state;
	return {
		...state,
		phase: GAME_PHASE.PLAYING,
		cards: state.cards.map((card) => ({
			...card,
			status: CARD_STATUS.FACE_DOWN,
		})),
	};
}

function handleFlipCard(state: GameState, cardId: string): GameState {
	if (state.phase !== GAME_PHASE.PLAYING) return state;
	if (state.flippedCardIds.length >= 2) return state;

	const targetCard = state.cards.find((card) => card.id === cardId);
	if (!targetCard) return state;
	if (targetCard.status !== CARD_STATUS.FACE_DOWN) return state;

	const updatedCards = state.cards.map((card) =>
		card.id === cardId ? { ...card, status: CARD_STATUS.FACE_UP } : card,
	);
	const updatedFlipped = [...state.flippedCardIds, cardId];

	return {
		...state,
		cards: updatedCards,
		flippedCardIds: updatedFlipped,
		stats:
			updatedFlipped.length === 2
				? { ...state.stats, turns: state.stats.turns + 1 }
				: state.stats,
	};
}

function handleMatchFound(state: GameState): GameState {
	if (state.phase !== GAME_PHASE.PLAYING) return state;
	if (state.flippedCardIds.length !== 2) return state;

	const updatedMatches = state.stats.matches + 1;
	const updatedCards = state.cards.map((card) =>
		state.flippedCardIds.includes(card.id)
			? { ...card, status: CARD_STATUS.MATCHED }
			: card,
	);
	const isComplete = updatedMatches === state.stats.totalPairs;

	const updatedVersus =
		state.mode === GAME_MODE.VERSUS && state.versus
			? {
					...state.versus,
					players: addMatchToPlayer(
						state.versus.players,
						state.versus.activePlayerId,
					),
					// El jugador que hizo match SIGUE JUGANDO (no cambia activePlayerId)
				}
			: state.versus;

	return {
		...state,
		phase: isComplete ? GAME_PHASE.COMPLETED : GAME_PHASE.PLAYING,
		cards: updatedCards,
		flippedCardIds: [],
		stats: { ...state.stats, matches: updatedMatches },
		versus: updatedVersus,
	};
}

function handleMatchFailed(state: GameState): GameState {
	if (state.phase !== GAME_PHASE.PLAYING) return state;
	if (state.flippedCardIds.length !== 2) return state;

	const updatedVersus =
		state.mode === GAME_MODE.VERSUS && state.versus
			? {
					...state.versus,
					activePlayerId: getOpponent(state.versus.activePlayerId),
				}
			: state.versus;

	return {
		...state,
		cards: state.cards.map((card) =>
			state.flippedCardIds.includes(card.id)
				? { ...card, status: CARD_STATUS.FACE_DOWN }
				: card,
		),
		flippedCardIds: [],
		versus: updatedVersus,
	};
}

function handleSelectDifficulty(
	state: GameState,
	difficulty: DifficultyLevel,
): GameState {
	if (state.phase !== GAME_PHASE.IDLE) return state;
	return {
		...state,
		difficulty,
	};
}

export function transition(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case GAME_ACTION.START_GAME:
			return handleStartGame(state, action.cards);
		case GAME_ACTION.END_SHUFFLE:
			return handleEndShuffle(state);
		case GAME_ACTION.END_PREVIEW:
			return handleEndPreview(state);
		case GAME_ACTION.FLIP_CARD:
			return handleFlipCard(state, action.cardId);
		case GAME_ACTION.MATCH_FOUND:
			return handleMatchFound(state);
		case GAME_ACTION.MATCH_FAILED:
			return handleMatchFailed(state);
		case GAME_ACTION.RESET:
			return { ...createInitialState(), difficulty: state.difficulty };
		case GAME_ACTION.SET_MODE:
			return handleSetMode(state, action.mode);
		case GAME_ACTION.SETUP_VERSUS:
			return handleSetupVersus(state, action.name1, action.name2);
		case GAME_ACTION.SELECT_DIFFICULTY:
			return handleSelectDifficulty(state, action.difficulty);
		default:
			return state;
	}
}
