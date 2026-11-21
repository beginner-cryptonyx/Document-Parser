import { useEffect, useState } from "react";
import ViewFile from "./ViewFile";
import { urlToFile } from "../lib/utils";

interface EditorProps {
	// filename: string;
	sessionID: string;
}

export default function Editor({ sessionID }: EditorProps) {
	const [file, setFile] = useState<File | null>(null);

	useEffect(() => {
		const imageUrl = `http://localhost:8000/uploads/${sessionID}/processed_image.jpg`;

		urlToFile(imageUrl, "processed_image.jpg")
			.then((convertedFile) => setFile(convertedFile))
			.catch((err) =>
				console.error("Error converting URL to File:", err),
			);
	}, [sessionID]);

	return (
		<div>
            loading file
			<ViewFile file={file}></ViewFile>
		</div>
	);
}
