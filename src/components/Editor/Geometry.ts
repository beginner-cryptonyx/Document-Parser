import type { Box } from "./types";

export type ActiveResizeEdges = {
	topEdge: boolean;
	bottomEdge: boolean;
	leftEdge: boolean;
	rightEdge: boolean;
};

const MIN_BOX_SIZE = 16;

/**
 * Calculates the percentage style of a bounding box relative to the width and height of the image. This is used to render bounding boxes in a responsive manner, ensuring that they scale correctly with the image size.
 * @param box - BoundingBox that needs to be resized
 * @param Width - Width of the bounding box
 * @param Height - Height of the bounding box
 * @returns - Styles that will be used in order to render each bounding box
 */
export const toPercentStyle = (box: Box, Width: number, Height: number) => ({
	left: `${(box.left / Width) * 100}%`,
	top: `${(box.top / Height) * 100}%`,
	width: `${((box.right - box.left) / Width) * 100}%`,
	height: `${((box.bottom - box.top) / Height) * 100}%`,
});

/**
 * Calculates what edges of a box are being hovered over by the mouse cursor and therefore what edges need to be resized. This is used to determine what edges of a box are being hovered over by the mouse cursor and therefore what edges need to be resized.
 *
 * @param event - Object that stores users current mouse X and Y coordinates
 * @param rect - DOMRect that is used to get bounding box of a textbox
 * @param threshold - The ideal "leaway" the cursor has in order to trigger a resize
 * @returns - Which of the edges need to be resized
 */
export function getEdgesToResize(
	event: { clientX: number; clientY: number },
	rect: DOMRect,
	threshold = 8,
): ActiveResizeEdges {
	// never let edge zones eat more than a quarter of the box
	const tx = Math.min(threshold, rect.width / 4);
	const ty = Math.min(threshold, rect.height / 4);
	return {
		topEdge: event.clientY - rect.top <= ty,
		bottomEdge: rect.bottom - event.clientY <= ty,
		leftEdge: event.clientX - rect.left <= tx,
		rightEdge: rect.right - event.clientX <= tx,
	};
}

/**
 * Helper function that checks if any of the edges of a box are being resized.
 * @param event - The active resize edges
 * @returns - True if ANY edge is being resized, false otherwise
 */
export const isResizing = (event: ActiveResizeEdges) =>
	event.topEdge || event.bottomEdge || event.leftEdge || event.rightEdge;

/**
 * Calculates the cursor style based on the edges being resized and whether the shift key is pressed. This is used to provide visual feedback to the user about what action they are performing (resizing or moving).
 * @param event - The active resize edges
 * @param shift - Whether the shift key is currently pressed
 * @returns - The appropriate cursor style
 */
export function setAppropriateCursorStyle(event: ActiveResizeEdges, shift: boolean) {
	if (
		(event.topEdge && event.leftEdge) ||
		(event.bottomEdge && event.rightEdge)
	)
		return "nwse-resize";
	if (
		(event.topEdge && event.rightEdge) ||
		(event.bottomEdge && event.leftEdge)
	)
		return "nesw-resize";
	if (event.topEdge || event.bottomEdge) return "ns-resize";
	if (event.leftEdge || event.rightEdge) return "ew-resize";
	return shift ? "move" : "text";
}

/**
 * CRITICAL FUNCTION: Moves a bounding box by a specified amount in the x and y directions. This is used to reposition bounding boxes on the image.
 * @param box - The bounding box to be moved
 * @param dx - The amount to move the box in the x direction
 * @param dy - The amount to move the box in the y direction
 * @returns - The new bounding box with the updated position
 */
export function moveBox(box: Box, dx: number, dy: number): Box {
	return {
		left: box.left + dx,
		top: box.top + dy,
		right: box.right + dx,
		bottom: box.bottom + dy,
	};
}
/**
 * CRITICAL FUNCTION: Resizes a bounding box by a specified amount in the x and y directions. This is used to adjust the size of bounding boxes on the image.
 * @param box - The bounding box to be resized
 * @param edgesToResize - The edges of the box that are being resized
 * @param dx - The amount to resize the box in the x direction
 * @param dy - The amount to resize the box in the y direction
 * @returns - The new bounding box with the updated size
 */
export function resizeBox(
	box: Box,
	edgesToResize: ActiveResizeEdges,
	dx: number,
	dy: number,
): Box {
	let { left, top, right, bottom } = box;
	if (edgesToResize.leftEdge)
		left = Math.min(box.left + dx, box.right - MIN_BOX_SIZE);
	if (edgesToResize.rightEdge)
		right = Math.max(box.right + dx, box.left + MIN_BOX_SIZE);
	if (edgesToResize.topEdge)
		top = Math.min(box.top + dy, box.bottom - MIN_BOX_SIZE);
	if (edgesToResize.bottomEdge)
		bottom = Math.max(box.bottom + dy, box.top + MIN_BOX_SIZE);
	return { left, top, right, bottom };
}

/**
 * Helper function that calculates the font size for a given text length and bounding box. This is used to ensure that the text fits within the bounding box.
 * @param box - The bounding box
 * @param textLength - The length of the text
 * @param scale - The scale of the image
 * @returns - The calculated font size
 */
export function calculateFontSize(box: Box, textLength: number, scale: number) {
	const area =
		(box.right - box.left) * (box.bottom - box.top) * scale * scale;
	return Math.max(8, Math.sqrt(area / Math.max(1, textLength * 1.1)));
}
