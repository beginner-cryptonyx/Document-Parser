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
            id: text.self_ref,
            text: text_element,
            original: originalText,
            l: bbox.l,
            t: bbox.t,
            r: bbox.r,
            b: bbox.b,
            charspan: originalText.length
        });
    }

    return blocks;
}