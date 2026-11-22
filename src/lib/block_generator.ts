import type { Block } from "../types";

export default function generateBlocksFromOCR(ocrData: any): Block[] {
    const blocks: Block[] = [];
    const texts = ocrData.texts;
    console.log("OCR Data:", ocrData);
    console.log("Extracted Texts:", texts);

    for (const text of texts) {
        const bbox = text.prov[0].bbox;
        console.log("Bounding Box:", bbox);
        const originalText = text.orig;
        const text_element = text.text;

        blocks.push({
            id: Math.random().toString(36).substring(2, 15), 
            text: text_element,
            original: originalText,
            x: bbox.l,
            y: bbox.t,
            w: bbox.r - bbox.l,
            h: bbox.b - bbox.t,
            // confidence: text.confidence,
        });
    }

    return blocks;
}