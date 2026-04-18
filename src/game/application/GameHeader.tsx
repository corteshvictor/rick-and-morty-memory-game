import restartIcon from "@/assets/icons/restart.svg";
import {
	GAME_MODE,
	type GameMode,
	type Player,
	type PlayerId,
} from "@/game/domain/multiplayer.model";
import { VersusScoreboard } from "./VersusScoreboard";

interface GameHeaderProps {
	matches: number;
	totalPairs: number;
	turns: number;
	onRestart: () => void;
	canRestart: boolean;
	mode: GameMode;
	versusPlayers?: [Player, Player];
	versusActivePlayerId?: PlayerId;
}

export function GameHeader({
	matches,
	totalPairs,
	turns,
	onRestart,
	canRestart,
	mode,
	versusPlayers,
	versusActivePlayerId,
}: Readonly<GameHeaderProps>) {
	return (
		<div className="flex justify-between items-center px-2 pb-4 min-h-12 gap-2">
			{mode === GAME_MODE.VERSUS && versusPlayers && versusActivePlayerId ? (
				<VersusScoreboard
					players={versusPlayers}
					activePlayerId={versusActivePlayerId}
				/>
			) : (
				<p className="text-sm text-gray-700">
					Aciertos:{" "}
					<span className="font-bold text-green-600">
						{matches}/{totalPairs}
					</span>
				</p>
			)}

			{canRestart && (
				<button
					type="button"
					onClick={onRestart}
					className="group flex items-center gap-1.5 text-sm font-semibold text-[#233A59] bg-cyan-200/60 hover:bg-cyan-300/70 border border-cyan-300/80 rounded-full px-3 py-1 sm:py-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
				>
					<img
						src={restartIcon}
						alt="Reiniciar el juego"
						className="size-3.5 transition-transform group-hover:-rotate-180 duration-500"
					/>
					<span>Reiniciar</span>
				</button>
			)}

			<p className="text-sm text-gray-700 shrink-0">
				Turnos: <span className="font-bold text-gray-900">{turns}</span>
			</p>
		</div>
	);
}
