import {
	type Character,
	type CharacterRepository,
} from "@/game/domain/character.repository";

interface RickAndMortyApiCharacter {
	id: number;
	name: string;
	image: string;
}

interface RickAndMortyApiResponse {
	info: { count: number; pages: number };
	results: RickAndMortyApiCharacter[];
}

const API_BASE = "https://rickandmortyapi.com/api/character";

export function createCharacterApi(): CharacterRepository {
	return {
		async getCharacters(count: number): Promise<Character[]> {
			const totalCharacters = 826;
			const ids = new Set<number>();
			while (ids.size < count) {
				ids.add(Math.floor(Math.random() * totalCharacters) + 1);
			}

			const response = await fetch(`${API_BASE}/${[...ids].join(",")}`);
			if (!response.ok) {
				throw new Error("Error al obtener personajes");
			}

			const data: RickAndMortyApiCharacter[] | RickAndMortyApiResponse =
				await response.json();
			const results = Array.isArray(data) ? data : data.results;

			return results.map((char) => ({
				id: char.id,
				name: char.name,
				imageUrl: char.image,
			}));
		},
	};
}
