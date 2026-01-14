import os
from google import genai
from google.genai import types
# Fix for the red squiggles on 'list[Argument]'
from typing import List 
from schemas.messages import ExtractionResult, Argument

class OpponentAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    # Use List[Argument] (capital L) if you are on an older Python version
    def challenge(self, factors: ExtractionResult, supportive_points: List[Argument]) -> List[Argument]:
        # Correctly serialize the list of Pydantic objects for the prompt
        support_str = str([arg.model_dump() for arg in supportive_points])
        
        response = self.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[f"Critique these factors: {factors.model_dump_json()} and these arguments: {support_str}"],
            config=types.GenerateContentConfig(
                system_instruction="You are the Opposing Agent. Directly challenge the supporter's claims.",
                response_mime_type="application/json",
                # Explicitly pass the schema to enable response.parsed
                response_schema=List[Argument],
            ),
        )
        # response.parsed only works if response_schema is defined in the config
        return response.parsed