import { type ReactNode } from "react";

interface StarfieldBackgroundProps {
	children: ReactNode;
}

export function StarfieldBackground({
	children,
}: Readonly<StarfieldBackgroundProps>) {
	return (
		<div className="starfield-bg relative min-h-screen overflow-hidden">
			{/* Capa 0: Gradiente galactico base */}
			<div className="galaxy-base" aria-hidden="true" />

			{/* Capa 1: Nebulosas de gas (manchas de color tenues) */}
			<div className="nebula-layer" aria-hidden="true" />

			{/* Capa 2: Estrellas lejanas (pequenas, tenues, parpadeo lento) */}
			<div className="stars-layer stars-far" aria-hidden="true" />

			{/* Capa 3: Estrellas medias (colores variados, parpadeo medio) */}
			<div className="stars-layer stars-mid" aria-hidden="true" />

			{/* Capa 4: Estrellas cercanas (grandes, brillantes, glow) */}
			<div className="stars-layer stars-near" aria-hidden="true" />

			{/* Capa 5: Estrellas fugaces */}
			<div className="shooting-star shooting-star-1" aria-hidden="true" />
			<div className="shooting-star shooting-star-2" aria-hidden="true" />
			<div className="shooting-star shooting-star-3" aria-hidden="true" />
			<div className="shooting-star shooting-star-4" aria-hidden="true" />
			<div className="shooting-star shooting-star-5" aria-hidden="true" />

			{/* Capa 6: Contenido */}
			<div className="relative z-10 min-h-screen">{children}</div>
		</div>
	);
}
