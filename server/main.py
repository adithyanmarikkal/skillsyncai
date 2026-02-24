from fastapi import FastAPI, UploadFile, File
from resume_parser import extract_text_from_pdf
from embeddings import generate_embedding
from vector_db import create_collection, store_embedding

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    text = extract_text_from_pdf(file.file)

    # simple chunking
    chunks = [text[i:i+500] for i in range(0, len(text), 500)]

    first_embedding = generate_embedding(chunks[0])
    create_collection(len(first_embedding))

    for chunk in chunks:
        embedding = generate_embedding(chunk)
        store_embedding(embedding, chunk)

    return {"message": "Resume processed and stored successfully"}