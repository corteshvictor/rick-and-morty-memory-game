import { type ReactNode, type SubmitEvent, useState } from "react";
import { Link } from "react-router";
import githubIcon from "@/assets/icons/github.svg";
import googleIcon from "@/assets/icons/gmail.svg";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Spinner } from "@/shared/ui/Spinner";
import { useAuthStore } from "./auth.store";

interface AuthFormProps {
	onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
	submitLabel: string;
	passwordPlaceholder?: string;
	extraFields?: ReactNode;
	footerLink: { text: string; linkText: string; to: string };
}

export function AuthForm({
	onSubmit,
	submitLabel,
	passwordPlaceholder = "••••••••",
	extraFields,
	footerLink,
}: Readonly<AuthFormProps>) {
	const { signInWithOAuth, oauthProvider } = useAuthStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const busy = loading || oauthProvider !== null;

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		await onSubmit({ email, password });
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
				placeholder={passwordPlaceholder}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				minLength={6}
			/>

			{extraFields}

			<Button type="submit" disabled={busy}>
				{loading ? <Spinner size="base" /> : submitLabel}
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
					{oauthProvider === "google" ? (
						<Spinner size="sm" />
					) : (
						<>
							<img src={googleIcon} alt="" className="w-5 h-5" />
							<span>Google</span>
						</>
					)}
				</Button>
				<Button
					type="button"
					variant="oauth"
					className="flex-1"
					disabled={busy}
					onClick={() => signInWithOAuth("github")}
				>
					{oauthProvider === "github" ? (
						<Spinner size="sm" />
					) : (
						<>
							<img src={githubIcon} alt="" className="w-5 h-5" />
							<span>GitHub</span>
						</>
					)}
				</Button>
			</div>

			<p className="text-white/50 text-sm text-center mt-2">
				{footerLink.text}{" "}
				<Link to={footerLink.to} className="text-green-400 hover:underline">
					{footerLink.linkText}
				</Link>
			</p>
		</form>
	);
}
