from pathlib import Path
from docling.datamodel.backend_options import DeclarativeBackendOptions
from docling.datamodel.base_models import InputFormat
from docling.document_converter import DocumentConverter, DoclingJSONFormatOption

converter = DocumentConverter(
    format_options={
        InputFormat.JSON_DOCLING: DoclingJSONFormatOption(
            backend_options=DeclarativeBackendOptions(enable_local_fetch=True, kind="declarative", enable_remote_fetch=True)
        )
    }
)
doc = converter.convert(Path("./backend/package/test/output.json"))
doc.document.save_as_markdown(Path("./backend/package/test/output.md"))
