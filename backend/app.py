from flask import Flask, request, send_file, jsonify
import subprocess
import uuid
import os

app = Flask(__name__)
OUTPUT_DIR = "visualizations"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route('/')
def home():
    return "Language-Agnostic Visualization Backend is running."


@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    language = data.get('language')
    code = data.get('code')

    if language != "python":
        return jsonify({"error": "Only Python is supported for now"}), 400

    file_id = str(uuid.uuid4())
    image_path = os.path.join(OUTPUT_DIR, f"{file_id}.png")
    script_path = f"{file_id}.py"

    try:
        # Append savefig command
        code += f"\n\nimport matplotlib.pyplot as plt\nplt.savefig('{image_path}')"
        with open(script_path, "w") as f:
            f.write(code)

        subprocess.run(["python", script_path], check=True)
        return send_file(image_path, mimetype="image/png")

    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Execution failed", "details": str(e)}), 500

    finally:
        if os.path.exists(script_path):
            os.remove(script_path)

if __name__ == '__main__':
    app.run(debug=True)
