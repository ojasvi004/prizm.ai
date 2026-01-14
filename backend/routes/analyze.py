from flask import Blueprint, request, jsonify
from orchestration.coordinator import AetherCoordinator

analyze_bp = Blueprint("analyze", __name__)
coordinator = AetherCoordinator()

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    report = data.get("report", "")

    result = coordinator.analyze(report)
    return jsonify(result)
