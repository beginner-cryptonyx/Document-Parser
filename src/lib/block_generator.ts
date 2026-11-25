import type { Block } from "../components/Editor/types";

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
            left: bbox.l,
            top: bbox.t,
            right: bbox.r,
            bottom: bbox.b,
            deleted: false,
        });
    }

    return blocks;
}