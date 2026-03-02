import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "sileo";

const queryClient = new QueryClient();

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>{children}</BrowserRouter>
			<Toaster position="top-center" />
		</QueryClientProvider>
	);
}
