import UploadFile from "./components/UploadFile";
import { useState, useEffect } from "react";
import { type fileUploadStatus } from "./types";
import ViewFile from "./components/ViewFile";
import Workspace from "./components/Workspace";

interface StartSessionResponse{
	SessionID: string
}

export default function App() {
	const [uploadStatus, setUploadStatus] = useState<fileUploadStatus>("idle");
	const [selectedFile, setSelectedFiles] = useState<File | null>(null);
	const [sessionID, setSessionID] = useState<string | null>(null);

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

	useEffect(() => {
		async function startSession() {
			const req = await fetch("/api/start-session");


			if (req.ok) {
				const response: StartSessionResponse = await req.json()
				setSessionID(response.SessionID)
			}
		}

		void startSession();
	}, []);

	return (
		<div>
			<p>{sessionID}</p>
			<button onClick={checkHealth}>check health</button>
			<p>Health: {health}</p>
			<UploadFile
				selectedFile={selectedFile}
				status={uploadStatus}
				setSelectedFiles={setSelectedFiles}
				setStatus={setUploadStatus}
			/>
			{uploadStatus === "success" && selectedFile && (
				<Workspace file={selectedFile}></Workspace>
			)}
		</div>
	);
}
