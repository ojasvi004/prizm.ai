from agents.base_agent import BaseAgent

class SupportiveAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="SupportiveAgent",
            system_prompt="Argue in favor of a factor using evidence-based reasoning."
        )

    def analyze(self, factor, context):
        prompt = f"""
        Factor: {factor}

        Context:
        {context}

        Provide strong arguments supporting why this factor worked or was valid.
        """
        return self.run(prompt)
