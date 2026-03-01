from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from resume_parser import extract_text_from_pdf
from embeddings import generate_embedding
from vector_db import create_collection, store_embedding, search_similar
from gap_detector import detect_gaps
from roadmap_generator import generate_roadmap
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from database import engine
from models import Base

Base.metadata.create_all(bind=engine)

class JobRequest(BaseModel):
    job_description: str


class GapRequest(BaseModel):
    job_description: str


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173" , "https://your-frontend.vercel.app"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    print("file received")

    text = extract_text_from_pdf(file.file)

    # simple chunking
    chunks = [text[i : i + 500] for i in range(0, len(text), 500)]

    first_embedding = generate_embedding(chunks[0])
    create_collection(len(first_embedding))

    for chunk in chunks:
        embedding = generate_embedding(chunk)
        store_embedding(embedding, chunk)

    return {"message": "Resume processed and stored successfully"}


@app.post("/match-job")
async def match_job(req: JobRequest):
    print("function called")
    job_embedding = generate_embedding(req.job_description)
    print("embedding generated")
    results = search_similar(job_embedding)

    matched_chunks = [
        {"text": r.payload["text"], "score": float(r.score)} for r in results.points
    ]

    avg_score = sum(r["score"] for r in matched_chunks) / len(matched_chunks)

    match_percentage = round(avg_score * 100, 2)

    return {"match_percentage": match_percentage, "top_matches": matched_chunks}


@app.post("/semantic-gap")
async def semantic_gap(req: GapRequest):
    matched, missing = detect_gaps(req.job_description)
    return {"matched": matched, "missing": missing}


class RoadmapRequest(BaseModel):
    job_description: str


@app.post("/generate-roadmap")
async def generate_learning_roadmap(req: RoadmapRequest):

    matched, missing = detect_gaps(req.job_description)

    if not missing:
        return {"message": "No major skill gaps found!"}

    roadmap = generate_roadmap(job_role=req.job_description, missing_skills=missing)

    return {"missing_skills": missing, "roadmap": roadmap}


class AnalyzeRequest(BaseModel):
    job_description: str


@app.post("/analyze")
async def analyze(req: AnalyzeRequest, current_user: str = Depends(get_current_user)):
    # Compute match score inline (same logic as /match-job)
    job_embedding = generate_embedding(req.job_description)
    results = search_similar(job_embedding)
    matched_chunks = [
        {"text": r.payload["text"], "score": float(r.score)} for r in results.points
    ]
    avg_score = (
        sum(r["score"] for r in matched_chunks) / len(matched_chunks)
        if matched_chunks
        else 0
    )
    match_score = round(avg_score * 100, 2)

    matched_skills, missing = detect_gaps(req.job_description)
    roadmap = generate_roadmap(job_role=req.job_description, missing_skills=missing)
    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing,
        "roadmap": roadmap,
    }


class RegisterRequest(BaseModel):
    email: str
    password: str


@app.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(email=req.email, password=hash_password(req.password))
    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()

    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {"access_token": token}
