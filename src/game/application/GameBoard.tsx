import { type Card } from "@/game/domain/card.model";
import { type GamePhase } from "@/game/domain/game.model";
import { GameCard } from "./GameCard";
import { type SwapTransform, useShuffleAnimation } from "./useShuffleAnimation";

interface GameBoardProps {
	cards: Card[];
	phase: GamePhase;
	onFlip: (cardId: string) => void;
	onShuffleComplete: () => void;
	disabled: boolean;
}

function getSwapClasses(transform: SwapTransform) {
	return [
		"z-10 scale-105 transition-all duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
		(transform.x || 1) < 0 ? "-rotate-3" : "rotate-3",
	].join(" ");
}

export function GameBoard({
	cards,
	phase,
	onFlip,
	onShuffleComplete,
	disabled,
}: Readonly<GameBoardProps>) {
	const { displayCards, swapTransforms, gridRef } = useShuffleAnimation(
		cards,
		phase,
		onShuffleComplete,
	);

	return (
		<div ref={gridRef} className="grid grid-cols-4 gap-4 w-full">
			{displayCards.map((card) => {
				const transform = swapTransforms[card.id];
				const isSwapping = !!transform;

				return (
					<div
						key={card.id}
						className={`relative ${isSwapping ? getSwapClasses(transform) : ""}`}
						style={
							isSwapping
								? { translate: `${transform.x}px ${transform.y}px` }
								: undefined
						}
					>
						<GameCard card={card} onClick={onFlip} disabled={disabled} />
					</div>
				);
			})}
		</div>
	);
}
