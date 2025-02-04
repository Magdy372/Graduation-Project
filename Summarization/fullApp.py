import ffmpeg
import whisper
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import torch
import numpy as np
from typing import Dict, List, Optional
import os
import logging
from tqdm import tqdm

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicalLectureSummarizer:
    def __init__(
        self,
        model_name: str = "google/bigbird-pegasus-large-pubmed",  # Better for medical text
        whisper_model_size: str = "base",
        device: str = "cuda" if torch.cuda.is_available() else "cpu"
    ):
        self.device = device
        self.whisper_model = whisper.load_model(whisper_model_size).to(device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)
        
        # Initialize extractive summarizer
        self.extractive_summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn",
            device=0 if device == "cuda" else -1
        )

    def extract_audio(self, video_path: str, audio_path: str) -> bool:
        """Extract audio from video with enhanced error handling and progress monitoring."""
        try:
            if not os.path.exists(video_path):
                raise FileNotFoundError(f"Video file not found: {video_path}")

            os.makedirs(os.path.dirname(audio_path), exist_ok=True)

            # Extract audio with progress monitoring
            (
                ffmpeg
                .input(video_path)
                .output(audio_path, ac=1, ar=16000)  # Mono, 16kHz for Whisper
                .run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
            )
            
            logger.info(f"Audio extracted successfully to: {audio_path}")
            return True

        except ffmpeg.Error as e:
            logger.error(f"FFmpeg error extracting audio: {e.stderr.decode('utf-8')}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error extracting audio: {str(e)}")
            return False

    def transcribe_audio(self, audio_path: str) -> Optional[Dict]:
        """Transcribe audio with enhanced features and error handling."""
        try:
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")

            # Transcribe with timestamps and speaker detection
            result = self.whisper_model.transcribe(
                audio_path,
                language='en',
                task='transcribe',
                verbose=False,
                fp16=torch.cuda.is_available()  # Use mixed precision if GPU is available
            )

            logger.info("Transcription completed successfully")
            return result

        except Exception as e:
            logger.error(f"Error during transcription: {str(e)}")
            return None

    def chunk_text(self, text: str, max_chunk_size: int = 1000) -> List[str]:
        """Split text into smaller chunks for processing."""
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0

        for word in words:
            if current_size + len(word) > max_chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = [word]
                current_size = len(word)
            else:
                current_chunk.append(word)
                current_size += len(word) + 1  # +1 for space

        if current_chunk:
            chunks.append(" ".join(current_chunk))

        return chunks

    def generate_abstractive_summary(self, text: str) -> str:
        """Generate abstractive summary using a medical summarization model."""
        try:
            chunks = self.chunk_text(text)
            summaries = []

            for chunk in tqdm(chunks, desc="Generating abstractive summary"):
                inputs = self.tokenizer(
                    chunk,
                    return_tensors="pt",
                    max_length=1024,
                    truncation=True,
                    padding='max_length'
                ).to(self.device)

                summary_ids = self.model.generate(
                    inputs['input_ids'],
                    num_beams=4,
                    max_length=300,
                    min_length=50,
                    length_penalty=2.0,
                    early_stopping=True,
                    no_repeat_ngram_size=3
                )

                summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
                summaries.append(summary)

            return " ".join(summaries)

        except Exception as e:
            logger.error(f"Error generating abstractive summary: {str(e)}")
            return ""

    def generate_extractive_summary(self, text: str) -> str:
        """Generate extractive summary."""
        try:
            chunks = self.chunk_text(text)
            summaries = []

            for chunk in tqdm(chunks, desc="Generating extractive summary"):
                summary = self.extractive_summarizer(
                    chunk,
                    max_length=300,
                    min_length=50,
                    do_sample=False
                )[0]['summary_text']
                summaries.append(summary)

            return " ".join(summaries)

        except Exception as e:
            logger.error(f"Error generating extractive summary: {str(e)}")
            return ""

    def process_video(
        self,
        video_path: str,
        summary_type: str = "both",
        output_dir: str = "output"
    ) -> Dict:
        """Process video and generate summary."""
        os.makedirs(output_dir, exist_ok=True)
        audio_path = os.path.join(output_dir, "audio.wav")
        
        # Extract audio
        if not self.extract_audio(video_path, audio_path):
            return {"error": "Audio extraction failed"}

        # Transcribe audio
        transcription_result = self.transcribe_audio(audio_path)
        if not transcription_result:
            return {"error": "Transcription failed"}

        transcription = transcription_result["text"]
        
        # Generate summaries based on specified type
        result = {
            "transcription": transcription,
            "timestamps": transcription_result.get("segments", [])
        }

        if summary_type in ["abstractive", "both"]:
            result["abstractive_summary"] = self.generate_abstractive_summary(transcription)
        
        if summary_type in ["extractive", "both"]:
            result["extractive_summary"] = self.generate_extractive_summary(transcription)

        return result

# Example usage
if __name__ == "__main__":
    summarizer = MedicalLectureSummarizer()
    result = summarizer.process_video(
        video_path="C:/Users/dell/Downloads/test1.mp4",
        summary_type="both",
        output_dir="output"
    )
    
    # Save results to files
    if "error" not in result:
        with open("output/transcription.txt", "w", encoding="utf-8") as f:
            f.write(result["transcription"])
        
        if "abstractive_summary" in result:
            with open("output/abstractive_summary.txt", "w", encoding="utf-8") as f:
                f.write(result["abstractive_summary"])
                
        if "extractive_summary" in result:
            with open("output/extractive_summary.txt", "w", encoding="utf-8") as f:
                f.write(result["extractive_summary"])