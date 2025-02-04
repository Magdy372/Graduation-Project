import ffmpeg
import whisper
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import torch
import numpy as np
from typing import Dict, List, Optional
import os
import logging
from tqdm import tqdm
from fpdf import FPDF
import nltk

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicalLectureSummarizer:
    def __init__(
        self,
        model_name: str = "Ram20307/bart-finetuned-pubmed",
        whisper_model_size: str = "base",
        device: str = "cuda" if torch.cuda.is_available() else "cpu",
        extractive_model_name: str = "pszemraj/led-large-book-summary"
    ):
        self.device = device
        self.whisper_model = whisper.load_model(whisper_model_size).to(device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)
        
        # Initialize the improved extractive summarizer
        self.extractive_summarizer = pipeline(
            "summarization",
            model=extractive_model_name,
            device=0 if device == "cuda" else -1
        )
        
        # Initialize NLTK for better text processing
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

    # Keep your existing methods (extract_audio, transcribe_audio) unchanged...

    def chunk_text(self, text: str, max_chunk_size: int = 1000) -> List[str]:
        """Split text into chunks with improved sentence boundary detection."""
        try:
            sentences = nltk.sent_tokenize(text)
            chunks = []
            current_chunk = []
            current_size = 0

            for sentence in sentences:
                sentence_size = len(sentence.split())
                
                if current_size + sentence_size > max_chunk_size and current_chunk:
                    chunks.append(" ".join(current_chunk))
                    current_chunk = [sentence]
                    current_size = sentence_size
                else:
                    current_chunk.append(sentence)
                    current_size += sentence_size

            if current_chunk:
                chunks.append(" ".join(current_chunk))

            return chunks

        except Exception as e:
            logger.error(f"Error in chunk_text: {str(e)}")
            # Fallback to original word-based chunking
            return super().chunk_text(text, max_chunk_size)

    def preprocess_text(self, text: str) -> str:
        """Preprocess text to improve summarization quality."""
        try:
            # Convert to lowercase for consistency
            text = text.lower()
            
            # Remove extra whitespace
            text = ' '.join(text.split())
            
            # Split into sentences and remove very short ones
            sentences = nltk.sent_tokenize(text)
            sentences = [s for s in sentences if len(s.split()) > 3]
            
            return ' '.join(sentences)
        except Exception as e:
            logger.error(f"Error in preprocess_text: {str(e)}")
            return text

    def generate_extractive_summary(self, text: str) -> str:
        """Generate extractive summary using improved LED model."""
        try:
            # Preprocess the text
            processed_text = self.preprocess_text(text)
            chunks = self.chunk_text(processed_text)
            summaries = []

            for chunk in tqdm(chunks, desc="Generating extractive summary"):
                # Calculate dynamic length constraints
                chunk_length = len(chunk.split())
                max_length = min(1024, int(chunk_length * 0.6))  # 60% of chunk length
                min_length = min(50, max_length - 50)

                summary = self.extractive_summarizer(
                    chunk,
                    max_length=max_length,
                    min_length=min_length,
                    do_sample=False,
                    num_beams=4,
                    length_penalty=2.0,
                    early_stopping=True
                )[0]['summary_text']
                
                summaries.append(summary)

            # Combine summaries and remove redundant sentences
            combined_summary = ' '.join(summaries)
            final_sentences = nltk.sent_tokenize(combined_summary)
            unique_sentences = list(dict.fromkeys(final_sentences))
            
            return ' '.join(unique_sentences)

        except Exception as e:
            logger.error(f"Error generating extractive summary: {str(e)}")
            return ""

    def extract_audio(self, video_path: str, audio_path: str) -> bool:
        """Extract audio from video with enhanced error handling."""
        try:
            # Check if input video exists
            if not os.path.exists(video_path):
                raise FileNotFoundError(f"Video file not found: {video_path}")

            # Create output directory if it doesn't exist
            os.makedirs(os.path.dirname(audio_path), exist_ok=True)

            # Extract audio with progress monitoring
            stream = ffmpeg.input(video_path)
            stream = ffmpeg.output(stream, audio_path, acodec='pcm_s16le', ac=1, ar='16k')
            ffmpeg.run(stream, overwrite_output=True, capture_stdout=True, capture_stderr=True)
            
            logger.info(f"Audio extracted successfully to: {audio_path}")
            return True

        except Exception as e:
            logger.error(f"Error extracting audio: {str(e)}")
            return False

    def transcribe_audio(self, audio_path: str) -> Optional[Dict]:
        """Transcribe audio with enhanced features and error handling."""
        try:
            # Check if audio file exists
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")

            # Transcribe with timestamps and speaker detection
            result = self.whisper_model.transcribe(
                audio_path,
                language='en',
                task='transcribe',
                verbose=False
            )

            logger.info("Transcription completed successfully")
            return result

        except Exception as e:
            logger.error(f"Error during transcription: {str(e)}")
            return None

    # def chunk_text(self, text: str, max_chunk_size: int = 1000) -> List[str]:
    #     """Split text into smaller chunks for processing."""
    #     words = text.split()
    #     chunks = []
    #     current_chunk = []
    #     current_size = 0

    #     for word in words:
    #         if current_size + len(word) > max_chunk_size:
    #             chunks.append(" ".join(current_chunk))
    #             current_chunk = [word]
    #             current_size = len(word)
    #         else:
    #             current_chunk.append(word)
    #             current_size += len(word) + 1  # +1 for space

    #     if current_chunk:
    #         chunks.append(" ".join(current_chunk))

    #     return chunks

    def generate_abstractive_summary(self, text: str) -> str:
        """Generate abstractive summary using BART."""
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

    # def generate_extractive_summary(self, text: str) -> str:
    #     """Generate extractive summary."""
    #     try:
    #         chunks = self.chunk_text(text)
    #         summaries = []

    #         for chunk in tqdm(chunks, desc="Generating extractive summary"):
    #             summary = self.extractive_summarizer(
    #                 chunk,
    #                 max_length=300,
    #                 min_length=50,
    #                 do_sample=False
    #             )[0]['summary_text']
    #             summaries.append(summary)

    #         return " ".join(summaries)

    #     except Exception as e:
    #         logger.error(f"Error generating extractive summary: {str(e)}")
    #         return ""
    # def generate_extractive_summary(self, text: str) -> str:
    #     try:
    #         chunks = self.chunk_text(text)
    #         summaries = []

    #         for chunk in tqdm(chunks, desc="Generating extractive summary"):
    #             chunk_length = len(chunk.split())
    #             max_length = min(300, int(chunk_length * 0.75))  # Adjust max_length dynamically
    #             summary = self.extractive_summarizer(
    #                 chunk,
    #                 max_length=max_length,
    #                 min_length=50,
    #                 do_sample=False
    #             )[0]['summary_text']
    #             summaries.append(summary)

    #         return " ".join(summaries)

    #     except Exception as e:
    #         logger.error(f"Error generating extractive summary: {str(e)}")
    #         return ""
        
    def save_to_pdf(self, result: Dict, output_pdf_path: str):
        try:
            pdf = FPDF()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.add_page()
            pdf.set_font("Arial", size=12)

            # Add transcription
            pdf.set_font("Arial", style="B", size=14)
            pdf.cell(0, 10, "Transcription", ln=True)
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, result.get("transcription", "No transcription available"))

            # # Add timestamps
            # if "timestamps" in result:
            #     pdf.set_font("Arial", style="B", size=14)
            #     pdf.cell(0, 10, "\nTimestamps", ln=True)
            #     pdf.set_font("Arial", size=12)
            #     for segment in result["timestamps"]:
            #         pdf.multi_cell(0, 10, f"{segment['start']} - {segment['end']}: {segment['text']}")

            # Add abstractive summary
            if "abstractive_summary" in result:
                pdf.set_font("Arial", style="B", size=14)
                pdf.cell(0, 10, "\nAbstractive Summary", ln=True)
                pdf.set_font("Arial", size=12)
                pdf.multi_cell(0, 10, result["abstractive_summary"])

            # Add extractive summary
            if "extractive_summary" in result:
                pdf.set_font("Arial", style="B", size=14)
                pdf.cell(0, 10, "\nExtractive Summary", ln=True)
                pdf.set_font("Arial", size=12)
                pdf.multi_cell(0, 10, result["extractive_summary"])

            # Save PDF
            pdf.output(output_pdf_path)
            logger.info(f"Results saved to PDF: {output_pdf_path}")
        except Exception as e:
            logger.error(f"Error saving results to PDF: {str(e)}")


    def process_video(
        self,
        video_path: str,
        summary_type: str = "both",
        output_dir: str = "/Summarization/output"
    ) -> Dict:
        """Process video and generate summary."""
        # Create output directory
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

        # Save to PDF
        pdf_path = "output/summary_results.pdf"
        summarizer.save_to_pdf(result, pdf_path)