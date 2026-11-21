import { useState } from "react";
import ChoiceButton from "./small components/ChoiceButton";
import type { ViewFileProps } from "./ViewFile";
import ViewFile from "./ViewFile";

interface WorkspaceProps extends ViewFileProps {
	sessionID: string
}

export default function Workspace({ file, sessionID }: WorkspaceProps) {
	if (file && !file.name) {
		return;
	}

	const [currentView, setCurrentView] = useState<"Output" | "Editor">(
		"Output",
	);

	const [editorFilePath, setEditorFilePath] = useState<string | null>(null)

	async function StartParse() {
		try{
		const payload = {
			session_id: sessionID,
			filename: file!.name
		}

		const response = await fetch("/api/start-parse", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		
		if (!response.ok){
			const data = await response.json()
			throw new Error(JSON.stringify(data.detail))
		}else{
			const data:{message:string, output_file:string} = await response.json()
			setEditorFilePath(data.output_file)
		}
	}
	catch (err:any){
		console.error("Request failed:", err.message);
	}
	}

	return (
		<div className="bg-gray-800 p-5">
			<ChoiceButton
				choices={["Output", "Editor"]}
				onSelect={(choice: "Output" | "Editor") =>
					setCurrentView(choice)
				}
				selected={currentView}
				className="w-fit mx-auto"
			></ChoiceButton>
			<ViewFile file={file}></ViewFile>
			<button onClick={() => {console.log("hi");StartParse()}}>Start Parse</button>
			{editorFilePath}
		</div>
	);
}
