import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useAuthStore } from "./auth.store";

export function LoginPage() {
	const { signIn, signInWithOAuth, error, status } = useAuthStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	if (status === "authenticated") {
		return <Navigate to="/game" replace />;
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		await signIn({ email, password });
		setLoading(false);
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
				placeholder="••••••••"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				minLength={6}
			/>

			{error && <p className="text-red-400 text-sm text-center">{error}</p>}

			<Button type="submit" disabled={loading}>
				{loading ? "Ingresando..." : "Iniciar sesión"}
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
					onClick={() => signInWithOAuth("google")}
				>
					Google
				</Button>
				<Button
					type="button"
					variant="oauth"
					className="flex-1"
					onClick={() => signInWithOAuth("github")}
				>
					GitHub
				</Button>
			</div>

			<p className="text-white/50 text-sm text-center mt-2">
				¿No tienes cuenta?{" "}
				<Link to="/signup" className="text-green-400 hover:underline">
					Regístrate
				</Link>
			</p>
		</form>
	);
}
