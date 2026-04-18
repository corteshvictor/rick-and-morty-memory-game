export const DIFFICULTY_LEVEL = {
	EASY: "easy",
	MEDIUM: "medium",
	HARD: "hard",
} as const;

export type DifficultyLevel =
	(typeof DIFFICULTY_LEVEL)[keyof typeof DIFFICULTY_LEVEL];

export interface Difficultyconfig {
	level: DifficultyLevel;
	label: string;
	totalPairs: number;
	previewTime: number;
	shuffleSwaps: number;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, Difficultyconfig> = {
	[DIFFICULTY_LEVEL.EASY]: {
		level: DIFFICULTY_LEVEL.EASY,
		label: "Facil",
		totalPairs: 4,
		previewTime: 4000,
		shuffleSwaps: 4,
	},
	[DIFFICULTY_LEVEL.MEDIUM]: {
		level: DIFFICULTY_LEVEL.MEDIUM,
		label: "Medio",
		totalPairs: 6,
		previewTime: 3000,
		shuffleSwaps: 6,
	},
	[DIFFICULTY_LEVEL.HARD]: {
		level: DIFFICULTY_LEVEL.HARD,
		label: "Dificil",
		totalPairs: 10,
		previewTime: 4000,
		shuffleSwaps: 8,
	},
};

export const DEFAULT_DIFFICULTY = DIFFICULTY_LEVEL.MEDIUM;
