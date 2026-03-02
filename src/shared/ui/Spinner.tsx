export function Spinner({ className = "" }: Readonly<{ className?: string }>) {
	return (
		<output
			className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent ${className}`}
		>
			<span className="sr-only">Cargando...</span>
		</output>
	);
}
