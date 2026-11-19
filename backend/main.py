from fastapi import FastAPI
import app

app = FastAPI()


@app.get("/api/health")
def health_check():
    return{
        "status": "running"
    }