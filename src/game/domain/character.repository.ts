export interface Character {
	id: number;
	name: string;
	imageUrl: string;
	characterStatus: string;
	species: string;
}

export interface CharacterRepository {
	getCharacters(count: number): Promise<Character[]>;
}
