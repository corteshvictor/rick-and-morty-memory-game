export type CardStatus = "faceDown" | "faceUp" | "matched";

export interface Card {
	id: string;
	pairId: string;
	name: string;
	imageUrl: string;
	status: CardStatus;
}
