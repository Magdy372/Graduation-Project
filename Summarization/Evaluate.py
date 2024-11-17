# Step 1: Install Required Libraries
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from datasets import load_dataset
from rouge_score import rouge_scorer
from tqdm import tqdm  # Import tqdm for the progress bar
import torch

# Step 2: Load the Tokenizer and Model
tokenizer = AutoTokenizer.from_pretrained("Ram20307/bart-finetuned-pubmed")
model = AutoModelForSeq2SeqLM.from_pretrained("Ram20307/bart-finetuned-pubmed")

# Step 3: Load Test Dataset and Use First 100 Rows
dataset = load_dataset("ccdv/pubmed-summarization")
test_data = dataset["test"].select(range(1))  # Select only the first 100 rows

# Check the columns to verify correct names
print("Dataset columns:", test_data.column_names)

# Step 4: Tokenization Function
def tokenize_function(examples):
    return tokenizer(examples['article'], max_length=1024, truncation=True, padding='max_length')

def tokenize_labels(examples):
    return tokenizer(examples['abstract'], max_length=150, truncation=True, padding='max_length')

# Tokenize the dataset
test_dataset = test_data.map(lambda x: {
    'input_ids': tokenize_function(x)['input_ids'],
    'labels': tokenize_labels(x)['input_ids']
}, batched=True)

# Ensure the dataset is in PyTorch format
test_dataset.set_format(type='torch', columns=['input_ids', 'labels'])

# Step 5: Generate Summaries
def generate_summaries(model, test_dataset):
    predictions = []
    references = []

    model.eval()  # Set the model to evaluation mode
    for idx, example in tqdm(enumerate(test_dataset), desc="Generating Summaries", unit="example", total=len(test_dataset)):
        # Generate summary
        input_ids = example['input_ids'].unsqueeze(0)  # Add batch dimension
        attention_mask = input_ids.ne(tokenizer.pad_token_id).long()
        output = model.generate(input_ids, attention_mask=attention_mask, num_beams=4, max_length=150, early_stopping=True)
        generated_summary = tokenizer.decode(output[0], skip_special_tokens=True)

        # Get reference summary
        target_summary = tokenizer.decode(example['labels'], skip_special_tokens=True)

        # Append to lists
        predictions.append(generated_summary)
        references.append(target_summary)

    return predictions, references

# Generate summaries
predictions, references = generate_summaries(model, test_dataset)

# Step 6: Compute ROUGE Metrics
def compute_rouge(predictions, references):
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    results = {'rouge1': [], 'rouge2': [], 'rougeL': []}

    # Compute metrics for each prediction and reference pair
    for pred, ref in zip(predictions, references):
        scores = scorer.score(ref, pred)
        for rouge_type in results.keys():
            results[rouge_type].append(scores[rouge_type])

    # Aggregate precision, recall, and F1 scores
    final_scores = {}
    for rouge_type, scores in results.items():
        precision = sum([s.precision for s in scores]) / len(scores)
        recall = sum([s.recall for s in scores]) / len(scores)
        f1 = sum([s.fmeasure for s in scores]) / len(scores)
        final_scores[rouge_type] = {'precision': precision, 'recall': recall, 'f1': f1}

    return final_scores

# Compute ROUGE scores
rouge_full_scores = compute_rouge(predictions, references)

# Step 7: Display Results
print("\nFinal ROUGE Scores with Precision, Recall, and F1:")
for rouge_type, scores in rouge_full_scores.items():
    print(f"\n{rouge_type.upper()}:")
    print(f"  Precision: {scores['precision']:.4f}")
    print(f"  Recall:    {scores['recall']:.4f}")
    print(f"  F1 Score:  {scores['f1']:.4f}")
