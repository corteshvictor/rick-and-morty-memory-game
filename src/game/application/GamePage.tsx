import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./GameHeader";
import { GameOverModal } from "./GameOverModal";
import { useGame } from "./useGame";

export function GamePage() {
	const {
		phase,
		cards,
		stats,
		isLoading,
		error,
		isDisabled,
		flipCard,
		replay,
		retry,
	} = useGame();

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-4">
				<Spinner />
				<p className="text-white/60">Cargando personajes...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-4">
				<p className="text-red-400">{error}</p>
				<Button onClick={() => retry()}>Reintentar</Button>
			</div>
		);
	}

	return (
		<div className="bg-amber-50 rounded-2xl p-6 shadow-lg">
			<GameHeader matches={stats.matches} turns={stats.turns} />
			<GameBoard cards={cards} onFlip={flipCard} disabled={isDisabled} />
			<GameOverModal
				open={phase === "completed"}
				turns={stats.turns}
				onReplay={replay}
			/>
		</div>
	);
}
