import { type Meta, type StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CARD_STATUS, type Card } from "@/game/domain/card.model";
import { GameCard } from "./GameCard";

const baseCard: Card = {
	id: "card-1",
	pairId: "pair-1",
	name: "Rick Sanchez",
	imageUrl: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
	characterStatus: "Alive",
	species: "Human",
	status: CARD_STATUS.FACE_DOWN,
};

const meta = {
	title: "Game/GameCard",
	component: GameCard,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="bg-gray-100 p-8 rounded-lg w-48">
				<Story />
			</div>
		),
	],
	args: {
		card: baseCard,
		onClick: fn(),
		disabled: false,
	},
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FaceDown: Story = {};

export const FaceUp: Story = {
	args: {
		card: {
			...baseCard,
			status: CARD_STATUS.FACE_UP,
		},
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const DifferentCharacter: Story = {
	args: {
		card: {
			...baseCard,
			id: "card-2",
			name: "Morty Smith",
			imageUrl: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
			characterStatus: "Alive",
			species: "Human",
			status: CARD_STATUS.FACE_UP,
		},
	},
};
