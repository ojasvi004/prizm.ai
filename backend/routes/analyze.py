from flask import Blueprint, request, jsonify
from orchestration.coordinator import AetherCoordinator
import logging
import time

logger = logging.getLogger(__name__)

analyze_bp = Blueprint("analyze", __name__)
coordinator = AetherCoordinator()

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Main API endpoint for deliberative multi-agent analysis.
    All AI agents work internally through coordinator orchestration.
    
    Request: {"report": "text to analyze"}
    Response: {"success": true, "final_report": "...", "debates": [...]}
    """
    try:
        data = request.json
        if not data or not data.get("report"):
            return jsonify({
                "success": False,
                "error": "Report content is required"
            }), 400
        
        report = data.get("report").strip()
        logger.info(f"Analyzing report ({len(report)} chars)")
        
        start_time = time.time()
        
        # Run coordinator-driven orchestration
        # All agents are internal: factor_extractor, supportive, opposing, synthesizer
        result = coordinator.analyze(report)
        
        processing_time = time.time() - start_time
        logger.info(f"Analysis completed in {processing_time:.2f}s")
        
        return jsonify({
            "success": True,
            "final_report": result.get("final_report", ""),
            "debates": result.get("debates", []),
            "processing_time": round(processing_time, 2)
        })
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Analysis failed"
        }), 500

@analyze_bp.route("/status", methods=["GET"])
def status():
    """System status endpoint"""
    return jsonify({
        "status": "operational",
        "agents": [
            "factor_extractor",
            "supportive_agent",
            "opposing_agent",
            "synthesizer_agent"
        ]
    })
