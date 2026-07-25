# Syncrodes

> **AI-Powered DevOps Incident Management Platform**

Syncrodes is an intelligent DevOps platform that predicts, analyzes, and helps resolve production incidents from a single dashboard. It combines **FastAPI**, **Next.js**, **LangGraph**, **Supabase**, and **LLMs** to automate root cause analysis, incident memory, and AI-assisted troubleshooting.

![CI](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml/badge.svg)

---

# Features

- 🤖 AI-powered Root Cause Analysis (RCA)
- 📊 Incident Monitoring Dashboard
- 🧠 Incident Memory using Vector Embeddings
- 🔍 Semantic Search for Previous Incidents
- ⚡ LangGraph-based AI Agent Workflow
- 🔐 Secure Authentication with Supabase
- 📈 Predictive Incident Analysis
- 📝 AI-generated Incident Summaries
- 🔄 Dockerized Development & Deployment
- 🚀 Automatic CI with GitHub Actions

---

# Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15, React, Tailwind CSS |
| Backend | FastAPI, LangGraph |
| AI | Groq API |
| Database | Supabase PostgreSQL + pgvector |
| Authentication | Supabase Auth |
| Vector Search | Sentence Transformers + pgvector |
| Deployment | Vercel (Frontend), Render (Backend) |
| CI/CD | GitHub Actions |
| Containerization | Docker & Docker Compose |

---

# System Architecture

```text
                +---------------------+
                |     Next.js UI      |
                +----------+----------+
                           |
                     REST API Calls
                           |
                +----------v----------+
                |      FastAPI        |
                +----------+----------+
                           |
        +------------------+------------------+
        |                  |                  |
        |                  |                  |
   LangGraph         Memory Engine      Supabase Auth
        |                  |
        |                  |
        +---------+--------+
                  |
         Supabase PostgreSQL
            + pgvector DB
                  |
             Previous Incidents
```

---

# Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase |

Deployment is automatically triggered whenever changes are pushed to the **main** branch.

---

# Continuous Integration

GitHub Actions automatically performs:

- Repository Checkout
- Node.js Setup
- Python Setup
- Install Dependencies
- Frontend Build
- Backend Validation
- Docker Image Build
- Docker Verification

The workflow ensures that every commit builds successfully before deployment.

---

# Project Structure

```text
syncrodes/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── memory/
│   │   ├── orchestrator/
│   │   ├── engines/
│   │   ├── webhooks/
│   │   └── mcp/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<username>/syncrodes.git

cd syncrodes
```

---

## Backend Setup

```bash
cd backend

python -m venv .venv

# Linux / macOS
source .venv/bin/activate

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

---

# Environment Variables

### Backend (.env)

```env
SUPABASE_URL=

SUPABASE_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=

JWT_SECRET=
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_API_URL=
```

---

# Running Locally

## Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Runs on:

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend

npm run dev
```

Runs on:

```
http://localhost:3000
```

---

# Running with Docker

Build and start both services:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

---

# API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User Authentication |
| POST | `/signup` | User Registration |
| GET | `/incidents` | Fetch Incidents |
| POST | `/incident` | Create Incident |
| POST | `/predict` | Predict Incident |
| POST | `/rca` | Root Cause Analysis |
| POST | `/memory/search` | Search Previous Incidents |

---

# GitHub Actions

The CI workflow automatically:

- Builds the frontend
- Validates backend code
- Builds Docker images
- Verifies successful image creation

No deployment occurs unless the project builds successfully.

---

# Screenshots

Place screenshots inside a `docs/` folder.

```text
docs/
├── dashboard.png
├── login.png
└── incident.png
```

Example:

```markdown
## Dashboard

![Dashboard](docs/dashboard.png)
```

---

# Future Enhancements

- Slack Notifications
- Microsoft Teams Integration
- Kubernetes Monitoring
- AWS CloudWatch Integration
- Jenkins Integration
- AI Chat Assistant
- Predictive Failure Detection
- Real-time Incident Alerts

---

# Contributing

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# License

This project is licensed under the **MIT License**.

For more information, see the [LICENSE](LICENSE) file.
