import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

print("Available models for your API Key:")
for m in genai.list_models():
    # This checks if the model supports the 'embedContent' method you need
    if 'embedContent' in m.supported_generation_methods:
        print(f"-> {m.name} (Supports Embeddings)")
    elif 'generateContent' in m.supported_generation_methods:
        print(f"-> {m.name} (Supports Text/Chat)")