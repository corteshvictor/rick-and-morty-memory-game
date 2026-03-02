import { type Card } from "./card.model";
import { type Character } from "./character.repository";

/**
 * Randomly shuffle a copy of the arrangement using Fisher-Yates, without modifying the original.
 */
function fisherYatesShuffle<T>(array: readonly T[]): T[] {
	const shuffled = [...array];

	for (
		let currentIndex = shuffled.length - 1;
		currentIndex > 0;
		currentIndex--
	) {
		const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
		[shuffled[currentIndex], shuffled[randomIndex]] = [
			shuffled[randomIndex],
			shuffled[currentIndex],
		];
	}

	return shuffled;
}

export function generateBoard(characters: Character[]): Card[] {
	const cards: Card[] = characters.flatMap((character, index) => {
		const pairId = `pair-${index}`;
		const { name, imageUrl, characterStatus, species } = character;

		return [
			{
				id: `${pairId}-a`,
				pairId,
				name,
				imageUrl,
				characterStatus,
				species,
				status: "faceDown" as const,
			},
			{
				id: `${pairId}-b`,
				pairId,
				name,
				imageUrl,
				characterStatus,
				species,
				status: "faceDown" as const,
			},
		];
	});

	return fisherYatesShuffle(cards);
}
