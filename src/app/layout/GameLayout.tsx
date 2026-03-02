import { type ReactNode } from "react";
import gameBg from "@/assets/images/game-background.png";
import logo from "@/assets/images/ricky_morty_logo.svg";
import { useAuthStore } from "@/auth";

export function GameLayout({ children }: Readonly<{ children: ReactNode }>) {
	const user = useAuthStore((s) => s.user);
	const signOut = useAuthStore((s) => s.signOut);

	const displayName = user?.displayName ?? user?.email ?? "";
	const initial = displayName.charAt(0).toUpperCase();

	return (
		<div
			className="relative min-h-screen bg-[#1a1a2e] bg-cover bg-center bg-no-repeat bg-fixed"
			style={{ backgroundImage: `url(${gameBg})` }}
		>
			<div className="absolute inset-0 bg-[#1a1a2e]/95" />
			<div className="relative z-10 min-h-screen flex flex-col items-center">
				<div className="w-full max-w-3xl mx-auto px-4 flex flex-col">
					{/* User info + sign out */}
					<div className="flex justify-end items-center gap-2 py-4">
						<div className="flex items-center gap-2 bg-white/8 rounded-full pl-1 pr-3 py-1 border border-white/10">
							<div className="w-7 h-7 rounded-full bg-[#D8E054] flex items-center justify-center">
								<span className="text-xs font-bold text-[#1a1a2e]">
									{initial}
								</span>
							</div>
							<span className="text-white/70 text-sm">{displayName}</span>
						</div>
						<button
							type="button"
							onClick={signOut}
							className="text-sm text-white/70 hover:text-white bg-white/10 hover:bg-red-500/80 rounded-full px-3 py-1.5 transition-colors cursor-pointer border border-white/10 hover:border-red-500/80"
						>
							Salir
						</button>
					</div>

					{/* Logo + title centered */}
					<div className="flex flex-col items-center gap-2 pt-2 pb-6">
						<img src={logo} alt="Rick and Morty" className="h-24" />
						<span className="text-sm text-gray-900 font-medium bg-[#D8E054] rounded-[25px] px-4 py-2">
							Juego de memoria
						</span>
					</div>

					{/* Game content */}
					<main className="pb-8">{children}</main>
				</div>
			</div>
		</div>
	);
}
