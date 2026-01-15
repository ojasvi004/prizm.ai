from flask import Blueprint, request, jsonify, current_app, Response, stream_with_context
from orchestration.coordinator import AetherCoordinator
import logging
import time
import uuid
import json

logger = logging.getLogger(__name__)

analyze_bp = Blueprint("analyze", __name__)

# Initialize coordinator as a singleton
coordinator = AetherCoordinator()

analysis_status = {}

def validate_request(f):
    """Decorator to validate incoming requests"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Request must be JSON",
                "status": 400
            }), 400
        
        data = request.json
        if not data:
            return jsonify({
                "error": "Empty Request",
                "message": "Request body cannot be empty",
                "status": 400
            }), 400
        
        return f(*args, **kwargs)
    return decorated_function

@analyze_bp.route("/analyze", methods=["POST"])
@validate_request
def analyze():
    """
    Main public API endpoint for deliberative multi-agent analysis.
    
    This is the ONLY public endpoint that the frontend should communicate with.
    All AI agents work internally through the coordinator orchestration.
    
    Request Body:
        {
            "report": "string - The content to analyze",
            "stream": false - Optional: Enable real-time streaming
        }
    
    Response:
        {
            "success": true,
            "final_report": "string",
            "debates": [...],
            "processing_time": 12.5
        }
    """
    try:
        data = request.json
        report = data.get("report", "").strip()
        enable_stream = data.get("stream", False)
        

        if not report:
            return jsonify({
                "error": "Validation Error",
                "message": "Report content cannot be empty",
                "status": 400
            }), 400
        
        if enable_stream:
            return jsonify({
                "message": "Use /analyze/stream endpoint for real-time streaming",
                "stream_endpoint": "/api/v1/analyze/stream"
            }), 400
        
        logger.info(f"Analyzing report ({len(report)} chars)")
        
        start_time = time.time()
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

@analyze_bp.route("/analyze/stream", methods=["POST"])
@validate_request
def analyze_stream():
    """
    Real-time streaming endpoint for live debate visualization.
    
    Streams each agent's output as it completes, enabling real-time 
    frontend visualization of the debate between agents.
    
    Response: Server-Sent Events (SSE) stream
    """
    try:
        data = request.json
        report = data.get("report", "").strip()
        
        if not report:
            return jsonify({
                "error": "Report content cannot be empty"
            }), 400
        
        def generate():
            """Generator function that yields SSE events"""
            try:
                yield f"data: {json.dumps({'event': 'started', 'message': 'Analysis initiated'})}\n\n"
                
                yield f"data: {json.dumps({'event': 'stage', 'stage': 'extraction', 'message': 'Extracting key factors...'})}\n\n"
                
                for event in coordinator.analyze_stream(report):
                    yield f"data: {json.dumps(event)}\n\n"
                
                yield f"data: {json.dumps({'event': 'complete', 'message': 'Analysis complete'})}\n\n"
                
            except Exception as e:
                logger.error(f"Streaming error: {str(e)}")
                yield f"data: {json.dumps({'event': 'error', 'message': str(e)})}\n\n"
        
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no',
                'Connection': 'keep-alive'
            }
        )
        
    except Exception as e:
        logger.error(f"Stream setup error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
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
