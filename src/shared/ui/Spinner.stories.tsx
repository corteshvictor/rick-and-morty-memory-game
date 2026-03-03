import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Spinner } from "./Spinner";

const meta = {
	title: "Shared/Spinner",
	component: Spinner,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="bg-gray-900 p-8 rounded-lg text-white">
				<Story />
			</div>
		),
	],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "base", "md"],
		},
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
	args: {
		size: "sm",
	},
};

export const Base: Story = {
	args: {
		size: "base",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
	},
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			<div className="flex flex-col items-center gap-2">
				<Spinner size="sm" />
				<span className="text-xs text-white/60">sm</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner size="base" />
				<span className="text-xs text-white/60">base</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner size="md" />
				<span className="text-xs text-white/60">md</span>
			</div>
		</div>
	),
};

export const AccessibleLabel: Story = {
	args: {
		size: "md",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("Cargando...")).toBeInTheDocument();
	},
};
