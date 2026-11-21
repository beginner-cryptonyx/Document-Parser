import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function urlToFile(url: string, fileName: string): Promise<File> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch file: ${response.statusText}`);
	}

	const blob = await response.blob();
	// Uses the MIME type sent by your backend (e.g., "image/png", "image/jpeg")
	return new File([blob], fileName, { type: blob.type });
}