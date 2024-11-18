import os
import json
import re
from datasets import load_dataset
from transformers import BartTokenizer, BartForConditionalGeneration, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
from datasets import Dataset
import torch

os.environ["WANDB_DISABLED"] = "true"

# Step 3: Load Dataset and Save it in a Folder (Train, Validation, Test Split)
def prepare_datasets():
    dataset = load_dataset("ccdv/pubmed-summarization")
    train_data = dataset["train"]
    val_data = dataset["validation"]
    test_data = dataset["test"]

    os.makedirs("data", exist_ok=True)

    def save_dataset_to_json(data, split_name):
        # Check if the file already exists to avoid saving it again
        if not os.path.exists(f"data/{split_name}.json"):
            dataset_list = [{"article": item["article"], "summary": item["abstract"]} for item in data]
            with open(f"data/{split_name}.json", "w") as json_file:
                json.dump(dataset_list, json_file, indent=4)
            print(f"Saved {split_name} dataset to 'data' folder.")
        else:
            print(f"{split_name} dataset already exists. Skipping save.")

    # Save datasets only if they don't already exist
    save_dataset_to_json(train_data, "train")
    save_dataset_to_json(val_data, "val")
    save_dataset_to_json(test_data, "test")

# Step 4: Load Dataset from JSON Files
def load_dataset_from_json(split_name):
    if not os.path.exists(f"data/{split_name}.json"):
        print(f"Dataset {split_name}.json not found. Preparing datasets...")
        prepare_datasets()
    
    with open(f"data/{split_name}.json", "r") as json_file:
        data = json.load(json_file)
    return data

# Load datasets (subset of 1000 rows for training)
train_data = load_dataset_from_json("train")
val_data = load_dataset_from_json("val")
test_data = load_dataset_from_json("test")

# Step 5: Clean the Dataset
def clean_text(text):
    # Remove in-text citations like [1], (Smith et al., 2020)
    text = re.sub(r'\[\d+\]', '', text)
    text = re.sub(r'\(.*?\d{4}\)', '', text)

    # Remove figure/table references (e.g., "Figure 1", "Table 2")
    text = re.sub(r'Figure\s*\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Table\s*\d+', '', text, flags=re.IGNORECASE)

    # Remove special characters
    text = re.sub(r'[^a-zA-Z\s]', '', text)

    # Normalize the text (lowercase and removing extra spaces)
    text = text.lower()
    text = ' '.join(text.split())

    return text

# Apply cleaning to the dataset
for entry in train_data:
    entry['article'] = clean_text(entry['article'])
    entry['summary'] = clean_text(entry['summary'])

for entry in val_data:
    entry['article'] = clean_text(entry['article'])
    entry['summary'] = clean_text(entry['summary'])

for entry in test_data:
    entry['article'] = clean_text(entry['article'])
    entry['summary'] = clean_text(entry['summary'])

# Step 6: Tokenize the Dataset
tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')

def tokenize_function(examples):
    return tokenizer(examples['article'], max_length=1024, truncation=True, padding='max_length')

def tokenize_labels(examples):
    return tokenizer(examples['summary'], max_length=150, truncation=True, padding='max_length')

# Convert the data into Dataset format and tokenize
train_dataset = Dataset.from_dict({"article": [item['article'] for item in train_data], "summary": [item['summary'] for item in train_data]})
val_dataset = Dataset.from_dict({"article": [item['article'] for item in val_data], "summary": [item['summary'] for item in val_data]})

train_dataset = train_dataset.map(lambda x: {'input_ids': tokenize_function(x)['input_ids'], 'labels': tokenize_labels(x)['input_ids']}, num_proc=4)
val_dataset = val_dataset.map(lambda x: {'input_ids': tokenize_function(x)['input_ids'], 'labels': tokenize_labels(x)['input_ids']}, num_proc=2)

# Ensure the dataset is in PyTorch format
train_dataset.set_format(type='torch', columns=['input_ids', 'labels'])
val_dataset.set_format(type='torch', columns=['input_ids', 'labels'])

# Step 7: Fine-Tune the BART Model
model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=4,                   # Adjust as needed
    per_device_train_batch_size=2,        # Adjust based on GPU memory
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=4,        # Accumulate gradients over 4 steps (to simulate larger batch size)
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,                     # Log every 10 steps
    evaluation_strategy="steps",          # Evaluate during training
    save_total_limit=2,                   # Keep only the last 2 models
    save_steps=500,
    load_best_model_at_end=True,          # Load best model when training is finished
    fp16=True,                             # Enable mixed precision for faster training
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# Start training
trainer.train()

# Save the fine-tuned model
trainer.save_model('./fine_tuned_bart_pubmed')
