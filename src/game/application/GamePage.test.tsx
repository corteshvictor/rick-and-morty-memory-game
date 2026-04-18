import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GamePage } from "./GamePage";
import { useGameStore } from "./game.store";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

function renderGamePage() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>
				<GamePage />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

function selectSingleMode() {
	fireEvent.click(screen.getByRole("button", { name: /un jugador/i }));
}

function selectMediumDifficulty() {
	fireEvent.click(screen.getByRole("button", { name: /medio/i }));
}

async function advanceToPlayingPhase() {
	selectSingleMode();
	selectMediumDifficulty();
	await act(async () => {
		await vi.advanceTimersByTimeAsync(100);
	});
	await act(async () => {
		await vi.advanceTimersByTimeAsync(10000);
	});
}

describe("GamePage", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		useGameStore.getState().reset();
	});

	it("shows mode selector on initial render", () => {
		renderGamePage();

		expect(screen.getByText("Modo de Juego")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /un jugador/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /versus/i })).toBeInTheDocument();
	});

	it("shows loading spinner while fetching characters", () => {
		renderGamePage();
		selectSingleMode();
		selectMediumDifficulty();

		expect(screen.getByText("Cargando personajes...")).toBeInTheDocument();
	});

	it("renders the header with Aciertos and Turnos at 0", async () => {
		renderGamePage();
		await advanceToPlayingPhase();

		expect(screen.getByText(/aciertos:/i)).toHaveTextContent("Aciertos: 0");
		expect(screen.getByText(/turnos:/i)).toHaveTextContent("Turnos: 0");
	});

	it("shows the Reiniciar button during the playing phase", async () => {
		renderGamePage();
		await advanceToPlayingPhase();

		expect(
			screen.getByRole("button", { name: /reiniciar/i }),
		).toBeInTheDocument();
	});

	it("renders 12 face-down cards (6 pairs)", async () => {
		renderGamePage();
		await advanceToPlayingPhase();

		const cards = screen.getAllByRole("button", { name: "Carta boca abajo" });
		expect(cards).toHaveLength(12);
	});

	it("flips a card when clicked revealing the character", async () => {
		renderGamePage();
		await advanceToPlayingPhase();
		vi.useRealTimers();

		const user = userEvent.setup();
		const cards = screen.getAllByRole("button", { name: "Carta boca abajo" });
		await user.click(cards[0]);

		expect(
			screen.getAllByRole("button", { name: "Carta boca abajo" }),
		).toHaveLength(11);
	});

	it("increments turns after flipping two cards", async () => {
		renderGamePage();
		await advanceToPlayingPhase();
		vi.useRealTimers();

		const user = userEvent.setup();
		const cards = screen.getAllByRole("button", { name: "Carta boca abajo" });
		await user.click(cards[0]);
		await user.click(cards[1]);

		expect(screen.getByText(/turnos:/i)).toHaveTextContent("Turnos: 1");
	});
});
