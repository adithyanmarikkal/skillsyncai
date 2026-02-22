# 🚀 SkillSync AI – Resume to Job Match & Career Gap Analyzer

SkillSync AI is an AI-powered system that analyzes a user's resume against a target job role to provide intelligent, actionable feedback and a personalized learning roadmap.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 Resume Parsing | Supports PDF and plain text formats |
| 🧠 Job Description Understanding | Extracts key skills & requirements from job descriptions |
| 📊 AI Match Scoring | Calculates a semantic job-fit score |
| ❌ Gap Detection | Identifies missing skills & experience gaps |
| 🗺️ Upskilling Roadmap | Generates a personalized learning path |
| ✍️ Resume Suggestions | Provides actionable resume improvement tips |
| 🤖 LLM-Powered Insights | Low-hallucination analysis using embeddings |

---

## 🏗️ Architecture Overview

```
User Input (Resume + Job Role)
        ↓
Text Extraction & Cleaning
        ↓
Embeddings Generation
        ↓
Semantic Similarity + Skill Matching
        ↓
Gap Analysis Engine
        ↓
Roadmap & Feedback Generator (LLM)
```

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | FastAPI |
| NLP | LangChain |
| Vector DB | FAISS |
| LLM | Gemini / GPT |
| PDF Parsing | PyPDF |

---

## 📂 Project Structure

```
skillsync-ai/
│
├── backend/
│   ├── main.py
│   ├── resume_parser.py
│   ├── embeddings.py
│   ├── matcher.py
│   ├── gap_analyzer.py
│   └── roadmap_generator.py
│
├── frontend/
│   └── app.py
│
├── prompts/
│   ├── skill_extraction.txt
│   ├── gap_analysis.txt
│   └── roadmap_prompt.txt
│
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/adithyanmarikkal/skillsyncai.git
cd skillsyncai

# Install dependencies
pip install -r requirements.txt
```