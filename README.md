# Syncrodes

AI-powered DevOps platform that predicts, investigates, and helps resolve system incidents from a single dashboard.

## Stack

- Frontend: React / Next.js + Tailwind CSS
- Backend: FastAPI
- AI: LangGraph + OpenAI
- Protocol: MCP (Model Context Protocol)
- Database & Auth: Supabase (PostgreSQL + Auth, pgvector)
- Automation: n8n
- Deployment: AWS (App Runner, S3/CloudFront, CloudWatch, IAM)

## Prerequisites

- Python 3.11+
- Node 20+
- A Supabase project
- Docker (optional, for docker-compose)

## Setup

```
git clone <repo-url>
cd syncrodes

# Backend
cd backend
cp .env.example .env
# fill in real values in .env
pip install -r requirements.txt --break-system-packages

# Frontend
cd ../frontend
cp .env.local.example .env.local
# fill in real values in .env.local
npm install
```

## Running locally

Without Docker:

```
# terminal 1
cd backend && uvicorn app.main:app --reload

# terminal 2
cd frontend && npm run dev
```

With Docker:

```
docker-compose up --build
```

## Project structure

See the build guides (dev-a-full-guide.html, dev-b-full-guide.html) for the complete file tree and phase-by-phase build order.

## Team

| Owner | Area |
|---|---|
| Dev A | Platform and Data -- FastAPI structure, Supabase schema, auth, n8n, notifications, security, deployment |
| Dev B | AI and Orchestration -- LangGraph orchestrator, MCP connectors, LLM prompting, embeddings, prediction and recommendation engines |

## License

See [LICENSE](./LICENSE).