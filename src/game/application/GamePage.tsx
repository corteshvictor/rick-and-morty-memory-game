import { useEffect } from "react";
import { GAME_PHASE } from "@/game/domain/game.model";
import { Button } from "@/shared/ui/Button";
import { notifyError } from "@/shared/ui/notifications";
import { Spinner } from "@/shared/ui/Spinner";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./GameHeader";
import { GameOverModal } from "./GameOverModal";
import { GameSettings } from "./GameSettings";
import { useGame } from "./useGame";

export function GamePage() {
	const {
		phase,
		cards,
		stats,
		isLoading,
		error,
		errorUpdatedAt,
		isDisabled,
		flipCard,
		endShuffle,
		restart,
		replay,
		retry,
		mode,
		versus,
		winner,
		showSettings,
		difficulty,
		shuffleSwaps,
		startWithSettings,
		openSettings,
	} = useGame();

	useEffect(() => {
		if (!error || errorUpdatedAt <= 0) return;
		notifyError({ message: error, title: "Error del juego" });
	}, [error, errorUpdatedAt]);

	if (showSettings) {
		return (
			<div className="bg-amber-50 rounded-2xl p-3 sm:p-6 shadow-lg">
				<GameSettings
					initialMode={mode}
					initialDifficulty={difficulty}
					initialName1={versus?.players[0].name ?? ""}
					initialName2={versus?.players[1].name ?? ""}
					onStart={startWithSettings}
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-4">
				<Spinner className="text-green-500" />
				<p className="text-white/60">Cargando personajes...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-4">
				<p className="text-white/70 text-sm">
					No fue posible cargar el tablero.
				</p>
				<Button onClick={() => retry()}>Reintentar</Button>
			</div>
		);
	}

	return (
		<div className="bg-amber-50 rounded-2xl p-3 sm:p-6 shadow-lg">
			<GameHeader
				matches={stats.matches}
				totalPairs={stats.totalPairs}
				turns={stats.turns}
				onRestart={restart}
				canRestart={phase === GAME_PHASE.PLAYING}
				mode={mode}
				versusPlayers={versus?.players}
				versusActivePlayerId={versus?.activePlayerId}
			/>
			<GameBoard
				cards={cards}
				phase={phase}
				onFlip={flipCard}
				onShuffleComplete={endShuffle}
				disabled={isDisabled}
				difficulty={difficulty}
				shuffleSwaps={shuffleSwaps}
			/>
			<GameOverModal
				open={phase === GAME_PHASE.COMPLETED}
				turns={stats.turns}
				difficulty={difficulty}
				onReplay={replay}
				mode={mode}
				winner={winner}
				versus={versus ?? undefined}
				onOpenSettings={openSettings}
			/>
		</div>
	);
}
