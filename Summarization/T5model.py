import torch
from transformers import AutoTokenizer, LongT5ForConditionalGeneration

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("Stancld/longt5-tglobal-large-16384-pubmed-3k_steps")
model = LongT5ForConditionalGeneration.from_pretrained("Stancld/longt5-tglobal-large-16384-pubmed-3k_steps", return_dict_in_generate=True)

# Check for available device (CPU or CUDA)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# Function to summarize article
def summarize_article(article: str):
    # Tokenize the input text
    input_ids = tokenizer(article, return_tensors="pt", truncation=True, max_length=4096).input_ids.to(device)

    # Generate the summary
    with torch.no_grad():
        # The `generate` method now returns a Cache object
        result = model.generate(input_ids, max_length=500, num_beams=4, length_penalty=2.0, early_stopping=True)

    # Extract the generated sequences from the Cache object
    generated_ids = result.sequences  # Access the `sequences` attribute

    # Decode the sequences correctly
    summary = tokenizer.decode(generated_ids[0], skip_special_tokens=True)

    return summary

# Input: article from user
article = input("Enter the article text: ")

# Check if article was provided
if not article:
    print("No article input provided.")
else:
    # Generate and print summary
    summary = summarize_article(article)
    print("\nSummary:")
    print(summary)
