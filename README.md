# Syncrodes

![CI](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
<!-- ^ Replace YOUR_ORG/YOUR_REPO with your actual GitHub repository path -->

AI-powered DevOps platform that predicts, investigates, and helps resolve system incidents from a single dashboard.

## Stack

| Layer       | Technology                                           |
| ----------- | ---------------------------------------------------- |
| Frontend    | React / Next.js 15 + Tailwind CSS                    |
| Backend     | FastAPI + LangGraph                                  |
| AI          | GROQ API                                             |
| Database    | Supabase (PostgreSQL + pgvector)                      |
| Auth        | Supabase Auth                                         |
| Protocol    | MCP (Model Context Protocol)                          |
| Automation  | n8n (external)                                        |

## Deployment

| Component | Platform     | Connection                         |
| --------- | ------------ | ---------------------------------- |
| Frontend  | Vercel       | Automatic via GitHub integration   |
| Backend   | Railway      | Automatic via GitHub integration   |

---

## CI Pipeline

The project uses **GitHub Actions** for continuous integration. The pipeline is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Trigger

- **Push** to `main` branch
- **Pull Request** targeting `main` branch

### Pipeline Stages

| #  | Stage                          | Description                                                                     |
| -- | ------------------------------ | ------------------------------------------------------------------------------- |
| 1  | **Checkout**                   | Clones the repository                                                           |
| 2  | **Setup Node.js 20**           | Installs Node.js with `npm` cache from `package-lock.json`                      |
| 3  | **Setup Python 3.11**          | Installs Python with `pip` cache from `requirements.txt`                        |
| 4  | **Install frontend deps**      | `npm ci` -- clean, reproducible install                                         |
| 5  | **Install backend deps**       | `pip install -r requirements.txt`                                               |
| 6  | **Frontend lint**              | Runs `next lint` only if ESLint config exists (otherwise skipped)               |
| 7  | **Build Next.js frontend**     | `npm run build` -- compiles the application                                     |
| 8  | **Verify backend syntax**      | `py_compile` checks syntax (no env vars needed)                                 |
| 9  | **Backend tests (if present)** | Detects test scripts and reports status (skipped in CI, needs external infra)   |
| 10 | **Build backend Docker image** | `docker build` using `backend/Dockerfile`                                       |
| 11 | **Build frontend Docker image**| `docker build` using `frontend/Dockerfile`                                      |
| 12 | **Verify Docker images**       | Confirms both images were created successfully                                  |

### How Automatic Deployment Works

- **Vercel** (frontend) and **Railway** (backend) are connected directly to the GitHub repository.
- When code is pushed to `main`, each platform detects the changes and deploys automatically.
- The GitHub Actions CI workflow **only validates** the project -- it does **not** deploy.
- This means deployments never happen unless CI passes first.

---

## Prerequisites

- Python 3.11+
- Node 20+
- A Supabase project
- GROQ API key
- Docker (optional, for Docker Compose)

## Setup

```
git clone <repo-url>
cd syncrodes

# Backend
cd backend
cp .env.example .env
# fill in real values in .env
pip install -r requirements.txt

# Frontend
cd ../frontend
cp .env.local.example .env.local
# fill in real values in .env.local
npm install
```

## Running locally

### Without Docker

```
# terminal 1
cd backend && uvicorn app.main:app --reload

# terminal 2
cd frontend && npm run dev
```

### With Docker

```
docker compose up --build
```

---

## Project Structure

```
.github/workflows/
  ci.yml                  # CI pipeline definition
backend/
  app/                    # FastAPI application code
    core/                 # Config, auth, Supabase client
    engines/              # Predictive, RCA, memory engines
    mcp/                  # MCP connectors (CloudWatch, GitHub, Jira, Slack, K8s, Jenkins)
    orchestrator/         # LangGraph orchestrator graph & nodes
    routers/              # API route handlers
    webhooks/             # n8n webhook endpoints
  Dockerfile
  requirements.txt
frontend/
  app/                    # Next.js App Router pages
  components/             # React components
  lib/                    # API clients, Supabase helpers
  types/                  # TypeScript type definitions
  Dockerfile
  package.json
docker-compose.yml        # Local development with Docker
```

## GitHub Secrets Required

The CI pipeline uses these optional secrets for build-time environment variables:

| Secret                        | Purpose                                        | Required? |
| ----------------------------- | ---------------------------------------------- | --------- |
| `NEXT_PUBLIC_SUPABASE_URL`    | Supabase project URL (build-time fallback)      | No        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (build-time fallback)        | No        |
| `NEXT_PUBLIC_API_URL`         | Backend API URL (build-time fallback)            | No        |

The pipeline provides safe placeholder values when secrets are not set, so CI will pass even without them.

## License

See [LICENSE](./LICENSE).