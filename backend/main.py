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
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    contents = await file.read()

    file_size = len(contents)

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_size": file_size,
    }

@app.get("/api/start-session")
def start_session():
    session_id = str(uuid.uuid4())
    session_path = BASE_DIR / session_id
    session_path.mkdir(parents=True, exist_ok=True)
    return {"SessionID": str(session_id)}