import { type InputHTMLAttributes, useState } from "react";
import eyeIcon from "@/assets/icons/eye.svg";
import eyeOffIcon from "@/assets/icons/eye-off.svg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export function Input({
	label,
	error,
	id,
	type,
	className = "",
	...props
}: Readonly<InputProps>) {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";

	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label htmlFor={id} className="text-sm text-white/80">
					{label}
				</label>
			)}
			<div className="relative">
				<input
					id={id}
					type={isPassword && showPassword ? "text" : type}
					className={`w-full bg-white/10 border border-white/20 text-white rounded-lg py-3 px-4 ${isPassword ? "pr-12" : ""} placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors ${error ? "border-red-400" : ""} ${className}`}
					{...props}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
						aria-label={
							showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
						}
					>
						<img
							src={showPassword ? eyeOffIcon : eyeIcon}
							alt=""
							className="w-5 h-5"
							aria-hidden="true"
						/>
					</button>
				)}
			</div>
			{error && <span className="text-sm text-red-400">{error}</span>}
		</div>
	);
}
