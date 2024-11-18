import torch
from transformers import BartTokenizer, BartForConditionalGeneration

# Step 1: Load the BART model and tokenizer
def load_bart_model():
    model = BartForConditionalGeneration.from_pretrained('facebook/bart-large')
    model.to(device)
    return model

# Load the tokenizer
tokenizer = BartTokenizer.from_pretrained('facebook/bart-large')

# Step 2: Summarization function using BART
def summarize_article_with_bart(article, model, tokenizer):
    # Tokenize the input article and move tensors to the appropriate device (GPU/CPU)
    inputs = tokenizer([article], max_length=1024, return_tensors="pt", truncation=True, padding=True).to(device)
    
    # Generate summary with adjusted parameters
    summary_ids = model.generate(
        inputs['input_ids'], 
        max_length=200,        # Maximum length of the summary
        num_beams=5,           # Number of beams for beam search (improves quality)
        length_penalty=2.0,    # Encourages longer summaries
        early_stopping=True,   # Stops when all beams finish
        no_repeat_ngram_size=3 # Prevents repetition of 3-gram sequences
    )
    
    # Decode the summary and return it
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# Step 3: Main execution for entering an article and generating the summary
if __name__ == "__main__":
    # Check if GPU is available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = load_bart_model()

    # Input: article from user
    article = input("Enter the article text: ")

    # Generate the summary
    summary = summarize_article_with_bart(article, model, tokenizer)
    
    # Print the generated summary
    print("\nSummary:")
    print(summary)
