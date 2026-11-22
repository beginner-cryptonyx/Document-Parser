import { useEffect, useState } from "react";
import ChoiceButton from "./small components/ChoiceButton";
import type { ViewFileProps } from "./ViewFile";
import ViewFile from "./ViewFile";
import Editor from "./Editor";
import generateBlocksFromOCR from "../lib/block_generator";

interface WorkspaceProps extends ViewFileProps {
	sessionID: string;
}

export default function Workspace({ file, sessionID }: WorkspaceProps) {
	if (file && !file.name) {
		return;
	}

	const [currentView, setCurrentView] = useState<"Output" | "Editor">(
		"Output",
	);

	const [editorFilePath, setEditorFilePath] = useState<string | null>(null);
	const [parsed, setParsed] = useState<boolean>(false);
	const [blocks, setBlocks] = useState<any>(null);

	async function StartParse() {
		try {
			const payload = {
				session_id: sessionID,
				filename: file!.name,
			};

			const response = await fetch("/api/start-parse", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(JSON.stringify(data.detail));
			} else {
				const data: { message: string; output_file: string } =
					await response.json();
				setEditorFilePath(data.output_file);
			}
			setParsed(true);
		} catch (err: any) {
			console.error("Request failed:", err.message);
		}
	}

useEffect(() => {
	if (!parsed) return; // Don't fetch before parsing finishes

	async function getOCRData() {
		try {
			const response = await fetch(
				`http://localhost:8000/uploads/${sessionID}/output.json`,
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log(data);

			const generated_blocks = generateBlocksFromOCR(data);
			setBlocks(generated_blocks);
		} catch (error) {
			console.error("Failed to load JSON:", error);
		}
	}

	getOCRData();
}, [parsed, sessionID]);
	return (
		<div className="bg-gray-800 p-5">
			{parsed ? (
				<div>
					<ChoiceButton
						choices={["Output", "Editor"]}
						onSelect={(choice: "Output" | "Editor") =>
							setCurrentView(choice)
						}
						selected={currentView}
						className="w-fit mx-auto"
					></ChoiceButton>
					{currentView === "Editor" ? (
						<Editor sessionID={sessionID} blocks={blocks}></Editor>
					) : (
						""
					)}
				</div>
			) : (
				<div>
					<ViewFile file={file}></ViewFile>
					<button
						onClick={() => {
							console.log("hi");
							StartParse();
						}}
					>
						Start Parse
					</button>
				</div>
			)}
			{editorFilePath}
		</div>
	);
}
