import json
from datetime import datetime
from pathlib import Path

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

class ReasoningLogger:
    def __init__(self):
        self.execution_flow = []

    def log_step(self, agent_name, input_data, output_data):
        self.execution_flow.append({
            "timestamp": datetime.utcnow().isoformat(),
            "agent": agent_name,
            "input": input_data,
            "output": output_data
        })

    def save_execution_flow(self):
        with open(LOG_DIR / "execution_flow.json", "w") as f:
            json.dump(self.execution_flow, f, indent=2)
