import {
	PLAYER_ID,
	type Player,
	type PlayerId,
	type VersusState,
} from "./multiplayer.model";

/**
 * Crea el estado inicial de versus con 2 jugadores.
 * Player 1 siempre empieza.
 */
export function createVersusState(name1: string, name2: string): VersusState {
	return {
		players: [
			{ id: PLAYER_ID.ONE, name: name1, matches: 0 },
			{ id: PLAYER_ID.TWO, name: name2, matches: 0 },
		],
		activePlayerId: PLAYER_ID.ONE,
	};
}

/**
 * Retorna el ID del otro jugador.
 */
export function getOpponent(playerId: PlayerId): PlayerId {
	return playerId === PLAYER_ID.ONE ? PLAYER_ID.TWO : PLAYER_ID.ONE;
}

/**
 * Incrementa los matches del jugador indicado.
 * Retorna nuevo array de players (inmutable).
 */
export function addMatchToPlayer(
	players: [Player, Player],
	playerId: PlayerId,
): [Player, Player] {
	return players.map((p) =>
		p.id === playerId ? { ...p, matches: p.matches + 1 } : p,
	) as [Player, Player];
}

/**
 * Determina el ganador basado en matches.
 * Retorna el Player ganador, o null si es empate.
 */
export function getWinner(players: [Player, Player]): Player | null {
	if (players[0].matches > players[1].matches) return players[0];
	if (players[1].matches > players[0].matches) return players[1];
	return null; // empate
}
