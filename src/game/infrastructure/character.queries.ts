import { useQuery } from "@tanstack/react-query";
import { createCharacterApi } from "./character.api";

const characterApi = createCharacterApi();

export function useCharactersQuery(count: number) {
	return useQuery({
		queryKey: ["characters", count],
		queryFn: () => characterApi.getCharacters(count),
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	});
}
