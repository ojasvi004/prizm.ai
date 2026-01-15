from agents.base_agent import BaseAgent
import os


class OpposingAgent(BaseAgent):
    def __init__(self):
        prompt_path = os.path.join(
            os.path.dirname(__file__), "..", "prompts", "opposing_reasoning.txt"
        )
        with open(prompt_path, "r") as f:
            system_prompt = f.read().strip()

        super().__init__(name="OpposingAgent", system_prompt=system_prompt)

    def analyze(self, supportive_json, supportive_arguments):
        """Analyze using PRIZM-03 specifications - expects JSON input"""
        prompt = supportive_json
        return self.run(prompt)
