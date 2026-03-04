import { Navigate } from "react-router";
import { AUTH_STATUS } from "@/auth/domain/auth.model";
import { AuthForm } from "./AuthForm";
import { useAuthStore } from "./auth.store";

export function LoginPage() {
	const { signIn, status } = useAuthStore();

	if (status === AUTH_STATUS.AUTHENTICATED) {
		return <Navigate to="/game" replace />;
	}

	return (
		<AuthForm
			onSubmit={signIn}
			submitLabel="Iniciar sesión"
			footerLink={{
				text: "¿No tienes cuenta?",
				linkText: "Regístrate",
				to: "/signup",
			}}
		/>
	);
}
