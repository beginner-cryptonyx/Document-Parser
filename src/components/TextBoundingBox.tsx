import React, { useState } from "react";
import type { Block } from "../types";

interface TextBoundingBoxProps {
	// key: string
	block: Block;
	imageWidth: number;
	imageHeight: number;
	scale: number;
}

export default function TextBoundingBox({
	// key,
	block,
	imageHeight,
	imageWidth,
	scale = 1,
}: TextBoundingBoxProps) {
	const [position, setPosition] = useState<{
		top: number;
		bottom: number;
		left: number;
		right: number;
		height: number;
		width: number;
	}>({
		top: block.t,
		bottom: block.b,
		left: block.l,
		right: block.r,
		height: block.b - block.t,
		width: block.r - block.l,
	});

	const [text, setText] = useState(block.text);
	const fontSize = Math.max(
		12,
		Math.sqrt(
			((block.r - block.l) * (block.b - block.t) * scale * scale) /
				Math.max(1, block.charspan * 1.1),
		),
	);

	function updateText(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const newText = e.target.value;
		setText(newText);
		block.text = newText;
		block.charspan = newText.length;
	}

	return (
		<textarea
			onChange={(e) => updateText(e)}
			// key={}
			value={text}
			spellCheck={false}
			className={[
				"absolute resize-none overflow-hidden rounded-sm border px-0.5 leading-tight",
				"bg-white/60 focus:z-10 focus:overflow-auto focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
				true ? "border-green-500" : "",
				// : lowConf
				// 	? "border-amber-500"
				// 	: "border-sky-300",
			].join(" ")}
			style={{
				left: `${(block.l * 100) / imageWidth}%`,
				top: `${(block.t * 100) / imageHeight}%`,
				width: `${(block.r - block.l) * scale}px`,
				height: `${(block.b - block.t) * scale}px`,
				fontSize: fontSize,
			}}
		/>
	);
}
