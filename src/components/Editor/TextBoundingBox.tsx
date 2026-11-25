import React, { useState } from "react";
import type { Block } from "./types";
import {
	toPercentStyle,
	getEdgesToResize,
	isResizing,
	setAppropriateCursorStyle,
	moveBox,
	resizeBox,
	calculateFontSize,
} from "./Geometry";

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
		top: block.top,
		bottom: block.bottom,
		left: block.left,
		right: block.right,
		height: block.bottom - block.top,
		width: block.right - block.left,
	});

	const [text, setText] = useState(block.text);
	const [isDeleted, setIsDeleted] = useState(false);
	const fontSize = calculateFontSize(block, block.text.length, scale);

	function updateText(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const newText = e.target.value;
		setText(newText);
		block.text = newText;
	}

	function handleMouseDown(e: React.MouseEvent<HTMLTextAreaElement>) {
		// Only trigger drag on Left Click (button 0) + Shift key
		if (e.button !== 0) return;

		const edges = getEdgesToResize(
			e,
			e.currentTarget.getBoundingClientRect(),
		);

		if (!isResizing(edges) && !e.shiftKey) return; // no resize + no shift = do nothing

		e.preventDefault(); // Prevents text selection while dragging
		const startX = e.clientX;
		const startY = e.clientY;
		const startPos = { ...position };

		function onMouseMove(moveEvent: MouseEvent) {
			// Divide pixel delta by `scale` to keep coordinates in original image space
			const dx = (moveEvent.clientX - startX) / scale;
			const dy = (moveEvent.clientY - startY) / scale;

			let { left, top, right, bottom } = startPos;

			if (isResizing(edges)) {
				const resized = resizeBox(
					{ left, top, right, bottom },
					edges,
					dx,
					dy,
				);
				left = resized.left;
				right = resized.right;
				top = resized.top;
				bottom = resized.bottom;
			} else {
				const moved = moveBox({ left, top, right, bottom }, dx, dy);
				left = moved.left;
				right = moved.right;
				top = moved.top;
				bottom = moved.bottom;
			}

			const width = right - left;
			const height = bottom - top;

			// Mutate block directly (matching your updateText pattern)
			block.left = left;
			block.top = top;
			block.right = right;
			block.bottom = bottom;

			// Trigger re-render
			setPosition({ left, top, right, bottom, width, height });
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
			block.deleted = true;
			setIsDeleted(true);
		}
	}
	if (isDeleted) {
		return null;
	}

	return (
		<textarea
			onChange={(e) => updateText(e)}
			onMouseDown={handleMouseDown}
			onMouseLeave={(e) => (e.currentTarget.style.cursor = "text")}
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
				...toPercentStyle(position, imageWidth, imageHeight),
				fontSize: `${fontSize}px`,
				lineHeight: 1,
			}}
		/>
	);
}
