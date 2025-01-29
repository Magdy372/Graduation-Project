# # Step 1: Install Required Libraries
# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
# from datasets import load_dataset
# from rouge_score import rouge_scorer
# from tqdm import tqdm  # Import tqdm for the progress bar
# import torch

# # Step 2: Load the Tokenizer and Model
# tokenizer = AutoTokenizer.from_pretrained("Ram20307/bart-finetuned-pubmed")
# model = AutoModelForSeq2SeqLM.from_pretrained("Ram20307/bart-finetuned-pubmed")

# # Step 3: Load Test Dataset and Use First 100 Rows
# dataset = load_dataset("ccdv/pubmed-summarization")
# test_data = dataset["test"].select(range(1))  # Select only the first 100 rows

# # Check the columns to verify correct names
# print("Dataset columns:", test_data.column_names)

# # Step 4: Tokenization Function
# def tokenize_function(examples):
#     return tokenizer(examples['article'], max_length=1024, truncation=True, padding='max_length')

# def tokenize_labels(examples):
#     return tokenizer(examples['abstract'], max_length=150, truncation=True, padding='max_length')

# # Tokenize the dataset
# test_dataset = test_data.map(lambda x: {
#     'input_ids': tokenize_function(x)['input_ids'],
#     'labels': tokenize_labels(x)['input_ids']
# }, batched=True)

# # Ensure the dataset is in PyTorch format
# test_dataset.set_format(type='torch', columns=['input_ids', 'labels'])

# # Step 5: Generate Summaries
# def generate_summaries(model, test_dataset):
#     predictions = []
#     references = []

#     model.eval()  # Set the model to evaluation mode
#     for idx, example in tqdm(enumerate(test_dataset), desc="Generating Summaries", unit="example", total=len(test_dataset)):
#         # Generate summary
#         input_ids = example['input_ids'].unsqueeze(0)  # Add batch dimension
#         attention_mask = input_ids.ne(tokenizer.pad_token_id).long()
#         output = model.generate(input_ids, attention_mask=attention_mask, num_beams=4, max_length=150, early_stopping=True)
#         generated_summary = tokenizer.decode(output[0], skip_special_tokens=True)

#         # Get reference summary
#         target_summary = tokenizer.decode(example['labels'], skip_special_tokens=True)

#         # Append to lists
#         predictions.append(generated_summary)
#         references.append(target_summary)

#     return predictions, references

# # Generate summaries
# predictions, references = generate_summaries(model, test_dataset)

# # Step 6: Compute ROUGE Metrics
# def compute_rouge(predictions, references):
#     scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
#     results = {'rouge1': [], 'rouge2': [], 'rougeL': []}

#     # Compute metrics for each prediction and reference pair
#     for pred, ref in zip(predictions, references):
#         scores = scorer.score(ref, pred)
#         for rouge_type in results.keys():
#             results[rouge_type].append(scores[rouge_type])

#     # Aggregate precision, recall, and F1 scores
#     final_scores = {}
#     for rouge_type, scores in results.items():
#         precision = sum([s.precision for s in scores]) / len(scores)
#         recall = sum([s.recall for s in scores]) / len(scores)
#         f1 = sum([s.fmeasure for s in scores]) / len(scores)
#         final_scores[rouge_type] = {'precision': precision, 'recall': recall, 'f1': f1}

#     return final_scores

# # Compute ROUGE scores
# rouge_full_scores = compute_rouge(predictions, references)

# # Step 7: Display Results
# print("\nFinal ROUGE Scores with Precision, Recall, and F1:")
# for rouge_type, scores in rouge_full_scores.items():
#     print(f"\n{rouge_type.upper()}:")
#     print(f"  Precision: {scores['precision']:.4f}")
#     print(f"  Recall:    {scores['recall']:.4f}")
#     print(f"  F1 Score:  {scores['f1']:.4f}")

from rouge_score import rouge_scorer
import spacy
from collections import Counter
import os
from typing import Dict, Tuple

