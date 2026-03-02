import { type ReactNode } from "react";
import gameBg from "@/assets/images/game-background.png";
import logo from "@/assets/images/ricky_morty_logo.svg";
import { useAuthStore } from "@/auth";
import { Button } from "@/shared/ui/Button";

export function GameLayout({ children }: Readonly<{ children: ReactNode }>) {
	const user = useAuthStore((s) => s.user);
	const signOut = useAuthStore((s) => s.signOut);

	return (
		<div
			className="min-h-screen bg-[#1a1a2e] bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: `url(${gameBg})` }}
		>
			<header className="bg-[#16162a] border-b border-white/10 px-6 py-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<img src={logo} alt="Rick and Morty" className="h-8" />
					<span className="text-white/50 text-sm">Memorioso</span>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-white/60 text-sm">
						{user?.displayName ?? user?.email}
					</span>
					<Button
						variant="secondary"
						className="!py-1.5 !px-4 text-sm"
						onClick={signOut}
					>
						Salir
					</Button>
				</div>
			</header>
			<main className="max-w-4xl mx-auto py-6">{children}</main>
		</div>
	);
}
