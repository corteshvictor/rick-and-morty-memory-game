import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { GameHeader } from "./GameHeader";

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
