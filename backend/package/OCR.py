from pathlib import Path
import json
from docling.document_converter import DocumentConverter
from docling.document_converter import (
    DocumentConverter,
    PdfFormatOption,
    ImageFormatOption,
)
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    TableFormerMode,
    TesseractCliOcrOptions,
    TableStructureOptions,
)


class OCR:

    def __init__(
        self,
        lang_list: list[str] | None = [
            "eng",
            "hin",
            "mar",
            "ben",
            "tam",
            "tel",
            "kan",
            "mal",
            "guj",
            "pan",
            "ori",
            "asm",
        ],
        detect_table_structure: bool = True,
        detect_formula: bool = True,
    ):

        if not lang_list:
            lang_list = ["eng"]

        for lang in lang_list:
            if lang not in [
                "eng",
                "hin",
                "mar",
                "ben",
                "tam",
                "tel",
                "kan",
                "mal",
                "guj",
                "pan",
                "ori",
                "asm",
            ]:
                raise ValueError(f"Invalid language code: {lang}")

        self.indian_langs = lang_list

        self.ocr_options = TesseractCliOcrOptions(
            lang=self.indian_langs,
        )

        self.ocr_options.force_full_page_ocr = True

        self.pipeline_options = PdfPipelineOptions()
        self.pipeline_options.do_ocr = True
        self.pipeline_options.ocr_options = self.ocr_options

        self.pipeline_options.do_table_structure = detect_table_structure
        self.pipeline_options.table_structure_options = TableStructureOptions(
            mode=TableFormerMode.ACCURATE
        )
        self.pipeline_options.do_formula_enrichment = detect_formula

        self.pipeline_options.generate_picture_images = True
        self.pipeline_options.images_scale = 2.0

        self.converter = DocumentConverter(
            format_options={
                InputFormat.PDF: PdfFormatOption(
                    pipeline_options=self.pipeline_options
                ),
                InputFormat.IMAGE: ImageFormatOption(
                    pipeline_options=self.pipeline_options
                ),
            }
        )

    def convert_document(self, file_path: str, output_json_path: str):
        result = self.converter.convert(Path(file_path))
        doc = result.document

        for item, _ in doc.iterate_items():
            for prov in getattr(item, "prov", []):
                page_h = doc.pages[prov.page_no].size.height
                bbox = prov.bbox.to_top_left_origin(page_h)
                bbox.l, bbox.t, bbox.r, bbox.b = (
                    int(round(bbox.l)),
                    int(round(bbox.t)),
                    int(round(bbox.r)),
                    int(round(bbox.b)),
                )
                prov.bbox = bbox

        doc.save_as_json(output_json_path)


if __name__ == "__main__":
    img_path = Path(__file__).parent / "test/test1.jpg"
    json_path = Path(__file__).parent / "test/output.json"

    ocr = OCR()
    ocr.convert_document(str(img_path), str(json_path))
