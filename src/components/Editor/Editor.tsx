import { useEffect, useRef, useState } from "react";
import type { Block } from "./types";
import TextBoundingBox from "./TextBoundingBox";

interface EditorProps {
	imageUrl: string;
	pageWidth: number;
	pageHeight: number;
	blocks: Block[];
	onEditBlock: (id: string, newText: string) => void;
}

export default function Editor({
	imageUrl,
	pageHeight,
	pageWidth,
	blocks,
}: EditorProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			setScale(entry.contentRect.width / pageWidth);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, [pageWidth]);

	return (
		<div
			ref={ref}
			className="relative "
			style={{ aspectRatio: `${pageWidth} / ${pageHeight}` }}
		>
			<img
				src={imageUrl}
				alt=""
				draggable={false}
				className="absolute inset-0 h-full w-full"
			/>
			{blocks.map((b) => {
				return (
					<TextBoundingBox
						key={b.id}
						block={b}
						scale={scale}
						imageHeight={pageHeight}
						imageWidth={pageWidth}
					></TextBoundingBox>
				);
			})}
		</div>
	);
}
