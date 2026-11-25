import UploadFile from "./components/UploadFile";
import { useState, useEffect } from "react";
import { type fileUploadStatus } from "./types";
import type { Block } from "./components/Editor/types";
import ViewFile from "./components/ViewFile";
import Workspace from "./components/Workspace";
import Editor from "./components/Editor/Editor";
import generateBlocksFromOCR from "./lib/block_generator";

interface StartSessionResponse {
	SessionID: string;
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
				const response: StartSessionResponse = await req.json();
				setSessionID(response.SessionID);
			}
		}

		void startSession();
	}, []);

	// temp code
	const [parsed, setParsed] = useState<boolean>(false);
	const [blocks, setBlocks] = useState<Block[]>();
	const [jsonOutput, setJsonOutput] = useState<Block[]>();
	function handleTextChange(id: string, newText: string) {
		setBlocks((prev) =>
			prev?.map((b) => (b.id === id ? { ...b, text: newText } : b)),
		);
	}
	useEffect(() => {
		if (!parsed) return; // Don't fetch before parsing finishes

		async function getOCRData() {
			try {
				const response = await fetch(
					`http://localhost:8000/uploads/ztest/output.json`,
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				console.log(data);

				const generated_blocks = generateBlocksFromOCR(data);
				setBlocks(generated_blocks);
				console.log(blocks);
			} catch (error) {
				console.error("Failed to load JSON:", error);
			}
		}

		getOCRData();
	}, [parsed, sessionID]);

	async function HandleEdit(new_data: Block[]) {
		try {
			const payload = {
				new_data: new_data,
				session_id: "ztest",
			};
			const response = await fetch("/api/edit-json", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const res = await response.json();
				console.log(res.detail);
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			console.log(data);
		} catch (err) {
			console.log("Could not edit file, error: ", err);
		}
	}

	//temp code end

	return (
		sessionID && (
			<div>
				<p>{sessionID}</p>
				<button onClick={checkHealth}>check health</button>
				<p>Health: {health}</p>
				<UploadFile
					selectedFile={selectedFile}
					status={uploadStatus}
					setSelectedFiles={setSelectedFiles}
					setStatus={setUploadStatus}
					sessionID={sessionID}
				/>
				{uploadStatus === "success" && selectedFile && (
					<Workspace
						file={selectedFile}
						sessionID={sessionID}
					></Workspace>
				)}
				<button
					className="p-3 bg-accent"
					onClick={() => setParsed(true)}
				>
					{" "}
					Test Editor{" "}
				</button>
				{blocks && (
					<div className="w-[70vw]">
						<Editor
							blocks={blocks}
							imageUrl={`http://localhost:8000/uploads/ztest/processed_image.jpg`}
							pageHeight={1778}
							pageWidth={1296}
							onEditBlock={handleTextChange}
						></Editor>
						<button
							className="p-5 bg-accent"
							onClick={() => {
								console.log(JSON.stringify(blocks));
								HandleEdit(blocks);
							}}
						>
							Confirm changes
						</button>
					</div>
				)}
			</div>
		)
	);
}
