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
	const [isDeleted, setIsDeleted] = useState(false);
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

	function handleMouseDown(e: React.MouseEvent<HTMLTextAreaElement>) {
		// Only trigger drag on Left Click (button 0) + Shift key
		if (e.button !== 0 || !e.shiftKey) return;

		e.preventDefault(); // Prevents text selection while dragging
		const startX = e.clientX;
		const startY = e.clientY;
		const startLeft = position.left;
		const startTop = position.top;

		function onMouseMove(moveEvent: MouseEvent) {
			// Divide pixel delta by `scale` to keep coordinates in original image space
			const dx = (moveEvent.clientX - startX) / scale;
			const dy = (moveEvent.clientY - startY) / scale;

			const newLeft = startLeft + dx;
			const newTop = startTop + dy;
			const newRight = newLeft + position.width;
			const newBottom = newTop + position.height;

			// Mutate block directly (matching your updateText pattern)
			block.l = newLeft;
			block.t = newTop;
			block.r = newRight;
			block.b = newBottom;

			// Trigger re-render
			setPosition((prev) => ({
				...prev,
				left: newLeft,
				top: newTop,
				right: newRight,
				bottom: newBottom,
			}));
		}

		function onMouseUp() {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		}

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	}

	function handleContextMenu(e: React.MouseEvent<HTMLTextAreaElement>) {
        
		e.preventDefault();
		if (window.confirm("Delete this text box?")) {
			block.deleted = true
			setIsDeleted(true);
		}
	}
    if (isDeleted){
        return null
    }
	return (
		<textarea
			onChange={(e) => updateText(e)}
			onMouseDown={handleMouseDown}
			onContextMenu={handleContextMenu}
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
				left: `${(position.left * 100) / imageWidth}%`,
				top: `${(position.top * 100) / imageHeight}%`,
				width: `${position.width * scale}px`,
				height: `${position.height * scale}px`,
				fontSize: fontSize,
			}}
		/>
	);
}
