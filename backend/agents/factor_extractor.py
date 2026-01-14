from agents.base_agent import BaseAgent

class FactorExtractorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="FactorExtractor",
            system_prompt="Extract key analytical factors from reports."
        )

    def extract(self, report):
        prompt = f"""
        Analyze the following report and extract 3–6 key factors.
        Return them as a bullet list.

        REPORT:
        {report}
        """
        raw = self.run(prompt)
        return [f.strip("- ").strip() for f in raw.split("\n") if f.strip()]
