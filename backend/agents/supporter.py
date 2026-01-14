import os
from google import genai
from google.genai import types
# IMPORTANT: Ensure your schema file is correctly imported
from schemas.messages import ExtractionResult, Argument

class SupporterAgent:
    def __init__(self):
        # Use os.getenv correctly
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def argue(self, factors: ExtractionResult) -> list[Argument]:
        response = self.client.models.generate_content(
            model="gemini-1.5-flash",
            # Use model_dump_json() for Pydantic v2
            contents=[f"Provide supportive arguments for these factors: {factors.model_dump_json()}"],
            config=types.GenerateContentConfig(
                system_instruction="You are the Supportive Agent. Find the strengths in each factor.",
                response_mime_type="application/json",
                # This fixes the 'response.parsed' error
                response_schema=list[Argument], 
            ),
        )
        return response.parsed