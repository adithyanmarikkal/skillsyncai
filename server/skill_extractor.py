import google.generativeai as genai
from config import GEMINI_API_KEY
import ast

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-2.5-flash")

PROMPT_TEMPLATE = """
Extract only technical skills, tools, frameworks, and technologies from the job description below.

Rules:
- Return ONLY a Python list of lowercase strings
- No explanation
- No bullet points
- No extra text

Job description:
{job_text}
"""

def extract_skills(job_text: str):
    prompt = PROMPT_TEMPLATE.format(job_text=job_text)

    response = model.generate_content(prompt)

    raw_output = response.text.strip()

    try:
        skills = ast.literal_eval(raw_output)
        return list(set(skills))
    except Exception:
        return []