from dataclasses import dataclass, field
from typing import List

@dataclass
class Argument:
    agent: str
    content: str


@dataclass
class FactorDebate:
    factor: str
    supportive: Argument
    opposing: Argument


@dataclass
class AetherReport:
    debates: List[FactorDebate] = field(default_factory=list)
    final_summary: str = ""
