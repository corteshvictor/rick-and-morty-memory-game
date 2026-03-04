import { HttpResponse, http } from "msw";
import { envs } from "@/app/config/env";
import { MOCK_CHARACTERS, MOCK_LEAKED_CHARACTERS } from "../data/characters";

export const characters = [
	http.get(`${envs.RICK_AND_MORTY_API_URL}/character/:ids`, () => {
		return HttpResponse.json(MOCK_LEAKED_CHARACTERS);
	}),

	http.get(`${envs.RICK_AND_MORTY_API_URL}/character`, () => {
		return HttpResponse.json(MOCK_CHARACTERS);
	}),
];
