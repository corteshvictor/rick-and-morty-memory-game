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

async function waitForPlayingPhase(page: import("@playwright/test").Page) {
	const restartBtn = page.getByRole("button", { name: "Reiniciar" });
	const retryBtn = page.getByRole("button", { name: "Reintentar" });

	await expect(restartBtn.or(retryBtn)).toBeVisible({ timeout: 15000 });

	if (await retryBtn.isVisible()) {
		await retryBtn.click();
		await expect(restartBtn).toBeVisible({ timeout: 15000 });
	}
}

test.describe("Game flow", () => {
	test("cards can be flipped by clicking on them", async ({ page }) => {
		await login(page);
		await waitForPlayingPhase(page);

		const faceDownCards = page.getByRole("button", {
			name: "Carta boca abajo",
		});
		const initialCount = await faceDownCards.count();
		await faceDownCards.first().click();

		await expect(faceDownCards).toHaveCount(initialCount - 1);
	});

	test("flipping two cards increments the turns counter", async ({ page }) => {
		await login(page);
		await waitForPlayingPhase(page);

		const faceDownCards = page.getByRole("button", {
			name: "Carta boca abajo",
		});
		await faceDownCards.nth(0).click();
		await faceDownCards.nth(0).click();

		await expect(page.getByText("Turnos:")).toContainText("Turnos: 1");
	});

	test("restart button resets the game board", async ({ page }) => {
		await login(page);
		await waitForPlayingPhase(page);

		const faceDownCards = page.getByRole("button", {
			name: "Carta boca abajo",
		});
		await faceDownCards.nth(0).click();
		await faceDownCards.nth(0).click();

		await expect(page.getByText("Turnos:")).toContainText("Turnos: 1");

		await page.getByRole("button", { name: "Reiniciar" }).click();

		await waitForPlayingPhase(page);
		await expect(page.getByText("Turnos:")).toContainText("Turnos: 0");
		await expect(page.getByText("Aciertos:")).toContainText("Aciertos: 0");
	});
});
