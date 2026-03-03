import { type Meta, type StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, within } from "storybook/test";
import { EmailConfirmationScreen } from "./EmailConfirmationScreen";

const meta = {
	title: "Auth/EmailConfirmationScreen",
	component: EmailConfirmationScreen,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<div className="bg-gray-900 p-8 rounded-lg max-w-md">
					<Story />
				</div>
			</MemoryRouter>
		),
	],
	args: {
		email: "rick@example.com",
	},
} satisfies Meta<typeof EmailConfirmationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongEmail: Story = {
	args: {
		email: "morty.smith.very.long.email@interdimensional-mail.com",
	},
};

export const RendersCorrectly: Story = {
	args: {
		email: "test@example.com",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(
			canvas.getByText("Revisa tu correo electrónico"),
		).toBeVisible();
		await expect(canvas.getByText("test@example.com")).toBeVisible();
		await expect(
			canvas.getByRole("link", { name: /volver a iniciar sesión/i }),
		).toHaveAttribute("href", "/login");
	},
};
