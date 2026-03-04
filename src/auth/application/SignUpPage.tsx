import { useState } from "react";
import { Navigate } from "react-router";
import { AUTH_STATUS } from "@/auth/domain/auth.model";
import { Input } from "@/shared/ui/Input";
import { AuthForm } from "./AuthForm";
import { useAuthStore } from "./auth.store";
import { EmailConfirmationScreen } from "./EmailConfirmationScreen";

export function SignUpPage() {
	const { signUp, status } = useAuthStore();
	const [email, setEmail] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmError, setConfirmError] = useState("");
	const [showConfirmation, setShowConfirmation] = useState(false);

	if (status === AUTH_STATUS.AUTHENTICATED) {
		return <Navigate to="/game" replace />;
	}

	if (showConfirmation) {
		return <EmailConfirmationScreen email={email} />;
	}

	const handleSubmit = async (credentials: {
		email: string;
		password: string;
	}) => {
		setConfirmError("");

		if (credentials.password !== confirmPassword) {
			setConfirmError("Las contraseñas no coinciden");
			return;
		}

		setEmail(credentials.email);
		const result = await signUp(credentials);

		if (result.needsEmailConfirmation) {
			setShowConfirmation(true);
		}
	};

	return (
		<AuthForm
			onSubmit={handleSubmit}
			submitLabel="Registrarse"
			passwordPlaceholder="Mínimo 6 caracteres"
			extraFields={
				<Input
					id="confirmPassword"
					label="Confirmar contraseña"
					type="password"
					placeholder="Repite tu contraseña"
					value={confirmPassword}
					onChange={(e) => {
						setConfirmPassword(e.target.value);
						if (confirmError) setConfirmError("");
					}}
					required
					minLength={6}
					error={confirmError}
				/>
			}
			footerLink={{
				text: "¿Ya tienes cuenta?",
				linkText: "Inicia sesión",
				to: "/login",
			}}
		/>
	);
}
