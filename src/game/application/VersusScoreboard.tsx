import { type Player, type PlayerId } from "@/game/domain/multiplayer.model";

interface VersusScoreboardProps {
	players: [Player, Player];
	activePlayerId: PlayerId;
}

const PLAYER_STYLES: Record<number, { active: string; inactive: string }> = {
	1: {
		active: "bg-blue-100 border-blue-400 text-blue-800",
		inactive: "bg-gray-50 border-gray-200 text-gray-500",
	},
	2: {
		active: "bg-red-100 border-red-400 text-red-800",
		inactive: "bg-gray-50 border-gray-200 text-gray-500",
	},
};

export function VersusScoreboard({
	players,
	activePlayerId,
}: Readonly<VersusScoreboardProps>) {
	return (
		<div className="flex gap-3 w-full">
			{players.map((player) => {
				const isActive = player.id === activePlayerId;
				const styles = PLAYER_STYLES[player.id];
				const className = isActive ? styles.active : styles.inactive;

				return (
					<div
						key={player.id}
						className={`flex-1 flex flex-col px-3 py-1.5 rounded-lg border-2 transition-colors ${className}`}
					>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium truncate max-w-20">
								{player.name}
							</span>
							<span className="text-lg font-bold">{player.matches} pares</span>
						</div>
						<span className="text-xs font-semibold h-4">
							{isActive ? "▶ Turno" : ""}
						</span>
					</div>
				);
			})}
		</div>
	);
}
