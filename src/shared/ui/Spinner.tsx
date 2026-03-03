type SpinnerSize = "sm" | "base" | "md";

const sizeClasses: Record<SpinnerSize, string> = {
	sm: "h-4 w-4 border-2",
	base: "h-5 w-5 border-2",
	md: "h-8 w-8 border-4",
};

interface SpinnerProps {
	size?: SpinnerSize;
	className?: string;
}

export function Spinner({
	size = "md",
	className = "",
}: Readonly<SpinnerProps>) {
	return (
		<output
			className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}
		>
			<span className="sr-only">Cargando...</span>
		</output>
	);
}
