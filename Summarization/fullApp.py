import ffmpeg
import whisper
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Step 1: Extract Audio from Video
def extract_audio(video_path, audio_path):
    try:
        ffmpeg.input(video_path).output(audio_path).run(overwrite_output=True)
        print(f"Audio extracted successfully and saved to: {audio_path}")
    except Exception as e:
        print(f"Error extracting audio: {e}")

# Step 2: Transcribe Audio using Whisper
def transcribe_audio(audio_path, model_size="base"):
    try:
        model = whisper.load_model(model_size)
        result = model.transcribe(audio_path)
        print("Transcription completed successfully.")
        return result['text']
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

# Step 3: Summarize Transcribed Text using BART
# Load the Tokenizer and Model for BART
tokenizer = AutoTokenizer.from_pretrained("Ram20307/bart-finetuned-pubmed")
model = AutoModelForSeq2SeqLM.from_pretrained("Ram20307/bart-finetuned-pubmed")

# Function to generate summary
def generate_summary(article_text):
    # Tokenize the article
    inputs = tokenizer(article_text, return_tensors="pt", max_length=1024, truncation=True, padding='max_length')

    # Generate the summary using beam search for diversity
    summary_ids = model.generate(inputs['input_ids'], num_beams=4, max_length=300, early_stopping=True)

    # Decode the summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# Main function
if __name__ == "__main__":
    video_file = "./test1.mp4"  # Path to the input video file
    audio_file = "audio.wav"    # Output path for extracted audio

    # Step 1: Extract audio from the video
    extract_audio(video_file, audio_file)
    
    # Step 2: Transcribe audio to text
    transcription = transcribe_audio(audio_file)
    
    if transcription:
        print("\nTranscription:\n", transcription)
        
        # Step 3: Generate a summary from the transcribed text
        summary = generate_summary(transcription)
        print("\nGenerated Summary:\n", summary)
    else:
        print("Audio transcription failed, no summary generated.")
