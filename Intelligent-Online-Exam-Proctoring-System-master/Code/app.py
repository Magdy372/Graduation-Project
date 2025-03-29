from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/run-proctoring', methods=['POST'])
def run_proctoring():
    data = request.json
    user_id = data.get("user_id")

    # Run the proctoring system (Modify this command based on the proctoring system)
    result = subprocess.run(["python", "online_proctoring_system.py", str(user_id)], capture_output=True, text=True)
    
    return jsonify({"status": "completed", "output": result.stdout})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
