import { useEffect, useState } from "react";

interface ViewFileProps {
	file: File|null;
}

export default function ViewFile({ file }: ViewFileProps) {
	if (file && !file.name) {
		return;
	}

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!file) {
			setPreviewUrl(null);
			return;
		}

		// Create a temporary local URL for the File object
		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);

		// Clean up memory when the file changes or component unmounts
		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [file]);

	return (
		<div>
			{file && previewUrl && (
				<div>
					{/* Render Image */}
					{file.type.startsWith("image/") && (
						<img
							src={previewUrl}
							alt={file.name}
							style={{
								maxWidth: "100%",
								maxHeight: "600px",
								objectFit: "contain",
							}}
						/>
					)}

					{/* Render PDF */}
					{file.type === "application/pdf" && (
						<iframe
							src={previewUrl}
							title={file.name}
							style={{
								width: "100%",
								height: "600px",
								border: "none",
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
}
