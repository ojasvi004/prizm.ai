from services.gemini_client import GeminiClient
from services.logger import ReasoningLogger

# Single shared logger instance for all agents
logger = ReasoningLogger()

class BaseAgent:
    def __init__(self, name, system_prompt):
        self.name = name
        self.system_prompt = system_prompt
        self.client = GeminiClient()

    def run(self, user_prompt):
        final_prompt = f"""
SYSTEM ROLE:
{self.system_prompt}

TASK:
{user_prompt}
"""

        # Call Gemini
        output = self.client.generate(final_prompt)

        # 🔍 LOG REASONING STEP
        logger.log_step(
            agent_name=self.name,
            input_data={
                "system_prompt": self.system_prompt,
                "user_prompt": user_prompt
            },
            output_data=output
        )

        # 💾 Persist execution trace
        logger.save_execution_flow()

        return output
