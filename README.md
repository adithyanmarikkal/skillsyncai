# 🚀 SkillSync AI – Resume to Job Match & Career Gap Analyzer

SkillSync AI is an AI-powered system that analyzes a user's resume against a target job description to provide intelligent skill-gap feedback and a personalized learning roadmap.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 Resume Parsing | Supports PDF uploads |
| 🧠 Job Description Understanding | Extracts key skills & requirements |
| 📊 AI Match Scoring | Calculates a semantic job-fit score |
| ❌ Gap Detection | Identifies missing skills & experience gaps |
| 🗺️ Upskilling Roadmap | Generates a personalized learning path |
| 🔐 Authentication | JWT-based login & protected routes |

---

## 🏗️ Architecture Overview

```
User (Browser)
      ↓
React Frontend  ──► FastAPI Backend  ──► PostgreSQL DB
                         ↓
                  Gemini AI (Embeddings + Roadmap)
                         ↓
                    Qdrant Vector DB
```

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Vector DB | Qdrant |
| AI / LLM | Google Gemini |
| Auth | JWT (python-jose + bcrypt) |
| Containerization | Docker + Docker Compose |

---

## 📂 Project Structure

```
skillsyncai/
├── docker-compose.yml          # Orchestrates all 3 services
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── pages/
│       │   ├── Login.tsx
│       │   └── AnalyzeDashboard.tsx
│       └── services/
│           └── api.ts
└── server/
    ├── Dockerfile
    ├── entrypoint.sh
    ├── main.py
    ├── auth_utils.py
    ├── database.py
    ├── models.py
    ├── seed.py
    ├── embeddings.py
    ├── resume_parser.py
    ├── gap_detector.py
    ├── roadmap_generator.py
    └── requirements.txt
```

---

## 🐳 Docker Setup (Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### Run the full stack

```bash
git clone https://github.com/adithyanmarikkal/skillsyncai.git
cd skillsyncai

# If first time running Docker, add your user to the docker group:
sudo usermod -aG docker $USER
newgrp docker  # apply immediately without logout

docker compose up --build
```

This will automatically:
1. 🐘 Start a PostgreSQL database
2. 🌱 Seed the database with sample users
3. 🚀 Start the FastAPI backend
4. 🌐 Serve the React frontend via Nginx

### Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 🔑 Sample Login Credentials

These users are automatically seeded when you run Docker:

| Email | Password | Role |
|-------|----------|------|
| `admin@skillsync.com` | `Admin@2024` | Admin |
| `alice@example.com` | `Alice@123` | User |
| `bob@example.com` | `Bob@456` | User |
| `charlie@example.com` | `Charlie@789` | User |

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL running locally

### Backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Set up your .env file
cp .env.example .env  # then fill in your values

uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Create a `server/.env` file with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/skillsync
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_jwt_secret_key
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login, returns JWT token |
| POST | `/upload-resume` | No | Upload a PDF resume |
| POST | `/analyze` | ✅ Yes | Full analysis (match + gaps + roadmap) |
| POST | `/semantic-gap` | No | Gap detection only |
| POST | `/generate-roadmap` | No | Roadmap generation only |