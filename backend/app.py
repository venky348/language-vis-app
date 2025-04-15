from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS
import subprocess
import uuid
import os
import shutil

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
    language = data.get('language', '').lower()
    code = data.get('code')

    file_id = str(uuid.uuid4())
    script_ext = "py" if language == "python" else "R"
    script_path = os.path.join("scripts", f"{file_id}.{script_ext}")
    image_path = os.path.join("images", f"{file_id}.png")
    html_path = os.path.join("html", f"{file_id}.html")

    print(f"Language: {language}")
    print(f"Script path: {script_path}")
    print(f"Image path: {image_path}")
    print(f"HTML path: {html_path}")
    print("🔍 Rscript being used:", shutil.which("Rscript"))

    try:
        # ------------------------ Python Handling ------------------------
        if language == "python":
            if "plotly" in code:
                code += f"\n\nimport plotly.io as pio\npio.write_html(fig, file='{html_path}', auto_open=False)"
                with open(script_path, "w") as f:
                    f.write(code)

                result = subprocess.run(["python", script_path], capture_output=True, text=True)
                print("=== PY STDOUT ===\n", result.stdout)
                print("=== PY STDERR ===\n", result.stderr)
                result.check_returncode()

                with open(html_path, "r") as f:
                    html_content = f.read()
                response = make_response(html_content)
                response.headers["Content-Type"] = "text/html; charset=utf-8"
                return response

            else:
                code += f"\n\nimport matplotlib.pyplot as plt\nplt.savefig('{image_path}')"
                with open(script_path, "w") as f:
                    f.write(code)

                result = subprocess.run(["python", script_path], capture_output=True, text=True)
                print("=== PY STDOUT ===\n", result.stdout)
                print("=== PY STDERR ===\n", result.stderr)
                result.check_returncode()

                return send_file(image_path, mimetype="image/png")

        # ------------------------ R Handling ------------------------
        elif language == "r":
            if "plotly" in code.lower():
                code += f"""
htmlwidgets::saveWidget(fig, file="{html_path}", selfcontained = TRUE)
"""
                with open(script_path, "w") as f:
                    f.write(code)

                result = subprocess.run(["/usr/local/bin/Rscript", script_path], capture_output=True, text=True)
                print("=== R STDOUT ===\n", result.stdout)
                print("=== R STDERR ===\n", result.stderr)
                result.check_returncode()

                with open(html_path, "r") as f:
                    html_content = f.read()
                response = make_response(html_content)
                response.headers["Content-Type"] = "text/html; charset=utf-8"
                return response

            else:
                code = f"""
png("{image_path}")
{code}
dev.off()
"""
                with open(script_path, "w") as f:
                    f.write(code)

                result = subprocess.run(["/usr/local/bin/Rscript", script_path], capture_output=True, text=True)
                print("=== R STDOUT ===\n", result.stdout)
                print("=== R STDERR ===\n", result.stderr)
                result.check_returncode()

                return send_file(image_path, mimetype="image/png")

        else:
            return jsonify({"error": "Unsupported language"}), 400

    except subprocess.CalledProcessError as e:
        print("❌ Execution failed")
        return jsonify({
            "error": "Execution failed",
            "details": e.stderr if hasattr(e, "stderr") else str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
