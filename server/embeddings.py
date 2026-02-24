import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def generate_embedding(text):
    response = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text
    )
    return response["embedding"]