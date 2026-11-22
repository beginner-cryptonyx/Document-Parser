import { useEffect, useRef, useState } from "react";
import ViewFile from "./ViewFile";
import { cn, urlToFile } from "../lib/utils";
import type { Block } from "../types";

interface EditorProps {
	// filename: string;
	sessionID: string;
	blocks: Block[];
}

interface FileData {
	filename: string;
	height: number;
	width: number;
}

export default function Editor({ sessionID, blocks }: EditorProps) {
	const [file, setFile] = useState<File | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const [fileData, setFileData] = useState<FileData | null>(null);

	async function GetJsonData() {
		try {
			const response = await fetch(
				`http://localhost:8000/uploads/${sessionID}/processed_image.jpg`,
			);

			if (!response.ok) {
				throw new Error(`HTTP Error! Stats: ${response.status}`);
			}

			const data = await response.json();

			setFileData({
				filename: data["origin"]["filename"],
				height: data["pages"]["1"]["size"]["height"],
				width: data["pages"]["1"]["size"]["width"],
			});
		} catch (err) {
			console.error("Failed to load JSON: ", err);
		}
	}
	// useEffect(() => {
	// 	const imageUrl = ;

	// 	urlToFile(imageUrl, "processed_image.jpg")
	// 		.then((convertedFile) => setFile(convertedFile))
	// 		.catch((err) =>
	// 			console.error("Error converting URL to File:", err),
	// 		);
	// }, [sessionID]);

	return (
		<div
			className={`relative w-full h-[100vw] bg-[url(http://localhost:8000/uploads/${sessionID}/processed_image.jpg)] bg-cover`}
		>
			{/* <img
				src={``}
				alt=""
				draggable={false}
				className="inset-0 h-full w-full"
			/> */}
			o
			{/* {blocks.map((block) => {
				const lines = Math.max(1, block.text.split("\n").length);
				const edited = block.text !== block.original;
				return (
					<textarea
						key={block.id}
						value={block.text}
						className={cn(
							"absolute resize-none overflow-hidden rounded-sm border px-0.5 leading-tight",
							"bg-white/60 focus:z-10 focus:overflow-auto focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
							edited && "border-green-500",
						)}
						style={{
							left: `${block.x * 100}%`,
							top: `${block.y * 100}%`,
							width: `${block.w * 100}%`,
							height: `${block.h * 100}%`,
						}}
					></textarea>
				);
			})} */}
		</div>
	);
}
