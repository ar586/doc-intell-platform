import os
from google import genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDwqdPFku-SVynddgGzWxe5EziZkV3nPmY")

def get_client():
    if not GEMINI_API_KEY:
        return None
    return genai.Client(api_key=GEMINI_API_KEY)

def generate_answer(query, context):
    client = get_client()
    if not client:
        return "Warning: GEMINI_API_KEY not set. Returning dummy mock response."

    try:
        prompt = f"Use the following book context to answer the user's question.\n\nContext:\n{context}\n\nQuestion: {query}\n\nAnswer:"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Warning: Answer API failed ({e}). Returning dummy mock response.")
        return "AI is currently unavailable. Please try again later."

def generate_insights(description):
    client = get_client()
    if not client:
        return {"summary": "Mock generated summary", "genre": "Mock Science Fiction"}

    try:
        prompt = f"Analyze the following book description and return the output with a 'summary' (short 1-2 sentences) and 'genre' (predicted format).\n\nDescription:\n{description}"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return {"insights": response.text}
    except Exception as e:
        print(f"Warning: Insights API failed ({e}). Returning dummy mock summary.")
        return {"summary": "AI insights unavailable.", "genre": "Unknown"}
