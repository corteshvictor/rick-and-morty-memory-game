import { type Card } from "./card.model";

export function doCardsMatch(cardA: Card, cardB: Card): boolean {
	return cardA.pairId === cardB.pairId;
}
