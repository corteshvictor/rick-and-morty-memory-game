interface GameHeaderProps {
	matches: number;
	turns: number;
}

export function GameHeader({ matches, turns }: Readonly<GameHeaderProps>) {
	return (
		<div className="flex justify-between items-center px-2 pb-4">
			<p className="text-sm text-gray-700">
				Aciertos: <span className="font-bold text-green-600">{matches}</span>
			</p>
			<p className="text-sm text-gray-700">
				Turnos: <span className="font-bold text-gray-900">{turns}</span>
			</p>
		</div>
	);
}
