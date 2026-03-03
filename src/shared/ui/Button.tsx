import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "oauth";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg",
	secondary:
		"bg-transparent border border-white/30 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-lg",
	outline:
		"bg-gray-50 border border-gray-400 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg",
	oauth:
		"bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg border border-white/20 flex items-center justify-center gap-2",
};

export function Button({
	variant = "primary",
	className = "",
	...props
}: Readonly<ButtonProps>) {
	return (
		<button
			className={`transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
			{...props}
		/>
	);
}
