import { useEffect, useRef, useState } from "react";
import { type Card } from "@/game/domain/card.model";
import { GAME_PHASE, type GamePhase } from "@/game/domain/game.model";

const SHUFFLE_SWAP_DURATION = 320;
const SHUFFLE_SWAP_GAP = 80;
const SHUFFLE_INITIAL_DELAY = 300;

export interface SwapTransform {
	x: number;
	y: number;
}

/**
 * Picks two distinct random indices from the card array.
 * Uses rejection sampling to guarantee they are different.
 */
function pickRandomPair(totalCards: number) {
	const firstIndex = Math.floor(Math.random() * totalCards);
	let secondIndex = Math.floor(Math.random() * (totalCards - 1));
	if (secondIndex >= firstIndex) secondIndex++;
	return { firstIndex, secondIndex };
}

/**
 * Calculates the pixel offset between two grid cells
 * so CSS `translate` can move one card to the other's position.
 */
function calculateOffset(
	cardRects: DOMRect[],
	fromIndex: number,
	toIndex: number,
) {
	return {
		x: cardRects[toIndex].left - cardRects[fromIndex].left,
		y: cardRects[toIndex].top - cardRects[fromIndex].top,
	};
}

/**
 * Orchestrates a visible shuffle animation by swapping pairs of cards
 * sequentially. Each swap animates two cards flying to each other's
 * grid position using CSS transitions, then commits the reorder.
 */
export function useShuffleAnimation(
	cards: Card[],
	phase: GamePhase,
	onComplete: () => void,
	swapCount: number,
) {
	const [localCards, setLocalCards] = useState<Card[]>(cards);
	const [swapTransforms, setSwapTransforms] = useState<
		Record<string, SwapTransform>
	>({});
	const gridRef = useRef<HTMLDivElement>(null);
	const localCardsRef = useRef<Card[]>(cards);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	// Sync local cards with prop when not in shuffling phase
	useEffect(() => {
		if (phase === GAME_PHASE.SHUFFLING) return;
		setLocalCards(cards);
		localCardsRef.current = cards;
	}, [cards, phase]);

	// Run the shuffle animation sequence
	useEffect(() => {
		if (phase !== GAME_PHASE.SHUFFLING) return;

		setLocalCards(cards);
		localCardsRef.current = cards;
		setSwapTransforms({});

		let completedSwaps = 0;
		let cancelled = false;
		let timerId: ReturnType<typeof setTimeout>;

		function measureCardPositions(): DOMRect[] {
			if (!gridRef.current) return [];
			return Array.from(gridRef.current.children).map((el) =>
				el.getBoundingClientRect(),
			);
		}

		function performNextSwap() {
			if (cancelled || completedSwaps >= swapCount) {
				if (!cancelled) onCompleteRef.current();
				return;
			}

			const currentOrder = localCardsRef.current;
			const { firstIndex, secondIndex } = pickRandomPair(currentOrder.length);

			const cardPositions = measureCardPositions();
			if (cardPositions.length < currentOrder.length) {
				timerId = setTimeout(performNextSwap, 50);
				return;
			}

			// Calculate pixel distance between the two cards
			const offset = calculateOffset(cardPositions, firstIndex, secondIndex);

			// Apply transforms to animate both cards toward each other's position
			setSwapTransforms({
				[currentOrder[firstIndex].id]: { x: offset.x, y: offset.y },
				[currentOrder[secondIndex].id]: { x: -offset.x, y: -offset.y },
			});

			// After the animation completes, commit the swap in the array
			timerId = setTimeout(() => {
				if (cancelled) return;

				const reorderedCards = [...localCardsRef.current];
				[reorderedCards[firstIndex], reorderedCards[secondIndex]] = [
					reorderedCards[secondIndex],
					reorderedCards[firstIndex],
				];
				localCardsRef.current = reorderedCards;
				setLocalCards(reorderedCards);
				setSwapTransforms({});

				completedSwaps++;
				timerId = setTimeout(performNextSwap, SHUFFLE_SWAP_GAP);
			}, SHUFFLE_SWAP_DURATION);
		}

		timerId = setTimeout(performNextSwap, SHUFFLE_INITIAL_DELAY);

		return () => {
			cancelled = true;
			clearTimeout(timerId);
		};
	}, [phase, cards, swapCount]);

	const displayCards = phase === GAME_PHASE.SHUFFLING ? localCards : cards;

	return { displayCards, swapTransforms, gridRef };
}
