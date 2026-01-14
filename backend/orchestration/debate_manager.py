import json
from datetime import datetime

class DebateManager:
    def __init__(self):
        self.debates = []

    def add(self, factor, support, oppose):
        self.debates.append({
            "factor": factor,
            "supportive": support,
            "opposing": oppose
        })

    def save(self):
        with open("logs/debates.json", "w") as f:
            json.dump({
                "timestamp": datetime.utcnow().isoformat(),
                "debates": self.debates
            }, f, indent=2)
