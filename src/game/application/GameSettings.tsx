import { type SyntheticEvent, useState } from "react";
import { Button } from "@/shared/ui/Button";
import {
	DEFAULT_DIFFICULTY,
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
} from "../domain/difficulty.model";
import { GAME_MODE, type GameMode } from "../domain/multiplayer.model";

export interface GameSettingsValues {
	mode: GameMode;
	difficulty: DifficultyLevel;
	versusNames?: { name1: string; name2: string };
}

interface GameSettingsProps {
	initialMode?: GameMode;
	initialDifficulty?: DifficultyLevel;
	initialName1?: string;
	initialName2?: string;
	onStart: (settings: GameSettingsValues) => void;
}

const MODE_CARD_BASE =
	"flex flex-col items-center gap-1 p-4 rounded-xl border-2 bg-white transition-all cursor-pointer";
const DIFF_CARD_BASE =
	"flex flex-col items-center gap-1 p-3 rounded-xl border-2 bg-white transition-all cursor-pointer";

function modeCardClasses(active: boolean, accent: "green" | "blue") {
	if (active) {
		return accent === "green"
			? `${MODE_CARD_BASE} border-green-500 bg-green-50 ring-2 ring-green-500/30`
			: `${MODE_CARD_BASE} border-blue-500 bg-blue-50 ring-2 ring-blue-500/30`;
	}
	return `${MODE_CARD_BASE} border-gray-200 hover:border-gray-300`;
}

function diffCardClasses(active: boolean) {
	return active
		? `${DIFF_CARD_BASE} border-green-500 bg-green-50 ring-2 ring-green-500/30`
		: `${DIFF_CARD_BASE} border-gray-200 hover:border-green-400 hover:bg-green-50/40`;
}

export function GameSettings({
	initialMode = GAME_MODE.SINGLE,
	initialDifficulty = DEFAULT_DIFFICULTY,
	initialName1 = "",
	initialName2 = "",
	onStart,
}: Readonly<GameSettingsProps>) {
	const [mode, setMode] = useState<GameMode>(initialMode);
	const [difficulty, setDifficulty] =
		useState<DifficultyLevel>(initialDifficulty);
	const [name1, setName1] = useState(initialName1);
	const [name2, setName2] = useState(initialName2);

	const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (mode === GAME_MODE.VERSUS) {
			onStart({
				mode,
				difficulty,
				versusNames: {
					name1: name1.trim() || "Jugador 1",
					name2: name2.trim() || "Jugador 2",
				},
			});
			return;
		}
		onStart({ mode, difficulty });
	};

	const handleReset = () => {
		setMode(GAME_MODE.SINGLE);
		setDifficulty(DEFAULT_DIFFICULTY);
		setName1("");
		setName2("");
	};

	const difficulties = Object.values(DIFFICULTY_CONFIGS);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<h2 className="text-2xl font-bold text-gray-800 text-center">
				Configuración del juego
			</h2>

			<fieldset className="flex flex-col gap-2">
				<legend className="text-sm font-semibold text-gray-700 mb-2">
					Modo
				</legend>
				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={() => setMode(GAME_MODE.SINGLE)}
						aria-pressed={mode === GAME_MODE.SINGLE}
						className={modeCardClasses(mode === GAME_MODE.SINGLE, "green")}
					>
						<span className="text-2xl font-bold">1P</span>
						<span className="text-sm font-medium text-gray-700">
							Un Jugador
						</span>
					</button>
					<button
						type="button"
						onClick={() => setMode(GAME_MODE.VERSUS)}
						aria-pressed={mode === GAME_MODE.VERSUS}
						className={modeCardClasses(mode === GAME_MODE.VERSUS, "blue")}
					>
						<span className="text-2xl font-bold">2P</span>
						<span className="text-sm font-medium text-gray-700">Versus</span>
					</button>
				</div>
			</fieldset>

			<fieldset className="flex flex-col gap-2">
				<legend className="text-sm font-semibold text-gray-700 mb-2">
					Dificultad
				</legend>
				<div className="grid grid-cols-3 gap-3">
					{difficulties.map((cfg) => (
						<button
							key={cfg.level}
							type="button"
							onClick={() => setDifficulty(cfg.level)}
							aria-pressed={difficulty === cfg.level}
							className={diffCardClasses(difficulty === cfg.level)}
						>
							<span className="text-base font-bold text-gray-800">
								{cfg.label}
							</span>
							<span className="text-xs text-gray-500">
								{cfg.totalPairs} pares
							</span>
							{cfg.level === DEFAULT_DIFFICULTY && (
								<span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">
									Sugerido
								</span>
							)}
						</button>
					))}
				</div>
			</fieldset>

			{mode === GAME_MODE.VERSUS && (
				<fieldset className="flex flex-col gap-3">
					<legend className="text-sm font-semibold text-gray-700 mb-2">
						Nombres
					</legend>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="player1"
							className="text-xs font-medium text-gray-600"
						>
							Jugador 1
						</label>
						<input
							id="player1"
							type="text"
							value={name1}
							onChange={(e) => setName1(e.target.value)}
							placeholder="Jugador 1"
							maxLength={20}
							className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="player2"
							className="text-xs font-medium text-gray-600"
						>
							Jugador 2
						</label>
						<input
							id="player2"
							type="text"
							value={name2}
							onChange={(e) => setName2(e.target.value)}
							placeholder="Jugador 2"
							maxLength={20}
							className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:border-red-500 transition-colors"
						/>
					</div>
				</fieldset>
			)}

			<div className="flex flex-col items-center gap-3">
				<Button type="submit" className="w-full">
					Comenzar juego
				</Button>
				<button
					type="button"
					onClick={handleReset}
					className="text-sm text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline cursor-pointer transition-colors"
				>
					Restablecer
				</button>
			</div>
		</form>
	);
}
