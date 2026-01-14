import re

def clean_bullet_points(text: str):
    """
    Converts LLM bullet output into a clean Python list
    """
    lines = text.split("\n")
    cleaned = []

    for line in lines:
        line = re.sub(r"^[\-\*\d\.\)]\s*", "", line).strip()
        if line:
            cleaned.append(line)

    return cleaned


def truncate_text(text, max_length=2000):
    """
    Prevents oversized prompts
    """
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."
