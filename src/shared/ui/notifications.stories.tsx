import { type Meta, type StoryObj } from "@storybook/react-vite";
import { Toaster } from "sileo";
import { expect, userEvent, within } from "storybook/test";
import { notifyError } from "./notifications";

function NotifyErrorDemo({
	message,
	title,
	position,
}: Readonly<{
	message: string;
	title?: string;
	position?:
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-center"
		| "bottom-right";
}>) {
	return (
		<button
			type="button"
			onClick={() => notifyError({ message, title, position })}
			className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
		>
			Trigger Error
		</button>
	);
}

const meta = {
	title: "Shared/notifyError",
	component: NotifyErrorDemo,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="bg-gray-900 p-8 rounded-lg">
				<Toaster position="top-center" />
				<Story />
			</div>
		),
	],
	argTypes: {
		message: { control: "text" },
		title: { control: "text" },
		position: {
			control: "select",
			options: [
				"top-left",
				"top-center",
				"top-right",
				"bottom-left",
				"bottom-center",
				"bottom-right",
			],
		},
	},
	args: {
		message: "Something went wrong. Please try again.",
		title: "Error",
		position: "top-center",
	},
} satisfies Meta<typeof NotifyErrorDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTitle: Story = {
	args: {
		title: "Authentication Failed",
		message: "Invalid email or password.",
	},
};

export const BottomRight: Story = {
	args: {
		message: "Network connection lost.",
		position: "bottom-right",
	},
};

export const ClickToShow: Story = {
	args: {
		message: "This error was triggered by a test interaction.",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button", { name: /trigger error/i });

		await userEvent.click(button);

		const toast = await within(document.body).findByText(
			"This error was triggered by a test interaction.",
		);
		await expect(toast).toBeInTheDocument();
	},
};
