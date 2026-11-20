import UploadFile from "./components/UploadFile";
import { useState } from "react";
import { type fileUploadStatus } from "./types";

export default function App() {
	const [uploadStatus, setUploadStatus] = useState<fileUploadStatus>("idle");
	const [selectedFile, setSelectedFiles] = useState<File | null>(null);

	const [health, setHeath] = useState<"Healthy" | "Unhealthy" | "Unknown">(
		"Unknown",
	);
	async function checkHealth() {
		const req = await fetch("/api/health");
		if (!req.ok) {
			setHeath("Unhealthy");
		} else {
			setHeath("Healthy");
		}
	}

	return (
		<div>
			<button onClick={checkHealth}>check health</button>
			<p>Health: {health}</p>
			<UploadFile
				selectedFile={selectedFile}
				status={uploadStatus}
				setSelectedFiles={setSelectedFiles}
				setStatus={setUploadStatus}
			/>
		</div>
	);
}
