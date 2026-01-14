import os
from google import genai           # <--- CRITICAL: Add this
from google.genai import types    # <--- CRITICAL: Add this
from tools.google_serp import get_google_search

class VerifierAgent:
    def __init__(self):
        # The client picks up the API key from the environment variable
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def verify(self, extraction_result):
        # 1. Create a search query based on the factor summary
        search_query = f"Verify facts about: {extraction_result.summary}"
        
        # 2. Call your actual SERP tool
        real_time_facts = get_google_search(search_query)
        
        # 3. Ground the model with the search results
        response = self.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[f"Debate points to verify: {extraction_result.summary}\n\nLive Search Data:\n{real_time_facts}"],
            config=types.GenerateContentConfig(
                system_instruction="""You are the Verifier. Compare the debate points against the 
                provided Search Data. Directly confirm or debunk each claim with evidence."""
            )
        )
        return response.text