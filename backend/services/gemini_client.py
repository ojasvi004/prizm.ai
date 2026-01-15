# services/gemini_client.py
import os
from dotenv import load_dotenv
from google import genai

from config import MODEL_NAME


class GeminiClient:
    def __init__(self):
        # Load local .env values (no-op in prod when env vars are already set)
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in environment")

        self.client = genai.Client(api_key=api_key)

    def generate(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        return response.text
