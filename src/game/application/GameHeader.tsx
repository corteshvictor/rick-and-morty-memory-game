interface GameHeaderProps {
	matches: number;
	turns: number;
}

export function GameHeader({ matches, turns }: GameHeaderProps) {
	return (
		<div className="flex justify-center gap-8 py-4">
			<div className="text-center">
				<p className="text-sm text-white/60">Aciertos</p>
				<p className="text-2xl font-bold text-green-400">{matches}</p>
			</div>
			<div className="text-center">
				<p className="text-sm text-white/60">Turnos</p>
				<p className="text-2xl font-bold text-white">{turns}</p>
			</div>
		</div>
	);
}
