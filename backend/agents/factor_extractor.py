from agents.base_agent import BaseAgent
import os

class FactorExtractorAgent(BaseAgent):
    def __init__(self):
        # Load the PRIZM-01-EXTRACTOR prompt from file
        prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'factor_extraction.txt')
        with open(prompt_path, 'r') as f:
            system_prompt = f.read().strip()
        
        super().__init__(
            name="FactorExtractor",
            system_prompt=system_prompt
        )

    def extract(self, report):
        """Extract factors from the report using PRIZM-01 specifications"""
        prompt = report  # The system prompt handles all instructions
        raw = self.run(prompt)
        return raw  # Return the raw JSON output
