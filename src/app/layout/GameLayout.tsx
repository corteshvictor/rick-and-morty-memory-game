import { type ReactNode } from "react";
import { useAuthStore } from "@/auth";
import { Button } from "@/shared/ui/Button";

export function GameLayout({ children }: { children: ReactNode }) {
	const user = useAuthStore((s) => s.user);
	const signOut = useAuthStore((s) => s.signOut);

	return (
		<div className="min-h-screen bg-[#1a1a2e]">
			<header className="bg-[#16162a] border-b border-white/10 px-6 py-3 flex items-center justify-between">
				<h1 className="text-xl font-bold text-white">
					Rick <span className="text-green-400">&</span> Morty
					<span className="text-white/50 text-sm font-normal ml-2">
						Memorioso
					</span>
				</h1>
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
