import cardBackImg from "@/assets/images/card-back.webp";
import { type Card } from "@/game/domain/card.model";

interface GameCardProps {
	card: Card;
	onClick: (cardId: string) => void;
	disabled: boolean;
}

export function GameCard({ card, onClick, disabled }: Readonly<GameCardProps>) {
	const isFaceUp = card.status === "faceUp";
	const isMatched = card.status === "matched";
	const isRevealed = isFaceUp || isMatched;

	if (isMatched) {
		return <div className="w-full aspect-square rounded-xl" />;
	}

	return (
		<button
			type="button"
			className="perspective-[600px] w-full aspect-square cursor-pointer bg-transparent border-none p-0"
			onClick={() => !disabled && !isRevealed && onClick(card.id)}
			disabled={disabled || isRevealed}
			aria-label={isRevealed ? card.name : "Carta boca abajo"}
		>
			<div
				className={`relative w-full h-full transition-transform duration-500 transform-3d ${isRevealed ? "rotate-y-180" : ""}`}
			>
				{/* Card back */}
				<div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-lg">
					<img
						src={cardBackImg}
						alt="Carta boca abajo"
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Card front */}
				<div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden border-2 border-green-400/50 shadow-lg">
					<img
						src={card.imageUrl}
						alt={card.name}
						className="w-full h-full object-cover"
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
						<p className="text-white text-xs text-center truncate">
							{card.name}
						</p>
					</div>
				</div>
			</div>
		</button>
	);
}
