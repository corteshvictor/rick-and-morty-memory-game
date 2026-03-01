import { type ReactNode } from "react";

interface ModalProps {
	open: boolean;
	children: ReactNode;
}

export function Modal({ open, children }: ModalProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-amber-50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
				{children}
			</div>
		</div>
	);
}
