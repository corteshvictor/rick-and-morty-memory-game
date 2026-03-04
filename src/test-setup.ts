import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/mocks/node";

afterEach(() => {
	cleanup();
});

beforeAll(() => server.listen());
afterEach(() => {
	cleanup(); // Limpiar DOM entre tests
	server.resetHandlers();
});
afterAll(() => server.close());
