import { type SubmitEvent, useState } from "react";
import { Link, Navigate } from "react-router";
import { AUTH_STATUS } from "@/auth/domain/auth.model";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Spinner } from "@/shared/ui/Spinner";
import { useAuthStore } from "./auth.store";
import { EmailConfirmationScreen } from "./EmailConfirmationScreen";

export function SignUpPage() {
	const { signUp, signInWithOAuth, status, oauthProvider } = useAuthStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmError, setConfirmError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const busy = loading || oauthProvider !== null;

	if (status === AUTH_STATUS.AUTHENTICATED) {
		return <Navigate to="/game" replace />;
	}

	if (showConfirmation) {
		return <EmailConfirmationScreen email={email} />;
	}

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setConfirmError("");

		if (password !== confirmPassword) {
			setConfirmError("Las contraseñas no coinciden");
			return;
		}

		setLoading(true);
		const result = await signUp({ email, password });
		setLoading(false);

		if (result.needsEmailConfirmation) {
			setShowConfirmation(true);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
			<Input
				id="email"
				label="Correo electrónico"
				type="email"
				placeholder="tu@email.com"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<Input
				id="password"
				label="Contraseña"
				type="password"
				placeholder="Mínimo 6 caracteres"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				minLength={6}
			/>
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

			<Button type="submit" disabled={busy}>
				{loading ? <Spinner size="base" /> : "Registrarse"}
			</Button>

			<div className="flex items-center gap-3 my-2">
				<div className="flex-1 h-px bg-white/20" />
				<span className="text-white/50 text-sm">o continúa con</span>
				<div className="flex-1 h-px bg-white/20" />
			</div>

			<div className="flex gap-3">
				<Button
					type="button"
					variant="oauth"
					className="flex-1"
					disabled={busy}
					onClick={() => signInWithOAuth("google")}
				>
					{oauthProvider === "google" ? <Spinner size="sm" /> : "Google"}
				</Button>
				<Button
					type="button"
					variant="oauth"
					className="flex-1"
					disabled={busy}
					onClick={() => signInWithOAuth("github")}
				>
					{oauthProvider === "github" ? <Spinner size="sm" /> : "GitHub"}
				</Button>
			</div>

			<p className="text-white/50 text-sm text-center mt-2">
				¿Ya tienes cuenta?{" "}
				<Link to="/login" className="text-green-400 hover:underline">
					Inicia sesión
				</Link>
			</p>
		</form>
	);
}
