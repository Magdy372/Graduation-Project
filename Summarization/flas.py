import ffmpeg
import whisper
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os
import logging
from flask import Flask, request, jsonify
import tempfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

class MedicalSummarizer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.static_video_path = r"C:\Users\dell\Downloads\test3.mp4"
        
        # Load models
        self.whisper_model = whisper.load_model(
            "base",
            device=self.device,
            in_memory=True
        )

        # self.tokenizer = AutoTokenizer.from_pretrained("google/bigbird-pegasus-large-pubmed")
        # self.model = AutoModelForSeq2SeqLM.from_pretrained("google/bigbird-pegasus-large-pubmed").to(self.device)

        self.tokenizer = AutoTokenizer.from_pretrained("Ram20307/bart-finetuned-pubmed")
        self.model = AutoModelForSeq2SeqLM.from_pretrained("Ram20307/bart-finetuned-pubmed").to(self.device)

        # self.tokenizer = AutoTokenizer.from_pretrained("google/pegasus-pubmed")
        # self.model = AutoModelForSeq2SeqLM.from_pretrained("google/pegasus-pubmed").to(self.device)


    def extract_audio(self, audio_path: str) -> bool:
        """Audio extraction from static video file"""
        try:
            if not os.path.exists(self.static_video_path):
                logger.error(f"Static video file not found: {self.static_video_path}")
                return False

            (
                ffmpeg
                .input(self.static_video_path)
                .output(audio_path, acodec='pcm_s16le', ac=1, ar='16000')
                .run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
            )
            return os.path.exists(audio_path)
        except ffmpeg.Error as e:
            logger.error(f"FFmpeg error: {e.stderr.decode('utf8')}")
            return False

    def transcribe_audio(self, audio_path: str) -> str:
        """Audio transcription"""
        try:
            result = self.whisper_model.transcribe(audio_path, verbose=False)
            return result['text']
        except Exception as e:
            logger.error(f"Transcription failed: {str(e)}")
            raise

    def generate_summary(self, text: str) -> str:
        """Text summarization"""
        try:
            inputs = self.tokenizer(
                text,
                max_length=1024,
                truncation=True,
                padding='max_length',
                return_tensors="pt"
            ).to(self.device)

            summary_ids = self.model.generate(
                inputs.input_ids,
                num_beams=4,
                max_length=1000,
                min_length=300,
                length_penalty=2.0,
                early_stopping=True
            )

            return self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        except Exception as e:
            logger.error(f"Summarization failed: {str(e)}")
            raise

@app.route('/summarize', methods=['POST'])
def handle_request():
    summarizer = MedicalSummarizer()
    
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            audio_path = os.path.join(temp_dir, "audio.wav")
            
            if not summarizer.extract_audio(audio_path):
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
    """Simplified demo interface"""
    return '''
    <html>
        <body>
            <h1>Medical Lecture Summarizer</h1>
            <button onclick="processVideo()">Process Static Video</button>
            <div id="result" style="margin-top: 20px;"></div>
            
            <script>
                function processVideo() {
                    const resultDiv = document.getElementById('result');
                    resultDiv.innerHTML = 'Processing...';
                    
                    fetch('/summarize', { method: 'POST' })
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8099, threaded=True)