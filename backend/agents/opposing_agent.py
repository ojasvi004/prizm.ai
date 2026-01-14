from agents.base_agent import BaseAgent

class OpposingAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="OpposingAgent",
            system_prompt="Critically challenge arguments and identify weaknesses."
        )

    def analyze(self, factor, supportive_arguments):
        prompt = f"""
        Factor: {factor}

        Supportive Arguments:
        {supportive_arguments}

        Directly challenge these claims.
        Identify flaws, risks, or missing considerations.
        """
        return self.run(prompt)
