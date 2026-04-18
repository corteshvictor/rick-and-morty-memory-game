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
import {
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
} from "../domain/difficulty.model";
import { useGameStore } from "./game.store";

interface GameOverModalProps {
	open: boolean;
	turns: number;
	difficulty: DifficultyLevel;
	onReplay: () => void;
	onOpenSettings: () => void;
	mode: GameMode;
	winner?: Player | null; // Player=ganador, null=empate, undefined=single
	versus?: VersusState;
}

export function GameOverModal({
	open,
	turns,
	difficulty,
	onReplay,
	onOpenSettings,
	mode,
	winner,
	versus,
}: Readonly<GameOverModalProps>) {
	const navigate = useNavigate();
	const signOut = useAuthStore((s) => s.signOut);
	const signingOut = useAuthStore((s) => s.signingOut);
	const clearGame = useGameStore((s) => s.clear);

	const isVersus = mode === GAME_MODE.VERSUS;

	useEffect(() => {
		if (!open) return;

		if (isVersus && winner) {
			const colors =
				winner.id === 1 ? ["#3b82f6", "#60a5fa"] : ["#ef4444", "#f87171"];
			confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors });
		} else if (isVersus && winner === null) {
			confetti({
				particleCount: 200,
				spread: 100,
				origin: { y: 0.6 },
				colors: ["#3b82f6", "#ef4444"],
			});
		} else {
			confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
		}
	}, [open, isVersus, winner]);

	const handleGoHome = async () => {
		clearGame();
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
						<p className="text-gray-600 text-sm">
							Nivel{" "}
							<span className="font-bold text-green-600">
								{DIFFICULTY_CONFIGS[difficulty].label}
							</span>{" "}
							· <span className="font-bold text-green-600">{turns}</span> turnos
						</p>
					</>
				) : (
					<>
						<h2 className="text-3xl font-bold text-gray-800">
							¡Felicitaciones!
						</h2>
						<p className="text-gray-600 text-lg">
							Completaste el nivel{" "}
							<span className="font-bold text-green-600">
								{DIFFICULTY_CONFIGS[difficulty].label}
							</span>{" "}
							en <span className="font-bold text-green-600">{turns}</span>{" "}
							turnos
						</p>
					</>
				)}

				<div className="flex flex-col sm:flex-row gap-3 w-full">
					<Button onClick={onReplay} disabled={signingOut} className="flex-1">
						Repetir
					</Button>
					<Button
						variant="outline"
						onClick={onOpenSettings}
						disabled={signingOut}
						className="flex-1"
					>
						Cambiar ajustes
					</Button>
					<Button
						variant="outline"
						onClick={handleGoHome}
						disabled={signingOut}
						className="flex-1"
					>
						{signingOut ? <Spinner size="base" /> : "Inicio"}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
