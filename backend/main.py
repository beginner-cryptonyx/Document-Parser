from typing import Annotated

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])


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
