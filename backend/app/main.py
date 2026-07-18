# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.routers import orchestrator, rca, predictions
from app.routers import memory

app = FastAPI(title="Syncrodes API", description="AI-powered DevOps platform API")

# Include routers
app.include_router(orchestrator.router)
app.include_router(rca.router)
app.include_router(predictions.router)
app.include_router(memory.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Syncrodes API is running."}