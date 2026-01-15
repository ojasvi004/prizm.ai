from flask import Flask, jsonify
from flask_cors import CORS
from routes.analyze import analyze_bp
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS for frontend
CORS(app)

# Register API routes
app.register_blueprint(analyze_bp, url_prefix='/api/v1')

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "service": "PRIZM AI Backend",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/api/v1/analyze",
            "status": "/api/v1/status"
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)