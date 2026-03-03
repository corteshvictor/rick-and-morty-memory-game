import { useCallback, useEffect, useRef } from "react";
import { generateBoard } from "@/game/domain/board-generator";
import { GAME_PHASE } from "@/game/domain/game.model";
import { useCharactersQuery } from "@/game/infrastructure/character.queries";
import { useGameStore } from "./game.store";

const PAIR_COUNT = 6;

export function useGame() {
	const { phase, cards, stats, startGame, endShuffle, flipCard, reset } =
		useGameStore();
	const {
		data: characters,
		isLoading,
		error,
		errorUpdatedAt,
		refetch,
	} = useCharactersQuery(PAIR_COUNT);
	const hasStarted = useRef(false);

	useEffect(() => {
		reset();
		hasStarted.current = false;
	}, [reset]);

	const start = useCallback(() => {
		if (!characters) return;
		const board = generateBoard(characters);
		startGame(board);
	}, [characters, startGame]);

	useEffect(() => {
		if (characters && !hasStarted.current) {
			hasStarted.current = true;
			start();
		}
	}, [characters, start]);

	const restart = useCallback(() => {
		if (!characters) return;
		const board = generateBoard(characters);
		startGame(board);
	}, [characters, startGame]);

	const replay = useCallback(async () => {
		reset();
		hasStarted.current = false;
		const result = await refetch();
		if (result.data) {
			const board = generateBoard(result.data);
			startGame(board);
		}
	}, [reset, refetch, startGame]);

	const isDisabled =
		phase === GAME_PHASE.SHUFFLING ||
		phase === GAME_PHASE.PREVIEW ||
		phase === GAME_PHASE.COMPLETED ||
		phase === GAME_PHASE.IDLE;

	return {
		phase,
		cards,
		stats,
		isLoading,
		error: error ? "Error al cargar personajes. Intenta de nuevo." : null,
		errorUpdatedAt,
		isDisabled,
		flipCard,
		endShuffle,
		restart,
		replay,
		retry: refetch,
	};
}
