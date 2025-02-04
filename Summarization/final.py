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
from rouge_score import rouge_scorer
import re
from summarizer import Summarizer  # Import BERT extractive summarizer

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicalLectureSummarizer:
    def __init__(
        self,
        model_name: str = "Ram20307/bart-finetuned-pubmed",
        whisper_model_size: str = "base",
        device: str = "cuda" if torch.cuda.is_available() else "cpu"
    ):
        self.device = device
        self.whisper_model = whisper.load_model(whisper_model_size).to(device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)
        
        # Initialize BERT extractive summarizer
        self.bert_summarizer = Summarizer()

    def extract_audio(self, video_path: str, audio_path: str) -> bool:
        """Extract audio from video with enhanced error handling."""
        try:
            if not os.path.exists(video_path):
                raise FileNotFoundError(f"Video file not found: {video_path}")

            os.makedirs(os.path.dirname(audio_path), exist_ok=True)

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
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")

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

    def preprocess_text(self, text: str) -> str:
        """Preprocess text to improve summarization quality."""
        text = text.lower()
        text = ' '.join(text.split())
        
        # Replace common medical abbreviations
        abbreviations = {
            "e.g.": "for example",
            "i.e.": "that is",
            "dr.": "doctor",
            "vs.": "versus"
        }
        for abbr, full in abbreviations.items():
            text = text.replace(abbr, full)
        
        # Remove non-alphanumeric characters (except basic punctuation)
        text = ''.join(char for char in text if char.isalnum() or char in {'.', ',', ';', ':', '!', '?', ' '})
        
        return text

    def chunk_text(self, text: str, max_chunk_size: int = 1000) -> List[str]:
        """Split text into chunks using regex-based sentence splitting."""
        try:
            # More robust sentence splitting pattern
            sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
            chunks = []
            current_chunk = []
            current_size = 0

            for sentence in sentences:
                # Clean the sentence
                sentence = sentence.strip()
                if not sentence:
                    continue
                    
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

            return chunks if chunks else [text]
            
        except Exception as e:
            logger.error(f"Error in chunk_text: {str(e)}")
            # Fallback chunking method with overlap
            words = text.split()
            chunks = []
            overlap = 50  # Words of overlap between chunks
            for i in range(0, len(words), max_chunk_size - overlap):
                chunk = words[i:i + max_chunk_size]
                chunks.append(" ".join(chunk))
            return chunks if chunks else [text]

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

    def generate_extractive_summary(self, text: str, ratio: float = 0.3) -> str:
        """Generate extractive summary using BERT extractive summarizer."""
        try:
            chunks = self.chunk_text(text)
            summaries = []

            for chunk in tqdm(chunks, desc="Generating extractive summary"):
                try:
                    # Generate summary using BERT extractive summarizer
                    summary = self.bert_summarizer(chunk, ratio=ratio)
                    if summary:
                        summaries.append(summary)
                except Exception as chunk_error:
                    logger.error(f"Error summarizing chunk: {str(chunk_error)}")
                    continue

            if not summaries:
                return text[:1000] + "..."

            # Combine summaries and remove duplicates
            combined_summary = ' '.join(summaries)
            sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', combined_summary)
            unique_sentences = list(dict.fromkeys(sentences))
            
            return ' '.join(unique_sentences)

        except Exception as e:
            logger.error(f"Error generating extractive summary: {str(e)}")
            return text[:1000] + "..."

    def save_to_pdf(self, result: Dict, output_pdf_path: str):
        """Save results to a PDF file with enhanced error handling."""
        try:
            pdf = FPDF()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.add_page()

            # Add title
            pdf.set_font("Arial", style="B", size=16)
            pdf.cell(0, 10, "Medical Lecture Summary", ln=True, align='C')
            pdf.ln(10)

            def add_section(title: str, content: str):
                try:
                    pdf.set_font("Arial", style="B", size=14)
                    pdf.cell(0, 10, title, ln=True)
                    pdf.set_font("Arial", size=12)
                    content = content.encode('latin-1', 'replace').decode('latin-1')
                    pdf.multi_cell(0, 10, content)
                    pdf.ln(5)
                except Exception as section_error:
                    logger.error(f"Error adding section {title}: {str(section_error)}")

            if "transcription" in result:
                add_section("Transcription", result["transcription"])
            if "abstractive_summary" in result:
                add_section("Abstractive Summary", result["abstractive_summary"])
            if "extractive_summary" in result:
                add_section("Extractive Summary", result["extractive_summary"])

            pdf.output(output_pdf_path)
            logger.info(f"Results saved to PDF: {output_pdf_path}")
            
        except Exception as e:
            logger.error(f"Error saving results to PDF: {str(e)}")
            try:
                pdf = FPDF()
                pdf.add_page()
                pdf.set_font("Arial", size=12)
                pdf.cell(0, 10, "Error creating full PDF - Basic version saved", ln=True)
                pdf.output(output_pdf_path)
            except:
                logger.error("Failed to save even basic PDF")

    def evaluate_summary(self, generated_summary: str, reference_summary: str) -> Dict:
        """Evaluate the generated summary using ROUGE scores."""
        scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
        try:
            scores = scorer.score(reference_summary, generated_summary)
            return {key: value.fmeasure for key, value in scores.items()}
        except Exception as e:
            logger.error(f"Error evaluating summary: {str(e)}")
            return {}
    
    def process_video(
        self,
        video_path: str,
        summary_type: str = "both",
        output_dir: str = "output",
        reference_summary: Optional[str] = None
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

        # Evaluate summaries if reference is provided
        if reference_summary:
            if "abstractive_summary" in result:
                result["abstractive_rouge"] = self.evaluate_summary(result["abstractive_summary"], reference_summary)
            if "extractive_summary" in result:
                result["extractive_rouge"] = self.evaluate_summary(result["extractive_summary"], reference_summary)

        return result


# Example usage
if __name__ == "__main__":
    summarizer = MedicalLectureSummarizer()
    result = summarizer.process_video(
        #video_path="C:/Users/dell/Downloads/test1.mp4",
        video_path = "C:/Users/dell/Desktop/Graduation-Project1/Summarization/test1.mp4",
        summary_type="both",
        output_dir="output",
        reference_summary="Picture this, a machine that could organize your cupboard just as you like it, or serve every member of the house a customized cup of coffee. These are the products of artificial intelligence. Well, these machines are artificially incorporated with human-like intelligence to perform tasks as we do. Here is a robot we built in our lab, which is now dropped onto a field. This portrays the robot's reasoning ability. After a short stroll, the robot now encounters a stream that it cannot swim across. These three capabilities make the robot artificially intelligent. Week AI, also called Narrow AI, focuses solely on one task. When you ask Alexa to play Despacito, it picks up the key words, play, and Despacito, and runs a program it is trained to. Alexa cannot respond to a question it isn't trained to answer. And that brings us to our second category of AI, Strong AI. Now, this is much like the robots that only exist in fiction as of now. Machine learning is a technique to achieve AI and deep learning in turn is a subset of machine learning. In fact, Elon Musk predicts that the human mind and body will be enhanced by AI implants, which would make us partly cyborgs. Do not forget to leave your answer to the quiz in the comment section below."  # Replace with actual reference
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

        # Print ROUGE scores
        if "abstractive_rouge" in result:
            print("Abstractive Summary ROUGE Scores:", result["abstractive_rouge"])
        if "extractive_rouge" in result:
            print("Extractive Summary ROUGE Scores:", result["extractive_rouge"])