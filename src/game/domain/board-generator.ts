import { type Card } from "./card.model";
import { type Character } from "./character.repository";

function fisherYatesShuffle<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export function generateBoard(characters: Character[]): Card[] {
	const cards: Card[] = characters.flatMap((character, index) => {
		const pairId = `pair-${index}`;
		return [
			{
				id: `${pairId}-a`,
				pairId,
				name: character.name,
				imageUrl: character.imageUrl,
				status: "faceDown" as const,
			},
			{
				id: `${pairId}-b`,
				pairId,
				name: character.name,
				imageUrl: character.imageUrl,
				status: "faceDown" as const,
			},
		];
	});

	return fisherYatesShuffle(cards);
}
