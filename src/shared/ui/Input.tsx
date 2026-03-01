import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export function Input({
	label,
	error,
	id,
	className = "",
	...props
}: InputProps) {
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label htmlFor={id} className="text-sm text-white/80">
					{label}
				</label>
			)}
			<input
				id={id}
				className={`bg-white/10 border border-white/20 text-white rounded-lg py-3 px-4 placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors ${error ? "border-red-400" : ""} ${className}`}
				{...props}
			/>
			{error && <span className="text-sm text-red-400">{error}</span>}
		</div>
	);
}
