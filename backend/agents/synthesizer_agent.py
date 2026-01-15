from agents.base_agent import BaseAgent
import os

class SynthesizerAgent(BaseAgent):
    def __init__(self):
        # Load the PRIZM-04-SYNTHESIZER prompt from file
        prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'synthesis.txt')
        with open(prompt_path, 'r') as f:
            system_prompt = f.read().strip()
        
        super().__init__(
            name="SynthesizerAgent",
            system_prompt=system_prompt
        )

    def synthesize(self, opposing_json):
        """Synthesize using PRIZM-04 specifications - expects JSON input, outputs Markdown"""
        prompt = opposing_json  # The system prompt handles all instructions
        return self.run(prompt)
