import {
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
} from "../domain/difficulty.model";

interface DifficultySelectorProps {
	onSelect: (level: DifficultyLevel) => void;
}

export function DifficultySelector({
	onSelect,
}: Readonly<DifficultySelectorProps>) {
	const configs = Object.values(DIFFICULTY_CONFIGS);

	return (
		<div className="flex flex-col items-center gap-6">
			<h2 className="text-2xl font-bold text-gray-800">
				Selecciona la dificultad
			</h2>
			<div className="grid grid-cols-3 gap-4 w-full max-w-md">
				{configs.map((config) => (
					<button
						key={config.level}
						type="button"
						onClick={() => onSelect(config.level)}
						className="flex flex-col items-center gap-2 p-4 rounded-xl
						           border-2 border-gray-200
						           bg-white transition-all cursor-pointer
						           hover:border-green-500 hover:bg-green-50
						           active:border-green-600 active:bg-green-100 active:scale-95"
					>
						<span className="text-lg font-bold">{config.label}</span>
						<span className="text-sm text-gray-500">
							{config.totalPairs} pares
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
