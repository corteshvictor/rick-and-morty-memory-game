export const GAME_MODE = {
	SINGLE: "single",
	VERSUS: "versus",
} as const;

export type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE];

export const PLAYER_ID = {
	ONE: 1,
	TWO: 2,
} as const;

export type PlayerId = (typeof PLAYER_ID)[keyof typeof PLAYER_ID];

export interface Player {
	id: PlayerId;
	name: string;
	matches: number;
}

export interface VersusState {
	players: [Player, Player];
	activePlayerId: PlayerId;
}

export const DEFAULT_GAME_MODE = GAME_MODE.SINGLE;
