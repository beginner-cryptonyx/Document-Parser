import { useEffect, useRef, useState } from "react";
import type { Block } from "../types";

interface EditorProps {
	imageUrl: string;
	pageWidth: number;
	pageHeight: number;
	blocks: Block[];
    onEditBlock: (id:string, newText:string) => void
}

export default function Editor({
	imageUrl,
	pageHeight,
	pageWidth,
	blocks,
    onEditBlock
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
				// const lines = Math.max(1, b.text.split("\n").length);
				const fontPx = Math.max(
					12,
					// (((b.b-b.t)  * scale)) * 0.75,
					// custom formula
					Math.sqrt(
						((b.r - b.l) * (b.b - b.t) * scale * scale) /
							Math.max(1, b.charspan*1.1),
					),
				);
				const edited = b.text !== b.original;
				// const lowConf = (b.confidence ?? 1) < 0.8;

				return (
					<textarea
                        onChange={(e) => onEditBlock(b.id, e.target.value)}
						key={b.id}
						value={b.text}
						// onChange={(e) => onTextChange(b.id, e.target.value)}
						spellCheck={false}
						className={[
							"absolute resize-none overflow-hidden rounded-sm border px-0.5 leading-tight",
							"bg-white/60 focus:z-10 focus:overflow-auto focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
							edited ? "border-green-500" : "",
							// : lowConf
							// 	? "border-amber-500"
							// 	: "border-sky-300",
						].join(" ")}
						style={{
							left: `${(b.l * 100) / pageWidth}%`,
							top: `${(b.t * 100) / pageHeight}%`,
							width: `${(b.r - b.l) * scale}px`,
							height: `${(b.b - b.t) * scale}px`,
							fontSize: fontPx,
						}}
					/>
				);
			})}
		</div>
	);
}
