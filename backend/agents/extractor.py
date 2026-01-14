import os
from google import genai
from google.genai import types
from schemas.messages import ExtractionResult

class ExtractorAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_id = "gemini-1.5-flash"

    def process(self, prompt: str, file_path: str = None) -> ExtractionResult:
        contents = [prompt]
        if file_path:
            # Upload file to Google Gemini File API
            file_ref = self.client.files.upload(path=file_path)
            contents.append(file_ref)

        response = self.client.models.generate_content(
            model=self.model_id,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction="Extract 3 key factors from the document for a critical debate. Return JSON.",
                response_mime_type="application/json",
                response_schema=ExtractionResult,
            ),
        )
        return response.parsed