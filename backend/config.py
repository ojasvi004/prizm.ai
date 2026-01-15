import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Prefer env override; fall back to a widely supported model
# ✅ Correct: No "models/" prefix
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
