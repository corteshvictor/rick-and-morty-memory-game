export interface Character {
	id: number;
	name: string;
	imageUrl: string;
}

export interface CharacterRepository {
	getCharacters(count: number): Promise<Character[]>;
}