class SummaryFileEvaluator:
    def __init__(self, output_dir: str = "output"):
        self.output_dir = output_dir
        self.rouge_scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
        # Use the standard English model instead
        self.nlp = spacy.load('en_core_web_sm')
        
    def read_files(self) -> Tuple[str, str, str]:
        """Read the transcription and summary files from output directory."""
        try:
            # Read transcription
            with open(os.path.join(self.output_dir, "transcription.txt"), "r", encoding="utf-8") as f:
                transcription = f.read().strip()
            
            # Read extractive summary
            with open(os.path.join(self.output_dir, "extractive_summary.txt"), "r", encoding="utf-8") as f:
                extractive = f.read().strip()
            
            # Read abstractive summary
            with open(os.path.join(self.output_dir, "abstractive_summary.txt"), "r", encoding="utf-8") as f:
                abstractive = f.read().strip()
                
            return transcription, extractive, abstractive
            
        except FileNotFoundError as e:
            print(f"Error: Could not find one or more required files in {self.output_dir}")
            print(f"Make sure transcription.txt, extractive_summary.txt, and abstractive_summary.txt exist")
            raise e
            
    def evaluate_key_terms(self, original_text: str, summary: str) -> Dict:
        """Evaluate terminology retention using standard NLP features."""
        original_doc = self.nlp(original_text)
        summary_doc = self.nlp(summary)
        
        # Extract entities and noun phrases as key terms
        def get_key_terms(doc):
            terms = []
            # Get named entities
            terms.extend([ent.text.lower() for ent in doc.ents])
            # Get noun chunks (phrases)
            terms.extend([chunk.text.lower() for chunk in doc.noun_chunks])
            return terms
        
        original_terms = Counter(get_key_terms(original_doc))
        summary_terms = Counter(get_key_terms(summary_doc))
        
        # Calculate retention metrics
        retained = sum((summary_terms & original_terms).values())
        total = sum(original_terms.values())
        
        return {
            "retention_rate": retained / total if total > 0 else 0,
            "total_terms": total,
            "retained_terms": retained,
            "missed_terms": list(set(original_terms) - set(summary_terms))
        }
    
    def evaluate_summaries(self) -> Dict:
        """Evaluate both summaries and compare their performance."""
        # Read files
        original, extractive, abstractive = self.read_files()
        
        # Calculate ROUGE scores
        extractive_rouge = self.rouge_scorer.score(original, extractive)
        abstractive_rouge = self.rouge_scorer.score(original, abstractive)
        
        # Evaluate key terms
        extractive_terms = self.evaluate_key_terms(original, extractive)
        abstractive_terms = self.evaluate_key_terms(original, abstractive)
        
        # Calculate summary lengths and compression ratios
        original_length = len(original.split())
        extractive_length = len(extractive.split())
        abstractive_length = len(abstractive.split())
        
        results = {
            "extractive": {
                "rouge_scores": {
                    "rouge1": round(extractive_rouge['rouge1'].fmeasure, 4),
                    "rouge2": round(extractive_rouge['rouge2'].fmeasure, 4),
                    "rougeL": round(extractive_rouge['rougeL'].fmeasure, 4)
                },
                "key_terms": extractive_terms,
                "length": extractive_length,
                "compression_ratio": round(extractive_length / original_length, 4)
            },
            "abstractive": {
                "rouge_scores": {
                    "rouge1": round(abstractive_rouge['rouge1'].fmeasure, 4),
                    "rouge2": round(abstractive_rouge['rouge2'].fmeasure, 4),
                    "rougeL": round(abstractive_rouge['rougeL'].fmeasure, 4)
                },
                "key_terms": abstractive_terms,
                "length": abstractive_length,
                "compression_ratio": round(abstractive_length / original_length, 4)
            }
        }
        
        # Determine which summary is better
        extractive_score = (
            results["extractive"]["rouge_scores"]["rouge1"] +
            results["extractive"]["rouge_scores"]["rouge2"] +
            results["extractive"]["key_terms"]["retention_rate"] * 2
        )
        
        abstractive_score = (
            results["abstractive"]["rouge_scores"]["rouge1"] +
            results["abstractive"]["rouge_scores"]["rouge2"] +
            results["abstractive"]["key_terms"]["retention_rate"] * 2
        )
        
        results["recommendation"] = {
            "better_method": "extractive" if extractive_score > abstractive_score else "abstractive",
            "confidence": "strong" if abs(extractive_score - abstractive_score) > 0.5 else "slight",
            "extractive_score": round(extractive_score, 4),
            "abstractive_score": round(abstractive_score, 4)
        }
        
        return results

def print_evaluation_report(results: Dict):
    """Print a formatted evaluation report."""
    print("\n=== Summary Evaluation Report ===\n")
    
    print("Extractive Summary:")
    print(f"- ROUGE-1: {results['extractive']['rouge_scores']['rouge1']:.2%}")
    print(f"- ROUGE-2: {results['extractive']['rouge_scores']['rouge2']:.2%}")
    print(f"- ROUGE-L: {results['extractive']['rouge_scores']['rougeL']:.2%}")
    print(f"- Key Terms Retention: {results['extractive']['key_terms']['retention_rate']:.2%}")
    print(f"- Compression Ratio: {results['extractive']['compression_ratio']:.2%}")
    
    print("\nAbstractive Summary:")
    print(f"- ROUGE-1: {results['abstractive']['rouge_scores']['rouge1']:.2%}")
    print(f"- ROUGE-2: {results['abstractive']['rouge_scores']['rouge2']:.2%}")
    print(f"- ROUGE-L: {results['abstractive']['rouge_scores']['rougeL']:.2%}")
    print(f"- Key Terms Retention: {results['abstractive']['key_terms']['retention_rate']:.2%}")
    print(f"- Compression Ratio: {results['abstractive']['compression_ratio']:.2%}")
    
    print("\nRecommendation:")
    print(f"The {results['recommendation']['better_method']} summary performs better")
    print(f"Confidence: {results['recommendation']['confidence']}")

# Example usage
if __name__ == "__main__":
    try:
        evaluator = SummaryFileEvaluator()
        results = evaluator.evaluate_summaries()
        print_evaluation_report(results)
        
        # Save the results
        with open("output/evaluation_results.txt", "w", encoding="utf-8") as f:
            f.write("=== Summary Evaluation Results ===\n\n")
            f.write(f"Recommended Method: {results['recommendation']['better_method']}\n")
            f.write(f"Confidence: {results['recommendation']['confidence']}\n")
            f.write(f"Extractive Score: {results['recommendation']['extractive_score']}\n")
            f.write(f"Abstractive Score: {results['recommendation']['abstractive_score']}\n")
            
    except Exception as e:
        print(f"Error during evaluation: {str(e)}")