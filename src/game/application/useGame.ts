import { useCallback, useEffect, useRef, useState } from "react";
import { generateBoard } from "@/game/domain/board-generator";
import { DIFFICULTY_CONFIGS } from "@/game/domain/difficulty.model";
import { GAME_PHASE } from "@/game/domain/game.model";
import { GAME_MODE } from "@/game/domain/multiplayer.model";
import { getWinner } from "@/game/domain/turn-manager";
import { useCharactersQuery } from "@/game/infrastructure/character.queries";
import { type GameSettingsValues } from "./GameSettings";
import { useGameStore } from "./game.store";

export function useGame() {
	const {
		phase,
		cards,
		stats,
		mode,
		versus,
		difficulty,
		startGame,
		endShuffle,
		flipCard,
		reset,
		setMode,
		setupVersus,
		selectDifficulty,
	} = useGameStore();
	const pairCount = DIFFICULTY_CONFIGS[difficulty].totalPairs;
	const {
		data: characters,
		isLoading,
		error,
		errorUpdatedAt,
		refetch,
	} = useCharactersQuery(pairCount);
	const hasStarted = useRef(false);
	const [showSettings, setShowSettings] = useState(true);

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
		if (characters && !hasStarted.current && !showSettings) {
			hasStarted.current = true;
			start();
		}
	}, [characters, start, showSettings]);

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

	const startWithSettings = useCallback(
		(settings: GameSettingsValues) => {
			if (settings.mode === GAME_MODE.VERSUS && settings.versusNames) {
				setupVersus(settings.versusNames.name1, settings.versusNames.name2);
			} else {
				setMode(GAME_MODE.SINGLE);
			}
			selectDifficulty(settings.difficulty);
			setShowSettings(false);
		},
		[setMode, setupVersus, selectDifficulty],
	);

	const openSettings = useCallback(() => {
		reset();
		hasStarted.current = false;
		setShowSettings(true);
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
		difficulty,
		showSettings,
		startWithSettings,
		openSettings,
		shuffleSwaps: DIFFICULTY_CONFIGS[difficulty].shuffleSwaps,
	};
}
