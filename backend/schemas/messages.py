from pydantic import BaseModel, Field
from typing import List, Optional

class Factor(BaseModel):
    name: str
    description: str

class ExtractionResult(BaseModel):
    factors: List[Factor]
    summary: str

class Argument(BaseModel):
    factor_name: str
    point: str
    evidence: str

class DebateTurn(BaseModel):
    supportive_arguments: List[Argument]
    opposing_arguments: List[Argument]
    verification_results: Optional[List[dict]] = None

class FinalReport(BaseModel):
    executive_summary: str
    detailed_analysis: List[dict]
    conclusion: str
    recommendations: List[str]