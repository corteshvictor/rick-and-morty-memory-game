import { type Card } from "@/game/domain/card.model";
import { GameCard } from "./GameCard";

interface GameBoardProps {
	cards: Card[];
	onFlip: (cardId: string) => void;
	disabled: boolean;
}

export function GameBoard({ cards, onFlip, disabled }: GameBoardProps) {
	return (
		<div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto p-4">
			{cards.map((card) => (
				<GameCard
					key={card.id}
					card={card}
					onClick={onFlip}
					disabled={disabled}
				/>
			))}
		</div>
	);
}
