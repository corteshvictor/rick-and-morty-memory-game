import { type SileoPosition, sileo } from "sileo";

const DEFAULT_POSITION: SileoPosition = "top-center";

interface NotifyErrorOptions {
	message: string;
	title?: string;
	position?: SileoPosition;
}

export function notifyError({
	message,
	title = "Error",
	position = DEFAULT_POSITION,
}: NotifyErrorOptions) {
	sileo.error({
		title,
		description: message,
		position,
	});
}
