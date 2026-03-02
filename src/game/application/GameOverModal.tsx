import { useNavigate } from "react-router";
import { useAuthStore } from "@/auth";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

interface GameOverModalProps {
	open: boolean;
	turns: number;
	onReplay: () => void;
}

export function GameOverModal({
	open,
	turns,
	onReplay,
}: Readonly<GameOverModalProps>) {
	const navigate = useNavigate();
	const signOut = useAuthStore((s) => s.signOut);

	const handleGoHome = async () => {
		await signOut();
		navigate("/login");
	};

	return (
		<Modal open={open}>
			<div className="flex flex-col items-center gap-6 text-center">
				<h2 className="text-3xl font-bold text-gray-800">¡Felicitaciones!</h2>
				<p className="text-gray-600 text-lg">
					Completaste el juego en{" "}
					<span className="font-bold text-green-600">{turns}</span> turnos
				</p>
				<div className="flex gap-4 w-full">
					<Button onClick={onReplay} className="flex-1">
						Repetir
					</Button>
					<Button variant="outline" onClick={handleGoHome} className="flex-1">
						Inicio
					</Button>
				</div>
			</div>
		</Modal>
	);
}
