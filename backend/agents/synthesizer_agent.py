from agents.base_agent import BaseAgent

class SynthesizerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="SynthesizerAgent",
            system_prompt="Synthesize debates into actionable conclusions."
        )

    def synthesize(self, debates):
        prompt = f"""
        Based on the following debates, produce a unified report.

        Structure:
        - What Worked
        - What Failed
        - Why It Happened
        - How to Improve

        DEBATES:
        {debates}
        """
        return self.run(prompt)
