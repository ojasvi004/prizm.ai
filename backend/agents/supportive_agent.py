from agents.base_agent import BaseAgent
import os

class SupportiveAgent(BaseAgent):
    def __init__(self):
        # Load the PRIZM-02-PROPONENT prompt from file
        prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'supportive_reasoning.txt')
        with open(prompt_path, 'r') as f:
            system_prompt = f.read().strip()
        
        super().__init__(
            name="SupportiveAgent",
            system_prompt=system_prompt
        )

    def analyze(self, factor_json, context):
        """Analyze using PRIZM-02 specifications - expects JSON input"""
        prompt = factor_json  # The system prompt handles all instructions
        return self.run(prompt)
