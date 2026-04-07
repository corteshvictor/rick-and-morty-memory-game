import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/auth";
import {
	GAME_MODE,
	type GameMode,
	type Player,
	type VersusState,
} from "@/game/domain/multiplayer.model";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { Spinner } from "@/shared/ui/Spinner";
import { useGameStore } from "./game.store";

interface GameOverModalProps {
	open: boolean;
	turns: number;
	onReplay: () => void;
	mode: GameMode;
	winner?: Player | null; // Player=ganador, null=empate, undefined=single
	versus?: VersusState;
	onChangeMode?: () => void;
}

export function GameOverModal({
	open,
	turns,
	onReplay,
	mode,
	winner,
	versus,
	onChangeMode,
}: Readonly<GameOverModalProps>) {
	const navigate = useNavigate();
	const signOut = useAuthStore((s) => s.signOut);
	const signingOut = useAuthStore((s) => s.signingOut);
	const resetGame = useGameStore((s) => s.reset);

	const isVersus = mode === GAME_MODE.VERSUS;

	useEffect(() => {
		if (!open) return;

		if (isVersus && winner) {
			// Confetti con color del ganador
			const colors =
				winner.id === 1 ? ["#3b82f6", "#60a5fa"] : ["#ef4444", "#f87171"];
			confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors });
		} else if (isVersus && winner === null) {
			// Empate — confetti bicolor
			confetti({
				particleCount: 200,
				spread: 100,
				origin: { y: 0.6 },
				colors: ["#3b82f6", "#ef4444"],
			});
		} else {
			// Single mode — confetti normal
			confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
		}
	}, [open, isVersus, winner]);

	const handleGoHome = async () => {
		resetGame();
		await signOut();
		navigate("/login");
	};

	return (
		<Modal open={open}>
			<div className="flex flex-col items-center gap-6 text-center">
				{isVersus && versus ? (
					<>
						{winner ? (
							<h2 className="text-3xl font-bold text-gray-800">
								¡{winner.name} gana!
							</h2>
						) : (
							<h2 className="text-3xl font-bold text-gray-800">¡Empate!</h2>
						)}
						<div className="flex gap-4 text-lg">
							<span className="font-bold text-blue-600">
								{versus.players[0].name}: {versus.players[0].matches} pares
							</span>
							<span className="text-gray-400">-</span>
							<span className="font-bold text-red-600">
								{versus.players[1].name}: {versus.players[1].matches} pares
							</span>
						</div>
					</>
				) : (
					<>
						<h2 className="text-3xl font-bold text-gray-800">
							¡Felicitaciones!
						</h2>
						<p className="text-gray-600 text-lg">
							Completaste el juego en{" "}
							<span className="font-bold text-green-600">{turns}</span> turnos
						</p>
					</>
				)}

				<div className="flex gap-4 w-full">
					<Button onClick={onReplay} disabled={signingOut} className="flex-1">
						Repetir
					</Button>
					{isVersus && onChangeMode ? (
						<Button
							variant="outline"
							onClick={onChangeMode}
							disabled={signingOut}
							className="flex-1"
						>
							Cambiar modo
						</Button>
					) : (
						<Button
							variant="outline"
							onClick={handleGoHome}
							disabled={signingOut}
							className="flex-1"
						>
							{signingOut ? <Spinner size="base" /> : "Inicio"}
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}
