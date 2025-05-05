import ffmpeg
import whisper
import torch
import os
import logging
import requests
import json
import socket
import tempfile
import time
from flask import Flask, request, jsonify
from urllib.parse import urlparse
import urllib.request
from transformers import AutoTokenizer, AutoModelForCausalLM
from safetensors.torch import load_file

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Eureka Configuration
EUREKA_SERVER = "http://localhost:8761/eureka"
SERVICE_NAME = "summarization-service"
SERVICE_PORT = 8090

class MedicalSummarizer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        # Load Whisper model
        self.whisper_model = whisper.load_model(
            "base",
            device=self.device,
            in_memory=True
        )

        # Load LLaMA tokenizer and model
        llama_model_name = "meta-llama/Meta-Llama-3-8B-Instruct"  # Use a local path if downloaded
        logger.info(f"Loading LLaMA model: {llama_model_name}")
        self.tokenizer = AutoTokenizer.from_pretrained(llama_model_name, use_fast=True)
        self.model = AutoModelForCausalLM.from_pretrained(
            llama_model_name,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            device_map="auto"
        )
        self.model.eval()

    def extract_audio(self, video_path: str, audio_path: str) -> bool:
        try:
            if not os.path.exists(video_path):
                logger.error(f"Video file not found: {video_path}")
                return False

            ffmpeg.input(video_path).output(audio_path, acodec='pcm_s16le', ac=1, ar='16000').run(
                overwrite_output=True, capture_stdout=True, capture_stderr=True
            )
            return os.path.exists(audio_path)
        except ffmpeg.Error as e:
            logger.error(f"FFmpeg error: {e.stderr.decode('utf8')}")
            return False

    def transcribe_audio(self, audio_path: str) -> str:
        try:
            result = self.whisper_model.transcribe(audio_path, verbose=False)
            return result['text']
        except Exception as e:
            logger.error(f"Transcription failed: {str(e)}")
            raise

    def generate_summary(self, text: str) -> str:
        try:
            prompt = f"Summarize the following medical lecture transcript:\n\n{text.strip()}\n\nSummary:"
            inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048).to(self.device)

            with torch.no_grad():
                outputs = self.model.generate(
                    inputs["input_ids"],
                    max_new_tokens=300,
                    do_sample=True,
                    temperature=0.7,
                    top_k=50,
                    top_p=0.9,
                    repetition_penalty=1.2,
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id
                )

            summary = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            if "Summary:" in summary:
                summary = summary.split("Summary:")[-1].strip()
            return summary
        except Exception as e:
            logger.error(f"Summarization failed: {str(e)}")
            raise

@app.route('/summarize', methods=['POST'])
def handle_request():
    summarizer = MedicalSummarizer()
    request_data = request.json

    if not request_data:
        return jsonify({"error": "Invalid request. Provide 'video_path'."}), 400

    video_path = "C:/Users/dell/Downloads" + request_data.get("video_path")

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            if not video_path or not os.path.exists(video_path):
                return jsonify({"error": "Invalid video path"}), 400

            audio_path = os.path.join(temp_dir, "audio.wav")

            if not summarizer.extract_audio(video_path, audio_path):
                return jsonify({"error": "Audio extraction failed"}), 500

            transcription = summarizer.transcribe_audio(audio_path)
            summary = summarizer.generate_summary(transcription)

            return jsonify({
                "transcription": transcription,
                "summary": summary
            })

    except Exception as e:
        logger.error(f"Processing failed: {str(e)}")
        return jsonify({"error": "Server error during processing"}), 500

@app.route('/demo', methods=['GET'])
def demo_page():
    return '''
    <html>
        <body>
            <h1>Medical Lecture Summarizer</h1>
            <input type="text" id="videoPath" placeholder="Enter Video Path">
            <button onclick="processVideo()">Process Video</button>
            <div id="result" style="margin-top: 20px;"></div>
            
            <script>
                function processVideo() {
                    const videoPath = document.getElementById('videoPath').value;
                    const resultDiv = document.getElementById('result');
                    resultDiv.innerHTML = 'Processing...';

                    fetch('/summarize', { 
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ video_path: videoPath })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            resultDiv.innerHTML = `Error: ${data.error}`;
                        } else {
                            resultDiv.innerHTML = `
                                <h3>Summary:</h3>
                                <p>${data.summary}</p>
                                <h3>Full Transcription:</h3>
                                <p>${data.transcription}</p>
                            `;
                        }
                    })
                    .catch(error => {
                        resultDiv.innerHTML = 'Error: ' + error.message;
                    });
                }
            </script>
        </body>
    </html>
    '''

def register_with_eureka():
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)

    registration_data = {
        "instance": {
            "hostName": hostname,
            "app": SERVICE_NAME.upper(),
            "ipAddr": ip_address,
            "vipAddress": SERVICE_NAME,
            "secureVipAddress": SERVICE_NAME,
            "status": "UP",
            "port": {"$": SERVICE_PORT, "@enabled": "true"},
            "dataCenterInfo": {
                "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                "name": "MyOwn"
            }
        }
    }

    headers = {"Content-Type": "application/json"}
    eureka_url = f"{EUREKA_SERVER}/apps/{SERVICE_NAME}"

    try:
        response = requests.post(eureka_url, data=json.dumps(registration_data), headers=headers)
        if response.status_code in [200, 204]:
            print(f"Successfully registered {SERVICE_NAME} with Eureka!")
        else:
            print(f"Failed to register with Eureka. Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Eureka registration error: {e}")

if __name__ == '__main__':
    time.sleep(5)
    register_with_eureka()
    app.run(host='0.0.0.0', port=SERVICE_PORT, threaded=True)
