import { type ReactNode, useEffect } from "react";
import { Navigate } from "react-router";
import { AUTH_STATUS } from "@/auth/domain/auth.model";
import { Spinner } from "@/shared/ui/Spinner";
import { StarfieldBackground } from "@/shared/ui/StarfieldBackground";
import { useAuthStore } from "./auth.store";

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
	const status = useAuthStore((s) => s.status);
	const initialize = useAuthStore((s) => s.initialize);

	useEffect(() => {
		const unsubscribe = initialize();
		return unsubscribe;
	}, [initialize]);

	if (status === AUTH_STATUS.LOADING) {
		return (
			<StarfieldBackground>
				<div className="flex items-center justify-center min-h-screen">
					<Spinner className="text-green-500" />
				</div>
			</StarfieldBackground>
		);
	}

	if (status === AUTH_STATUS.UNAUTHENTICATED) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}
