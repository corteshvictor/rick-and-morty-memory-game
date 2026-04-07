import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { GameHeader } from "./GameHeader";
import { GAME_MODE } from "@/game/domain/multiplayer.model";

const meta = {
	title: "Game/GameHeader",
	component: GameHeader,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	decorators: [
		(Story) => (
			<div className="bg-gray-100 p-4 rounded-lg max-w-md">
				<Story />
			</div>
		),
	],
	args: {
		matches: 0,
		turns: 0,
		onRestart: fn(),
		canRestart: true,
		mode: GAME_MODE.SINGLE,
	},
} satisfies Meta<typeof GameHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MidGame: Story = {
	args: {
		matches: 3,
		turns: 8,
	},
};

export const EndGame: Story = {
	args: {
		matches: 6,
		turns: 15,
	},
};

export const WithoutRestart: Story = {
	args: {
		matches: 0,
		turns: 0,
		canRestart: false,
	},
};

export const RestartInteraction: Story = {
	args: {
		matches: 2,
		turns: 5,
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const restartButton = canvas.getByRole("button", {
			name: /reiniciar/i,
		});

		await userEvent.click(restartButton);
		await expect(args.onRestart).toHaveBeenCalledOnce();
	},
};

export const DisplaysStats: Story = {
	args: {
		matches: 4,
		turns: 12,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText("4")).toBeVisible();
		await expect(canvas.getByText("12")).toBeVisible();
	},
};

export const VersusMode: Story = {
	args: {
		mode: GAME_MODE.VERSUS,
		versusPlayers: [
			{ id: 1, name: "Rick", matches: 3 },
			{ id: 2, name: "Morty", matches: 2 },
		],
		versusActivePlayerId: 1,
		turns: 10,
	},
};

export const VersusModePlayer2Active: Story = {
	args: {
		mode: GAME_MODE.VERSUS,
		versusPlayers: [
			{ id: 1, name: "Rick", matches: 3 },
			{ id: 2, name: "Morty", matches: 4 },
		],
		versusActivePlayerId: 2,
		turns: 14,
	},
};
