from flask import Flask
from routes.analyze import analyze_bp

app = Flask(__name__)
app.register_blueprint(analyze_bp)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)