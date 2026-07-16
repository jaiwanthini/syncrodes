# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.routers import orchestrator, rca, predictions

app = FastAPI(title="Syncrodes API", description="AI-powered DevOps platform API")

# Include routers
app.include_router(orchestrator.router)
app.include_router(rca.router)
app.include_router(predictions.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Syncrodes API is running."}