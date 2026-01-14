"""
Tools for the Synthesizer agent.
Provides analysis and synthesis capabilities.
"""

from typing import Dict, Any, List
from collections import Counter


def identify_consensus(arguments: List[Dict[str, Any]]) -> List[str]:
    """
    Identifies points of consensus between protagonist and antagonist.
    
    Args:
        arguments: List of argument dictionaries
        
    Returns:
        List of consensus points
    """
    consensus_points = []
    
    # Extract key themes from all arguments
    protagonist_args = [arg for arg in arguments if arg.get('debater_role') == 'protagonist']
    antagonist_args = [arg for arg in arguments if arg.get('debater_role') == 'antagonist']
    
    # Look for common themes in reasoning or evidence
    # This is a simplified heuristic implementation
    if protagonist_args and antagonist_args:
        # Check for common keywords or themes
        common_themes = []
        for p_arg in protagonist_args:
            for a_arg in antagonist_args:
                if p_arg.get('factor_id') == a_arg.get('factor_id'):
                    # Same factor - look for agreement
                    consensus_points.append(
                        f"Both sides acknowledge the importance of {p_arg.get('factor_id')}"
                    )
    
    return list(set(consensus_points))  # Remove duplicates


def identify_divergence(arguments: List[Dict[str, Any]]) -> List[str]:
    """
    Identifies points of divergence between debaters.
    
    Args:
        arguments: List of argument dictionaries
        
    Returns:
        List of divergent points
    """
    divergent_points = []
    
    protagonist_args = [arg for arg in arguments if arg.get('debater_role') == 'protagonist']
    antagonist_args = [arg for arg in arguments if arg.get('debater_role') == 'antagonist']
    
    # Identify factors where positions directly conflict
    factors_discussed = set()
    for arg in arguments:
        factors_discussed.add(arg.get('factor_id'))
    
    for factor in factors_discussed:
        p_positions = [arg.get('position') for arg in protagonist_args if arg.get('factor_id') == factor]
        a_positions = [arg.get('position') for arg in antagonist_args if arg.get('factor_id') == factor]
        
        if p_positions and a_positions:
            divergent_points.append(
                f"Conflicting views on {factor}: Pro argues '{p_positions[0][:50]}...' vs Con argues '{a_positions[0][:50]}...'"
            )
    
    return divergent_points


def calculate_overall_confidence(arguments: List[Dict[str, Any]], verifications: List[Dict[str, Any]]) -> float:
    """
    Calculates overall confidence score based on arguments and verifications.
    
    Args:
        arguments: List of argument dictionaries
        verifications: List of verification result dictionaries
        
    Returns:
        Overall confidence score (0-1)
    """
    if not arguments:
        return 0.0
    
    # Average argument confidence
    arg_confidences = [arg.get('confidence', 0.5) for arg in arguments]
    avg_arg_confidence = sum(arg_confidences) / len(arg_confidences)
    
    # Average verification scores
    if verifications:
        ver_scores = [ver.get('accuracy_score', 0.5) for ver in verifications]
        avg_ver_score = sum(ver_scores) / len(ver_scores)
    else:
        avg_ver_score = 0.5
    
    # Weighted combination: 40% argument confidence, 60% verification score
    overall = (avg_arg_confidence * 0.4) + (avg_ver_score * 0.6)
    
    return round(overall, 2)


def extract_key_insights(arguments: List[Dict[str, Any]]) -> List[str]:
    """
    Extracts key insights from all arguments.
    
    Args:
        arguments: List of argument dictionaries
        
    Returns:
        List of key insights
    """
    insights = []
    
    # Extract evidence from all arguments
    all_evidence = []
    for arg in arguments:
        evidence = arg.get('evidence', [])
        all_evidence.extend(evidence)
    
    # Count most common evidence points (simplified)
    if all_evidence:
        evidence_counter = Counter(all_evidence)
        top_evidence = evidence_counter.most_common(5)
        insights = [f"Key evidence: {item[0]}" for item, count in top_evidence]
    
    return insights