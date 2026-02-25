from skill_extractor import extract_skills
from embeddings import generate_embedding
from vector_db import search_skill

def detect_gaps(job_description: str):
    job_skills = extract_skills(job_description)

    matched = []
    missing = []

    for skill in job_skills:
        emb = generate_embedding(skill)
        found, score = search_skill(emb)

        if found:
            matched.append({
                "skill": skill,
                "similarity": round(score, 2)
            })
        else:
            missing.append(skill)

    return matched, missing