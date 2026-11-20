from pathlib import Path
import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import package

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])
BASE_DIR = Path("./backend/upload")



@app.get("/api/health")
def health_check():
    return {"status": "running"}


@app.post("/api/upload-file")
async def upload_file(file: UploadFile = File(...), session_id: str|None = None):
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