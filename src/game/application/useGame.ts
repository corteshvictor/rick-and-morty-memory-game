import { useCallback, useEffect, useRef, useState } from "react";
import { generateBoard } from "@/game/domain/board-generator";
import { GAME_PHASE } from "@/game/domain/game.model";
import { GAME_MODE } from "@/game/domain/multiplayer.model";
import { getWinner } from "@/game/domain/turn-manager";
import { useCharactersQuery } from "@/game/infrastructure/character.queries";
import { useGameStore } from "./game.store";

const PAIR_COUNT = 6;

export function useGame() {
	const {
		phase,
		cards,
		stats,
		mode,
		versus,
		startGame,
		endShuffle,
		flipCard,
		reset,
		setMode,
		setupVersus,
	} = useGameStore();
	const {
		data: characters,
		isLoading,
		error,
		errorUpdatedAt,
		refetch,
	} = useCharactersQuery(PAIR_COUNT);
	const hasStarted = useRef(false);
	const [showModeSelector, setShowModeSelector] = useState(true);

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
		if (characters && !hasStarted.current && !showModeSelector) {
			hasStarted.current = true;
			start();
		}
	}, [characters, start, showModeSelector]);

	const restart = useCallback(() => {
		if (!characters) return;
		const board = generateBoard(characters);
		startGame(board);
	}, [characters, startGame]);

	const replay = useCallback(async () => {
		const result = await refetch();
		if (result.data) {
			const board = generateBoard(result.data);
			startGame(board);
		}
	}, [refetch, startGame]);

	const selectSingleMode = useCallback(() => {
		setMode(GAME_MODE.SINGLE);
		setShowModeSelector(false);
	}, [setMode]);

	const selectVersusMode = useCallback(
		(name1: string, name2: string) => {
			setupVersus(name1, name2);
			setShowModeSelector(false);
		},
		[setupVersus],
	);

	const changeMode = useCallback(() => {
		reset();
		hasStarted.current = false;
		setShowModeSelector(true);
	}, [reset]);

	const isDisabled =
		phase === GAME_PHASE.SHUFFLING ||
		phase === GAME_PHASE.PREVIEW ||
		phase === GAME_PHASE.COMPLETED ||
		phase === GAME_PHASE.IDLE;

	const winner =
		phase === GAME_PHASE.COMPLETED && mode === GAME_MODE.VERSUS && versus
			? getWinner(versus.players)
			: undefined; // undefined = no aplica (single o no completado)

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
		mode,
		versus,
		winner,
		showModeSelector,
		selectSingleMode,
		selectVersusMode,
		changeMode,
	};
}
