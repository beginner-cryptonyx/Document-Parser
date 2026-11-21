from pathlib import Path
import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from package.OCR import OCR
from package.ImageProcessing import ImageProcessor
from request_types import StartParseRequest
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])
BASE_DIR = Path("./backend/upload")

app.mount("/uploads", StaticFiles(directory="./backend/upload"), name="uploads")


@app.get("/api/health")
def health_check():
    return {"status": "running"}


@app.post("/api/upload-file")
async def upload_file(file: UploadFile = File(...), session_id: str | None = None):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    filename = Path(file.filename).name
    if not filename or filename in {".", ".."}:
        raise HTTPException(status_code=400, detail="Invalid filename")

    base_path = BASE_DIR.resolve()
    session_path = (BASE_DIR / session_id).resolve()
    if base_path not in session_path.parents:
        raise HTTPException(status_code=400, detail="Invalid session ID")

    try:
        session_path.mkdir(parents=True, exist_ok=True)
        contents = await file.read()
        destination = session_path / filename
        destination.write_bytes(contents)
    except OSError as exc:
        raise HTTPException(status_code=500, detail="Unable to save file") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unable to process file") from exc

    file_size = len(contents)

    return {
        "filename": filename,
        "content_type": file.content_type,
        "file_size": file_size,
    }


@app.get("/api/start-session")
def start_session():
    session_id = str(uuid.uuid4())
    session_path = BASE_DIR / session_id
    session_path.mkdir(parents=True, exist_ok=True)
    return {"SessionID": str(session_id)}


@app.post("/api/start-parse")
def start_parse(ParseParams: StartParseRequest):
    if not ParseParams.session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    converter = OCR(
        detect_formula=ParseParams.detect_formula,
        detect_table_structure=ParseParams.detect_table_structure,
        lang_list=ParseParams.lang_list,
    )

    session_path = BASE_DIR / ParseParams.session_id

    input_file_path = session_path / ParseParams.filename
    output_file_path = session_path / f"{Path(ParseParams.filename).stem}_output.json"

    if not session_path.exists() or not session_path.is_dir():
        raise HTTPException(status_code=400, detail="Invalid session ID")

    try:
        converter.convert_document(
            file_path=str(input_file_path), output_json_path=str(output_file_path)
        )

        image_processor = ImageProcessor(
            sessionID=ParseParams.session_id,
            filename=ParseParams.filename,
            folder_path=session_path,
            json_path=output_file_path,
        )
        image_processor.process_image()

        return {
            "message": "Document conversion successful",
            "output_file": str(output_file_path),
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail="Error during document conversion"
        ) from exc
