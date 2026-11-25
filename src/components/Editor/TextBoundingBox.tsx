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
	onChange: (id: string, patch: Partial<Block>) => void;
}

export default function TextBoundingBox({
	// key,
	block,
	imageHeight,
	imageWidth,
	scale = 1,
	onChange,
}: TextBoundingBoxProps) {
	if (block.deleted) return null;

	const edited = block.text !== block.original;
	const fontSize = calculateFontSize(block, block.original.length, scale);

	const [isDeleted, setIsDeleted] = useState(false);

	function handleMouseDown(e: React.MouseEvent<HTMLTextAreaElement>) {
		if (e.button !== 0) return;

		const edges = getEdgesToResize(
			e,
			e.currentTarget.getBoundingClientRect(),
		);

		if (!isResizing(edges) && !e.shiftKey) return; // no resize + no shift = do nothing

		e.preventDefault(); // Prevents text selection while dragging
		const startX = e.clientX;
		const startY = e.clientY;
		const start = {
			left: block.left,
			top: block.top,
			right: block.right,
			bottom: block.bottom,
		};

		function onMouseMove(moveEvent: MouseEvent) {
			// Divide pixel delta by `scale` to keep coordinates in original image space
			const dx = (moveEvent.clientX - startX) / scale;
			const dy = (moveEvent.clientY - startY) / scale;

			const newBox = isResizing(edges)
				? resizeBox(start, edges, dx, dy)
				: moveBox(start, dx, dy);

			onChange(block.id, newBox);
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
	function handleMouseMove(e: React.MouseEvent<HTMLTextAreaElement>) {
		if (e.buttons) return; // a button is held down (mid-drag), leave the cursor alone

		const edges = getEdgesToResize(
			e,
			e.currentTarget.getBoundingClientRect(),
		);
		e.currentTarget.style.cursor = setAppropriateCursorStyle(
			edges,
			e.shiftKey,
		);
	}

	return (
		<textarea
			onChange={(e) => onChange(block.id, { text: e.target.value })}
			onMouseDown={handleMouseDown}
			onMouseLeave={(e) => (e.currentTarget.style.cursor = "text")}
			onContextMenu={handleContextMenu}
			onMouseMove={handleMouseMove}
			value={block.text}
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
				...toPercentStyle(block, imageWidth, imageHeight),
				fontSize: `${fontSize}px`,
				lineHeight: 1,
			}}
		/>
	);
}
