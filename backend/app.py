from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS
import subprocess
import uuid
import os

app = Flask(__name__)
CORS(app)

# Ensure output folders exist
os.makedirs("scripts", exist_ok=True)
os.makedirs("images", exist_ok=True)
os.makedirs("html", exist_ok=True)

@app.route('/')
def home():
    return "✅ Language-Agnostic Visualization Backend is running."

@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    language = data.get('language')
    code = data.get('code')

    if language != "python":
        return jsonify({"error": "Only Python is supported for now"}), 400

    file_id = str(uuid.uuid4())
    script_path = os.path.join("scripts", f"{file_id}.py")
    image_path = os.path.join("images", f"{file_id}.png")
    html_path = os.path.join("html", f"{file_id}.html")

    print(f"Script path: {script_path}")
    print(f"Image path: {image_path}")
    print(f"HTML path: {html_path}")

    try:
        if "plotly" in code:
            code += f"\n\nimport plotly.io as pio\npio.write_html(fig, file='{html_path}', auto_open=False)"
            with open(script_path, "w") as f:
                f.write(code)

            result = subprocess.run(["python", script_path], capture_output=True, text=True)
            print("=== STDOUT ===\n", result.stdout)
            print("=== STDERR ===\n", result.stderr)
            result.check_returncode()

            with open(html_path, "r") as f:
                html_content = f.read()
            response = make_response(html_content)
            response.headers["Content-Type"] = "text/html; charset=utf-8"
            print("✅ Returning HTML with correct content-type")
            return response

        else:
            code += f"\n\nimport matplotlib.pyplot as plt\nplt.savefig('{image_path}')"
            with open(script_path, "w") as f:
                f.write(code)

            result = subprocess.run(["python", script_path], capture_output=True, text=True)
            print("=== STDOUT ===\n", result.stdout)
            print("=== STDERR ===\n", result.stderr)
            result.check_returncode()

            return send_file(image_path, mimetype="image/png")

    except subprocess.CalledProcessError as e:
        print("❌ Execution failed")
        return jsonify({
            "error": "Execution failed",
            "details": e.stderr if hasattr(e, "stderr") else str(e)
        }), 500

    # finally:
    #     for folder, ext in [("scripts", ".py"), ("images", ".png"), ("html", ".html")]:
    #         temp_file = os.path.join(folder, f"{file_id}{ext}")
    #         if os.path.exists(temp_file):
    #             os.remove(temp_file)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
