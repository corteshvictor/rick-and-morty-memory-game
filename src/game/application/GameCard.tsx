import cardBackImg from "@/assets/images/card-back.webp";
import { CARD_STATUS, type Card } from "@/game/domain/card.model";

interface GameCardProps {
	card: Card;
	onClick: (cardId: string) => void;
	disabled: boolean;
}

export function GameCard({ card, onClick, disabled }: Readonly<GameCardProps>) {
	const isFaceUp = card.status === CARD_STATUS.FACE_UP;
	const isMatched = card.status === CARD_STATUS.MATCHED;
	const isRevealed = isFaceUp || isMatched;

	if (isMatched) {
		return <div className="w-full aspect-3/4 rounded-lg" />;
	}

	return (
		<button
			type="button"
			className="perspective-[600px] w-full aspect-3/4 cursor-pointer bg-transparent border-none p-0"
			onClick={() => !disabled && !isRevealed && onClick(card.id)}
			disabled={disabled || isRevealed}
			aria-label={isRevealed ? card.name : "Carta boca abajo"}
		>
			<div
				className={`relative w-full h-full transition-transform duration-500 transform-3d ${isRevealed ? "rotate-y-180" : ""}`}
			>
				{/* Card back */}
				<div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-cyan-200 border border-cyan-300 shadow-md flex items-center justify-center">
					<img
						src={cardBackImg}
						alt="Carta boca abajo"
						className="w-[80%] h-[80%] object-contain"
					/>
				</div>

				{/* Card front */}
				<div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden bg-white shadow-[0_4px_6px_-2px_rgba(0,0,0,0.20)] flex flex-col p-4 gap-2 text-left">
					<div className="flex-1 rounded overflow-hidden">
						<img
							src={card.imageUrl}
							alt={card.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<div>
						<p className="text-[#233A59] text-base font-bold leading-5.5 truncate">
							{card.name}
						</p>
						<p className="text-black text-[10px] leading-none truncate">
							{card.characterStatus} - {card.species}
						</p>
					</div>
				</div>
			</div>
		</button>
	);
}
