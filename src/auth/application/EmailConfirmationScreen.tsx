import { Link } from "react-router";
import mailIcon from "@/assets/icons/mail.svg";

interface EmailConfirmationScreenProps {
	email: string;
}

export function EmailConfirmationScreen({
	email,
}: Readonly<EmailConfirmationScreenProps>) {
	return (
		<div className="flex flex-col items-center gap-6 text-center w-full">
			<div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
				<img src={mailIcon} alt="Correo electrónico" className="w-8 h-8" />
			</div>
			<div>
				<h2 className="text-xl font-semibold text-white mb-2">
					Revisa tu correo electrónico
				</h2>
				<p className="text-white/60 text-sm leading-relaxed">
					Hemos enviado un enlace de confirmación a{" "}
					<span className="text-green-400 font-medium">{email}</span>. Revisa tu
					bandeja de entrada y haz clic en el enlace para activar tu cuenta.
				</p>
			</div>
			<Link to="/login" className="text-green-400 hover:underline text-sm mt-2">
				Volver a iniciar sesión
			</Link>
		</div>
	);
}
