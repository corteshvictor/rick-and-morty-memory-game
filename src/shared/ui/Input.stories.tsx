import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Input } from "./Input";

const meta = {
	title: "Shared/Input",
	component: Input,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="bg-gray-900 p-8 rounded-lg w-80">
				<Story />
			</div>
		),
	],
	argTypes: {
		label: { control: "text" },
		error: { control: "text" },
		type: {
			control: "select",
			options: ["text", "email", "password"],
		},
		placeholder: { control: "text" },
		disabled: { control: "boolean" },
	},
	args: {
		id: "input-story",
		placeholder: "Type something...",
		onChange: fn(),
		onFocus: fn(),
		onBlur: fn(),
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		type: "text",
	},
};

export const WithLabel: Story = {
	args: {
		label: "Email",
		type: "email",
		placeholder: "you@example.com",
	},
};

export const WithError: Story = {
	args: {
		label: "Email",
		type: "email",
		error: "Invalid email address",
		placeholder: "you@example.com",
	},
};

export const Password: Story = {
	args: {
		label: "Password",
		type: "password",
		placeholder: "Enter your password",
	},
};

export const Disabled: Story = {
	args: {
		label: "Disabled field",
		type: "text",
		disabled: true,
		placeholder: "Cannot edit this",
	},
};

export const TypingInteraction: Story = {
	args: {
		label: "Username",
		type: "text",
		placeholder: "Enter username",
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("textbox");

		await userEvent.click(input);
		await expect(args.onFocus).toHaveBeenCalled();

		await userEvent.type(input, "rickc137");
		await expect(input).toHaveValue("rickc137");
		await expect(args.onChange).toHaveBeenCalled();
	},
};

export const PasswordToggle: Story = {
	args: {
		label: "Password",
		type: "password",
		placeholder: "Enter your password",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("Enter your password");

		await userEvent.type(input, "secret123");
		await expect(input).toHaveAttribute("type", "password");

		const toggleButton = canvas.getByRole("button", {
			name: /mostrar contraseña/i,
		});
		await userEvent.click(toggleButton);
		await expect(input).toHaveAttribute("type", "text");

		await userEvent.click(toggleButton);
		await expect(input).toHaveAttribute("type", "password");
	},
};
