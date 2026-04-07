import { type SyntheticEvent, useState } from "react";
import { Button } from "@/shared/ui/Button";

interface ModeSelectorProps {
	onSelectSingle: () => void;
	onSelectVersus: (name1: string, name2: string) => void;
}

export function ModeSelector({
	onSelectSingle,
	onSelectVersus,
}: Readonly<ModeSelectorProps>) {
	const [showVersusForm, setShowVersusForm] = useState(false);
	const [name1, setName1] = useState("");
	const [name2, setName2] = useState("");

	const handleVersusSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimmed1 = name1.trim() || "Jugador 1";
		const trimmed2 = name2.trim() || "Jugador 2";
		onSelectVersus(trimmed1, trimmed2);
	};

	if (showVersusForm) {
		return (
			<div className="flex flex-col items-center gap-6">
				<h2 className="text-2xl font-bold text-gray-800">Modo Versus</h2>
				<form
					onSubmit={handleVersusSubmit}
					className="flex flex-col gap-4 w-full max-w-xs"
				>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="player1"
							className="text-sm font-medium text-gray-600"
						>
							Jugador 1
						</label>
						<input
							id="player1"
							type="text"
							value={name1}
							onChange={(e) => setName1(e.target.value)}
							placeholder="Nombre"
							maxLength={20}
							className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="player2"
							className="text-sm font-medium text-gray-600"
						>
							Jugador 2
						</label>
						<input
							id="player2"
							type="text"
							value={name2}
							onChange={(e) => setName2(e.target.value)}
							placeholder="Nombre"
							maxLength={20}
							className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:border-red-500 transition-colors"
						/>
					</div>
					<Button type="submit">Iniciar</Button>
					<button
						type="button"
						onClick={() => setShowVersusForm(false)}
						className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
					>
						Volver
					</button>
				</form>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-6">
			<h2 className="text-2xl font-bold text-gray-800">Modo de Juego</h2>
			<div className="grid grid-cols-2 gap-4 w-full max-w-sm">
				<button
					type="button"
					onClick={onSelectSingle}
					className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 bg-white hover:bg-green-50 transition-all cursor-pointer"
				>
					<span className="text-3xl">1P</span>
					<span className="text-lg font-bold text-gray-800">Un Jugador</span>
				</button>
				<button
					type="button"
					onClick={() => setShowVersusForm(true)}
					className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50 transition-all cursor-pointer"
				>
					<span className="text-3xl">2P</span>
					<span className="text-lg font-bold text-gray-800">Versus</span>
				</button>
			</div>
		</div>
	);
}
