"""
Tools for the Verifier agent.
Provides fact-checking and verification capabilities.
"""

from typing import Dict, Any, List
import re


def check_logical_consistency(argument: str) -> Dict[str, Any]:
    """
    Checks logical consistency in an argument.
    Looks for logical fallacies and contradictions.
    
    Args:
        argument: The argument text to check
        
    Returns:
        Dict with consistency analysis
    """
    issues = []
    
    # Simple heuristic checks for common logical issues
    fallacy_patterns = {
        "circular_reasoning": [r"because.*because", r"since.*since"],
        "false_dichotomy": [r"either.*or", r"only two"],
        "overgeneralization": [r"always", r"never", r"all", r"none"],
        "appeal_to_authority": [r"expert.*says", r"according to.*expert"],
    }
    
    for fallacy, patterns in fallacy_patterns.items():
        for pattern in patterns:
            if re.search(pattern, argument.lower()):
                issues.append(f"Potential {fallacy.replace('_', ' ')} detected")
    
    return {
        "is_consistent": len(issues) == 0,
        "issues": issues,
        "score": max(0.0, 1.0 - (len(issues) * 0.2))
    }


def verify_evidence(evidence: List[str]) -> Dict[str, Any]:
    """
    Verifies the quality and specificity of evidence.
    
    Args:
        evidence: List of evidence statements
        
    Returns:
        Dict with verification results
    """
    issues = []
    
    if not evidence:
        issues.append("No evidence provided")
        return {"is_verified": False, "issues": issues, "score": 0.0}
    
    # Check evidence quality
    for idx, item in enumerate(evidence):
        if len(item) < 10:
            issues.append(f"Evidence {idx+1} is too vague")
        if not any(char.isdigit() for char in item) and "study" not in item.lower():
            # Prefer quantitative evidence or references to studies
            pass
    
    score = max(0.0, 1.0 - (len(issues) * 0.15))
    
    return {
        "is_verified": len(issues) < len(evidence) // 2,
        "issues": issues,
        "score": score
    }


def assess_confidence(confidence: float, reasoning_length: int, evidence_count: int) -> Dict[str, Any]:
    """
    Assesses whether the stated confidence aligns with argument quality.
    
    Args:
        confidence: Stated confidence level (0-1)
        reasoning_length: Length of reasoning text
        evidence_count: Number of evidence items
        
    Returns:
        Dict with confidence assessment
    """
    # Heuristic: stronger arguments should have more evidence and reasoning
    expected_confidence = min(1.0, (reasoning_length / 1000) * 0.4 + (evidence_count / 5) * 0.6)
    
    issues = []
    if confidence > expected_confidence + 0.2:
        issues.append("Confidence may be overstated given evidence provided")
    elif confidence < expected_confidence - 0.2:
        issues.append("Confidence may be understated given strong evidence")
    
    return {
        "is_aligned": abs(confidence - expected_confidence) < 0.2,
        "expected_confidence": expected_confidence,
        "issues": issues
    }