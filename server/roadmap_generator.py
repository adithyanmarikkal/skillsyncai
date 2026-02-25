import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-2.5-flash")

PROMPT = """
You are an expert career mentor.

Target job role:
{job_role}

Missing skills:
{skills}

Create a personalized learning roadmap with:

- Weekly plan
- What to study
- What to build (small project ideas)

Return in JSON format like:

{{
  "weeks": [
    {{
      "week": 1,
      "focus": "",
      "topics": [],
      "project": ""
    }}
  ]
}}
"""

def generate_roadmap(job_role: str, missing_skills: list):
    skill_text = ", ".join(missing_skills)

    prompt = PROMPT.format(
        job_role=job_role,
        skills=skill_text
    )

    response = model.generate_content(prompt)

    return response.text