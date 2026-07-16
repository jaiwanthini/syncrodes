# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.routers import orchestrator

app = FastAPI(title="Syncrodes API", description="AI-powered DevOps platform API")

# Include routers
app.include_router(orchestrator.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Syncrodes API is running."}