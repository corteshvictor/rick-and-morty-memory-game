import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Modal } from "./Modal";

const meta = {
	title: "Shared/Modal",
	component: Modal,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		open: { control: "boolean" },
	},
	args: {
		open: true,
	},
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
				<p className="text-gray-600 mb-6">You completed the game.</p>
				<button
					type="button"
					className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg"
				>
					Play Again
				</button>
			</div>
		),
	},
};

export const WithForm: Story = {
	args: {
		children: (
			<div>
				<h2 className="text-xl font-bold text-gray-800 mb-4">
					Enter your name
				</h2>
				<input
					type="text"
					placeholder="Name"
					className="w-full border border-gray-300 rounded-lg py-2 px-3 mb-4"
				/>
				<div className="flex justify-end gap-2">
					<button
						type="button"
						className="py-2 px-4 rounded-lg border border-gray-300 text-gray-600"
					>
						Cancel
					</button>
					<button
						type="button"
						className="bg-green-700 text-white py-2 px-4 rounded-lg"
					>
						Confirm
					</button>
				</div>
			</div>
		),
	},
};

export const Closed: Story = {
	args: {
		open: false,
		children: <p>This content is not visible</p>,
	},
};

export const ContentVisible: Story = {
	args: {
		children: (
			<div>
				<h2 className="text-xl font-bold text-gray-800 mb-2">Confirmation</h2>
				<p className="text-gray-600">Are you sure you want to continue?</p>
			</div>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText("Confirmation")).toBeVisible();
		await expect(
			canvas.getByText("Are you sure you want to continue?"),
		).toBeVisible();
	},
};
