import { type ReactNode } from "react";
import logo from "@/assets/images/ricky_morty_logo.svg";

export function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center px-4">
			<div className="mb-8 text-center">
				<img src={logo} alt="Rick and Morty" className="h-20 mx-auto mb-2" />
				<p className="text-white/50 mt-1">Juego de Memoria</p>
			</div>
			<div className="w-full max-w-sm">{children}</div>
		</div>
	);
}
