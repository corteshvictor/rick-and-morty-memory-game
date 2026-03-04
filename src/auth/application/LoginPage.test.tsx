import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { envs } from "@/app/config/env";
import { AUTH_STATUS } from "@/auth/domain/auth.model";
import { server } from "@/mocks/node";
import { useAuthStore } from "./auth.store";
import { LoginPage } from "./LoginPage";

function renderLoginPage() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={["/login"]}>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/game" element={<p>Game Page</p>} />
				</Routes>
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

describe("LoginPage", () => {
	afterEach(() => {
		useAuthStore.setState({
			user: null,
			status: AUTH_STATUS.LOADING,
			error: null,
			oauthProvider: null,
			signingOut: false,
		});
	});

	it("renders the login form with email, password, and submit button", () => {
		useAuthStore.setState({ status: AUTH_STATUS.UNAUTHENTICATED });
		renderLoginPage();

		expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
		expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Iniciar sesión" }),
		).toBeInTheDocument();
	});

	it("navigates to /game on successful login", async () => {
		useAuthStore.setState({ status: AUTH_STATUS.UNAUTHENTICATED });
		const user = userEvent.setup();
		renderLoginPage();

		await user.type(
			screen.getByLabelText("Correo electrónico"),
			"test@example.com",
		);
		await user.type(screen.getByLabelText("Contraseña"), "password123");
		await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

		await waitFor(() => {
			expect(screen.getByText("Game Page")).toBeInTheDocument();
		});
	});

	it("shows error with invalid credentials", async () => {
		useAuthStore.setState({ status: AUTH_STATUS.UNAUTHENTICATED });
		server.use(
			http.post(`${envs.SUPABASE_URL}/auth/v1/token`, () => {
				return HttpResponse.json(
					{
						error: "invalid_grant",
						error_description: "Invalid login credentials",
					},
					{ status: 400 },
				);
			}),
		);

		const user = userEvent.setup();
		renderLoginPage();

		await user.type(
			screen.getByLabelText("Correo electrónico"),
			"wrong@example.com",
		);
		await user.type(screen.getByLabelText("Contraseña"), "wrongpass");
		await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

		await waitFor(() => {
			expect(useAuthStore.getState().error).toBe("Invalid login credentials");
		});

		expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
	});
});
