import { useCallback, useEffect, useRef } from "react";
import { generateBoard } from "@/game/domain/board-generator";
import { useCharactersQuery } from "@/game/infrastructure/character.queries";
import { useGameStore } from "./game.store";

const PAIR_COUNT = 6;

export function useGame() {
	const { phase, cards, stats, startGame, flipCard, reset } = useGameStore();
	const {
		data: characters,
		isLoading,
		error,
		refetch,
	} = useCharactersQuery(PAIR_COUNT);
	const hasStarted = useRef(false);

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
		phase === "preview" || phase === "completed" || phase === "idle";

	return {
		phase,
		cards,
		stats,
		isLoading,
		error: error ? "Error al cargar personajes. Intenta de nuevo." : null,
		isDisabled,
		flipCard,
		replay,
		retry: refetch,
	};
}
