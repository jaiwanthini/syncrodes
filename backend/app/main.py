# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.routers import orchestrator, rca, predictions
from app.routers import memory
from app.routers import recommendations
from app.routers import reports
from app.routers import timeline
from app.routers import notifications
from app.routers import incidents
from app.webhooks import n8n

app = FastAPI(title="Syncrodes API", description="AI-powered DevOps platform API")

# Include routers
app.include_router(orchestrator.router)
app.include_router(rca.router)
app.include_router(predictions.router)
app.include_router(memory.router)
app.include_router(recommendations.router) 
app.include_router(reports.router) 
app.include_router(timeline.router)
app.include_router(notifications.router)
app.include_router(incidents.router)
app.include_router(n8n.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Syncrodes API is running."}

