from skill_extractor import extract_skills
from embeddings import generate_embedding
from vector_db import search_skill, get_all_resume_text


def detect_gaps(job_description: str):
    job_skills = extract_skills(job_description)

    # Get the full resume text (all chunks joined) for exact-match fallback
    resume_text = get_all_resume_text().lower()

    matched = []
    missing = []

    for skill in job_skills:
        skill_lower = skill.lower().strip()

        # 1. Exact keyword match in resume text (most reliable for clear skill names)
        if skill_lower in resume_text:
            matched.append(
                {
                    "skill": skill,
                    "similarity": 1.0,  # direct text hit
                }
            )
            continue

        # 2. Semantic / embedding similarity match as fallback
        emb = generate_embedding(skill)
        found, score = search_skill(emb)

        if found:
            matched.append({"skill": skill, "similarity": round(score, 2)})
        else:
            missing.append(skill)

    return matched, missing
