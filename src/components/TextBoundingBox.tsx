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

	function getResizeEdges(e: React.MouseEvent<HTMLTextAreaElement>) {
		const rect = e.currentTarget.getBoundingClientRect();
		const threshold = 10; //so basically 10 px arnd the border

		return {
			top: e.clientY - rect.top <= threshold,
			bottom: rect.bottom - e.clientY <= threshold,
			left: e.clientX - rect.left <= threshold,
			right: rect.right - e.clientX <= threshold,
		};
	}

	function handleMouseDown(e: React.MouseEvent<HTMLTextAreaElement>) {
		// Only trigger drag on Left Click (button 0) + Shift key
		if (e.button !== 0) return;

		const edges = getResizeEdges(e);
		const isResizing =
			edges.top || edges.bottom || edges.left || edges.right;

		if (!isResizing && !e.shiftKey) return; // no resize + no shift = do nothing

		e.preventDefault(); // Prevents text selection while dragging
		const startX = e.clientX;
		const startY = e.clientY;
		const startPos = { ...position };
		const MIN_SIZE = 16;

		function onMouseMove(moveEvent: MouseEvent) {
			// Divide pixel delta by `scale` to keep coordinates in original image space
			const dx = (moveEvent.clientX - startX) / scale;
			const dy = (moveEvent.clientY - startY) / scale;

			let { left, top, right, bottom } = startPos;

			if (isResizing) {
				if (edges.left)
					left = Math.min(startPos.left + dx, right - MIN_SIZE);
				if (edges.right)
					right = Math.max(startPos.right + dx, left + MIN_SIZE);
				if (edges.top)
					top = Math.min(startPos.top + dy, bottom - MIN_SIZE);
				if (edges.bottom)
					bottom = Math.max(startPos.bottom + dy, top + MIN_SIZE);
			} else {
				// Shift + drag in center still moves the box
				left = startPos.left + dx;
				top = startPos.top + dy;
				right = left + startPos.width;
				bottom = top + startPos.height;
			}

			const width = right - left;
			const height = bottom - top;

			// Mutate block directly (matching your updateText pattern)
			block.l = left;
			block.t = top;
			block.r = right;
			block.b = bottom;

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

	function handleHoverCursor(e: React.MouseEvent<HTMLTextAreaElement>) {
		const { top, bottom, left, right } = getResizeEdges(e);
		if ((top && left) || (bottom && right))
			e.currentTarget.style.cursor = "nwse-resize";
		else if ((top && right) || (bottom && left))
			e.currentTarget.style.cursor = "nesw-resize";
		else if (top || bottom) e.currentTarget.style.cursor = "ns-resize";
		else if (left || right) e.currentTarget.style.cursor = "ew-resize";
		else e.currentTarget.style.cursor = e.shiftKey ? "move" : "text";
	}
	return (
		<textarea
			onChange={(e) => updateText(e)}
			onMouseDown={handleMouseDown}
			onMouseMove={handleHoverCursor}
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
				left: `${(position.left * 100) / imageWidth}%`,
				top: `${(position.top * 100) / imageHeight}%`,
				width: `${position.width * scale}px`,
				height: `${position.height * scale}px`,
				fontSize: fontSize,
			}}
		/>
	);
}
