import React, { useState } from "react";

interface UploadResult {
	filename: string;
	content_type: string;
	file_size: any;
}

export default function UploadFile() {
	const [selectedFile, setSelectedFiles] = useState<File | null>(null);
	const [returnData, setReturnData] = useState<UploadResult | null>(null);
	const [status, setStatus] = useState<
		"idle" | "uploading" | "success" | "error" | "selected"
	>("idle");

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files && files.length > 0) {
			setSelectedFiles(files[0]);
			setStatus("selected");
		}
	}

	async function handleUpload() {
		// if there is no file then we do nothing
		if (!selectedFile) {
			return;
		}

		// if file is there we set status   to uploading
		setStatus("uploading");

		const formData = new FormData();
		formData.append("file", selectedFile);

		// try to contact API
		try {
			console.log("starting upload");

			const res = await fetch("api/upload-file", {
				method: "POST",
				body: formData,
			});

			console.log("Finished attempt of upload");

			if (!res.ok) {
				setStatus("error");
			} else {
				setStatus("success");
				const data: UploadResult = await res.json();
				setReturnData(data);
			}
		} catch (error) {
			console.error("Error uploading file:", error);
			setStatus("error");
		}
	}

	return (
		<div>
			<input type="file" onChange={handleFileChange} />
			{selectedFile && (
				<div>
					<p>
						Selected: {selectedFile.name} (
						{(selectedFile.size / 1024).toFixed(2)} KB)
					</p>
					<button
						onClick={handleUpload}
						disabled={status === "uploading"}
					>
						{status === "uploading"
							? "Uploading..."
							: status === "error"
								? "Failed Upload"
								: "Upload"}
					</button>
				</div>
			)}
			{status === "success" && returnData && (
				<div>
					<p>File uploaded successfully!</p>
					<ul>
						<li>Filename: {returnData.filename}</li>
						<li>Content Type: {returnData.content_type}</li>
						<li>Size: {returnData.file_size} bytes</li>
					</ul>
				</div>
			)}
			{status === "error" && <p>Failed to upload file.</p>}
		</div>
	);
}
