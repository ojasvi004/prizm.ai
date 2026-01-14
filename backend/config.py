import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Prefer env override; fall back to a widely supported model
MODEL_NAME = os.getenv("GEMINI_MODEL", "models/gemini-pro")

