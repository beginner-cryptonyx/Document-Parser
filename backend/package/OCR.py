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

indian_langs = [
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
]


ocr_options = TesseractCliOcrOptions(
    lang=indian_langs,
)

ocr_options.force_full_page_ocr = True


pipeline_options = PdfPipelineOptions()
pipeline_options.do_ocr = True
pipeline_options.ocr_options = ocr_options

pipeline_options.do_table_structure = True
pipeline_options.table_structure_options = TableStructureOptions(
    mode=TableFormerMode.ACCURATE
)
pipeline_options.do_formula_enrichment = True

pipeline_options.generate_picture_images = True
pipeline_options.images_scale = 2.0

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options),
        InputFormat.IMAGE: ImageFormatOption(pipeline_options=pipeline_options),
    }
)

result = converter.convert(Path("./backend/package/test/test1.jpg"))
result.document.save_as_json("output.json")
