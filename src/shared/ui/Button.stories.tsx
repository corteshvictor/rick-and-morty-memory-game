import { type Meta, type StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta = {
	title: "Shared/Button",
	component: Button,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [(Story) => <Story />],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "outline", "oauth"],
		},
		disabled: { control: "boolean" },
		children: { control: "text" },
	},
	args: {
		children: "Click me",
		onClick: fn(),
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: "primary",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
	},
};

export const OAuth: Story = {
	args: {
		variant: "oauth",
		children: "Continue with Google",
	},
};

export const Disabled: Story = {
	args: {
		variant: "primary",
		disabled: true,
	},
};
