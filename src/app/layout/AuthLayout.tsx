import { type ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center px-4">
			<div className="mb-8 text-center">
				<h1 className="text-4xl font-bold text-white tracking-wide">
					Rick <span className="text-green-400">&</span> Morty
				</h1>
				<p className="text-white/50 mt-1">Juego de Memoria</p>
			</div>
			<div className="w-full max-w-sm">{children}</div>
		</div>
	);
}
