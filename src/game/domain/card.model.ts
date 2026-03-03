export const CARD_STATUS = {
	FACE_DOWN: "faceDown",
	FACE_UP: "faceUp",
	MATCHED: "matched",
} as const;

export type CardStatus = (typeof CARD_STATUS)[keyof typeof CARD_STATUS];

export interface Card {
	id: string;
	pairId: string;
	name: string;
	imageUrl: string;
	characterStatus: string;
	species: string;
	status: CardStatus;
}
