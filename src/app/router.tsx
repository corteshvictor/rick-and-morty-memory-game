import { Navigate, Route, Routes } from "react-router";
import {
	AUTH_STATUS,
	AuthGuard,
	LoginPage,
	SignUpPage,
	useAuthStore,
} from "@/auth";
import { GamePage } from "@/game";
import { AuthLayout } from "./layout/AuthLayout";
import { GameLayout } from "./layout/GameLayout";

function RootRedirect() {
	const status = useAuthStore((s) => s.status);
	if (status === AUTH_STATUS.AUTHENTICATED)
		return <Navigate to="/game" replace />;

	return <Navigate to="/login" replace />;
}

export function AppRouter() {
	return (
		<Routes>
			<Route
				path="/login"
				element={
					<AuthLayout>
						<LoginPage />
					</AuthLayout>
				}
			/>
			<Route
				path="/signup"
				element={
					<AuthLayout>
						<SignUpPage />
					</AuthLayout>
				}
			/>
			<Route
				path="/game"
				element={
					<AuthGuard>
						<GameLayout>
							<GamePage />
						</GameLayout>
					</AuthGuard>
				}
			/>
			<Route path="*" element={<RootRedirect />} />
		</Routes>
	);
}
