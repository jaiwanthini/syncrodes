from sentence_transformers import SentenceTransformer
from app.core.supabase_client import supabase

# Load the embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def _embed(text: str) -> list[float]:
    return model.encode(text).tolist()


def store_incident_memory(incident_id: str, summary: str, resolution: str) -> None:
    embedding = _embed(f"{summary}\n{resolution}")
    supabase.table("ai_memory").insert({
        "incident_id": incident_id,
        "summary": summary,
        "resolution": resolution,
        "embedding": embedding,
    }).execute()


def find_similar_incidents(description: str, match_count: int = 5) -> list[dict]:
    embedding = _embed(description)
    res = supabase.rpc(
        "match_ai_memory",
        {
            "query_embedding": embedding,
            "match_count": match_count,
        },
    ).execute()
    return res.data or []