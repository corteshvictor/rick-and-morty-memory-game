import { expect, test } from "@playwright/test";
import { e2eEnvs } from "./env";

const { E2E_USER_EMAIL, E2E_USER_PASSWORD } = e2eEnvs;

async function login(page: import("@playwright/test").Page) {
	await page.goto("/login");
	await page.getByLabel("Correo electrónico").fill(E2E_USER_EMAIL);
	await page.getByLabel("Contraseña", { exact: true }).fill(E2E_USER_PASSWORD);
	await page.getByRole("button", { name: "Iniciar sesión" }).click();
	await expect(page).toHaveURL(/\/game/);
}

test.describe("Login flow", () => {
	test("successful login navigates to the game page", async ({ page }) => {
		await login(page);

		await expect(page.getByText("Juego de memoria")).toBeVisible();
	});

	test("logout redirects to the login page", async ({ page }) => {
		await login(page);

		await page.getByRole("button", { name: "Salir" }).click();
		await expect(page).toHaveURL(/\/login/);
	});
});
