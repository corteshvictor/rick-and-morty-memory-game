import restartIcon from "@/assets/icons/restart.svg";

interface GameHeaderProps {
	matches: number;
	turns: number;
	onRestart: () => void;
	canRestart: boolean;
}

export function GameHeader({
	matches,
	turns,
	onRestart,
	canRestart,
}: Readonly<GameHeaderProps>) {
	return (
		<div className="flex justify-between items-center px-2 pb-4">
			<p className="text-sm text-gray-700">
				Aciertos: <span className="font-bold text-green-600">{matches}</span>
			</p>

			{canRestart && (
				<button
					type="button"
					onClick={onRestart}
					className="group flex items-center gap-1.5 text-sm font-semibold text-[#233A59] bg-cyan-200/60 hover:bg-cyan-300/70 border border-cyan-300/80 rounded-full px-3 py-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
				>
					<img
						src={restartIcon}
						alt="Reiniciar el juego"
						className="w-3.5 h-3.5 transition-transform group-hover:-rotate-180 duration-500"
					/>
					<span>Reiniciar</span>
				</button>
			)}

			<p className="text-sm text-gray-700">
				Turnos: <span className="font-bold text-gray-900">{turns}</span>
			</p>
		</div>
	);
}
