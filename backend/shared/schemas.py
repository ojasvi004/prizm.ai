"""
Shared Pydantic schemas for Prizm AI agents.
Data contracts used across all agents in the system.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


class DebateFactor(BaseModel):
    """
    A factor or dimension identified by the Analyst that should be debated.
    Examples: cost, scalability, user experience, security, etc.
    """
    factor_id: str = Field(..., description="Unique identifier for this factor")
    name: str = Field(..., description="Name of the factor (e.g., 'Cost', 'Scalability')")
    description: str = Field(..., description="Detailed description of what this factor represents")
    weight: float = Field(default=1.0, ge=0.0, le=1.0, description="Importance weight (0-1)")
    created_at: datetime = Field(default_factory=datetime.now)


class Argument(BaseModel):
    """
    An argument made by a debater (Protagonist or Antagonist) for a specific factor.
    Contains the position, reasoning, evidence, and confidence level.
    """
    argument_id: str = Field(..., description="Unique identifier for this argument")
    factor_id: str = Field(..., description="The factor this argument relates to")
    debater_role: Literal["protagonist", "antagonist"] = Field(..., description="Which debater made this argument")
    position: str = Field(..., description="The stance or position taken (for/against)")
    reasoning: str = Field(..., description="Detailed reasoning and logic")
    evidence: List[str] = Field(default_factory=list, description="Supporting evidence, sources, or data points")
    confidence: float = Field(default=0.5, ge=0.0, le=1.0, description="Confidence level in this argument (0-1)")
    counterarguments: List[str] = Field(default_factory=list, description="Potential counterarguments addressed")
    created_at: datetime = Field(default_factory=datetime.now)


class VerificationResult(BaseModel):
    """Result of argument verification by the Verifier agent."""
    argument_id: str
    is_valid: bool = Field(..., description="Whether the argument passes verification")
    accuracy_score: float = Field(default=0.0, ge=0.0, le=1.0, description="Accuracy score (0-1)")
    issues_found: List[str] = Field(default_factory=list, description="List of issues or inaccuracies found")
    corrections: Optional[str] = Field(None, description="Suggested corrections if needed")
    sources_verified: bool = Field(default=False, description="Whether sources were verified")


class DebateSession(BaseModel):
    """Represents a complete debate session."""
    session_id: str
    topic: str = Field(..., description="The topic being debated")
    factors: List[DebateFactor] = Field(default_factory=list)
    arguments: List[Argument] = Field(default_factory=list)
    verifications: List[VerificationResult] = Field(default_factory=list)
    status: Literal["initiated", "analyzing", "debating", "verifying", "synthesizing", "completed"] = "initiated"
    created_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None


class SynthesisResult(BaseModel):
    """Final synthesis output from the Synthesizer agent."""
    session_id: str
    summary: str = Field(..., description="Comprehensive summary of the debate")
    key_insights: List[str] = Field(default_factory=list, description="Key insights from all arguments")
    consensus_points: List[str] = Field(default_factory=list, description="Points where both sides agree")
    divergent_points: List[str] = Field(default_factory=list, description="Points of disagreement")
    recommendations: List[str] = Field(default_factory=list, description="Final recommendations")
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0, description="Overall confidence in synthesis")
    created_at: datetime = Field(default_factory=datetime.now)
