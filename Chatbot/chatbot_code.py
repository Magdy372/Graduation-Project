import nltk
from nltk.corpus import wordnet as wn

import warnings
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    tokens = word_tokenize(text)  # Tokenization
    tokens = [lemmatizer.lemmatize(word.lower()) for word in tokens]  # Lemmatization
    return tokens

# Download necessary NLTK data
nltk.download('omw-1.4')
nltk.download('wordnet')
nltk.download('wordnet2022')

import tensorflow as tf
print(tf.__version__)

import keras
import pickle
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation
import random
import datetime
from googlesearch import search
import webbrowser
import requests
import time
from pygame import mixer
import urllib.request
import bs4 as bs

# Download additional NLTK data
nltk.download('punkt_tab')

from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import Sequential as tfSequential
from tensorflow.keras.layers import Dense as tfDense, Dropout as tfDropout
import keras

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()




import json
import pickle

words = []
classes = []
documents = []
ignore = ['?', '!', ',', "'s"]

# Load intents from the JSON file
data_file = open('./intents.json').read()
intents = json.loads(data_file)

# Tokenize each pattern and add to our documents list
for intent in intents['intents']:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize, lower case, and remove duplicates
words = [lemmatizer.lemmatize(word.lower()) for word in words if word not in ignore]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

# Save words and classes to pickle files for later use
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))





#training
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

training = []
output_empty = [0] * len(classes)

# Create training set (Bag of Words & One-hot encoding)
for doc in documents:
    bag = []
    word_patterns = doc[0]
    word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns]
    for word in words:
        bag.append(1 if word in word_patterns else 0)

    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])

# Shuffle and convert to NumPy array
random.shuffle(training)
training = np.array(training, dtype=object)

# Split training data into X (features) and y (labels)
X_train = np.array(list(training[:, 0]))  # Input features (Bag of Words)
y_train = np.array(list(training[:, 1]))  # One-hot encoded labels

# Build the enhanced neural network model
model = Sequential()

# First layer: 256 neurons, with BatchNormalization and Dropout
model.add(Dense(256, activation='relu', input_shape=(len(X_train[0]),)))

model.add(BatchNormalization())
model.add(Dropout(0.3))

# Second layer: 128 neurons
model.add(Dense(128, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.3))

# Third layer: 64 neurons
model.add(Dense(64, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.3))

# Output layer: One neuron per class with softmax activation
model.add(Dense(len(y_train[0]), activation='softmax'))

# Use Adam optimizer with a lower learning rate for more gradual updates
optimizer = Adam(learning_rate=0.0005)
model.compile(loss='categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

# Callbacks for early stopping and checkpointing the best model
early_stop = EarlyStopping(monitor='val_accuracy', patience=10, restore_best_weights=True, verbose=1)
checkpoint = ModelCheckpoint('best_model.h5', monitor='val_accuracy', save_best_only=True, verbose=1)

# Train the model using 20% of the training data for validation
history = model.fit(X_train, y_train,
                    epochs=50,
                    batch_size=8,
                    validation_split=0.2,
                    callbacks=[early_stop, checkpoint],
                    verbose=1)

# Save the final enhanced model (the best model is saved via checkpoint)
model.save('mymodel_enhanced.h5')
print("./mymodel_enhanced.h5")
import json
import pickle
import nltk
import numpy as np
import random
import requests
import time
import urllib.request
import bs4 as bs
from googlesearch import search
from pygame import mixer
from tensorflow.keras.models import load_model
from nltk.stem import WordNetLemmatizer

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

# Load the enhanced model and associated data
model = load_model('mymodel_enhanced.h5')
with open('intents.json', 'r') as file:
    intents = json.load(file)
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))

from googlesearch import search
import urllib.request
from bs4 import BeautifulSoup

def googleSearch(query):
    """Perform a Google search and return scraped text from the first viable result."""
    print(f"DEBUG: Searching Google for '{query}'...")  # Debugging line

    try:
        # Get the first search result
        for link in search(query, num_results=5, sleep_interval=2):
            print(f"DEBUG: Trying link: {link}")  # Debugging line
            if 'pdf' in link or 'youtube' in link or 'wikipedia' in link:
                continue  # Skip PDF, YouTube, and Wikipedia links

            try:
                raw_html = urllib.request.urlopen(link).read()
                soup = BeautifulSoup(raw_html, 'html.parser')

                # Extract the first 3 paragraphs as an answer
                paras = soup.find_all("p")
                text = " ".join(p.text for p in paras[:3])
                
                if text.strip():
                    return text
            except Exception as e:
                print(f"DEBUG: Error scraping {link}: {e}")  # Debugging line
                continue

    except Exception as e:
        print(f"DEBUG: Google search failed: {e}")  # Debugging line

    return None  # If no valid answer is found


def clean_up(sentence):
    """Tokenize and lemmatize a sentence."""
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def create_bow(sentence, words):
    """Convert a sentence into a bag-of-words vector."""
    sentence_words = clean_up(sentence)
    bag = [1 if word in sentence_words else 0 for word in words]
    return np.array(bag)

def predict_class(sentence, model):
    """Predict the intent class for a given sentence using the neural network model."""
    p = create_bow(sentence, words)
    res = model.predict(np.array([p]))[0]
    threshold = 0.6  # Adjust threshold as needed
    results = [[i, r] for i, r in enumerate(res) if r > threshold]
    results.sort(key=lambda x: x[1], reverse=True)

    # Debug: print prediction probabilities for each class
    print("DEBUG: NN Prediction probabilities:")
    for i, prob in enumerate(res):
        print(f"  {classes[i]}: {prob:.4f}")

    predictions = [{'intent': classes[r[0]], 'prob': str(r[1])} for r in results]
    print("DEBUG: NN Predictions:", predictions)
    return predictions

def get_response_nn(return_list, intents_json):
    """Retrieve a response based on the NN-predicted intent."""
    if len(return_list) == 0:
        tag = 'noanswer'
    else:
        tag = return_list[0]['intent']

    # Return a random response from the corresponding intent
    for i in intents_json['intents']:
        if tag == i['tag']:
            return random.choice(i['responses'])
    return "I didn't understand that."

# ---- New: Pattern-Based Matching Functions ----

def jaccard_similarity(set1, set2):
    """Compute the Jaccard similarity between two sets."""
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return 0 if union == 0 else intersection / union

def predict_intent_by_pattern(sentence, intents_json, threshold=0.5):
    """
    Compare the input sentence with each pattern in the intents using Jaccard similarity.
    Return the entire intent object (and the similarity score) for the best match if the score exceeds the threshold.
    """
    sentence_tokens = set(clean_up(sentence))
    best_intent_obj = None
    best_score = 0
    best_pattern = None

    for intent in intents_json['intents']:
        for pattern in intent['patterns']:
            pattern_tokens = set(clean_up(pattern))
            score = jaccard_similarity(sentence_tokens, pattern_tokens)
            if score > best_score:
                best_score = score
                best_intent_obj = intent
                best_pattern = pattern

    print("DEBUG: Best pattern match score:", best_score, "for pattern:", best_pattern)
    if best_score >= threshold:
        return best_intent_obj, best_score
    else:
        return None, best_score

def get_response_pattern(intent_obj):
    """Return a response from the matched intent object."""
    if intent_obj is not None:
        return random.choice(intent_obj['responses'])
    else:
        return "I didn't understand that."

# ---- Combined Response Functions ----

def response_nn(text):
    """Get response using the neural network prediction."""
    return_list = predict_class(text, model)
    res = get_response_nn(return_list, intents)
    return res

def response_pattern(text):
    """Get response using pattern-based matching."""
    intent_obj, score = predict_intent_by_pattern(text, intents)
    res = get_response_pattern(intent_obj)
    return res

def display_result(query, func):
    """Display the user's query and the chatbot's response."""
    print("You:", query)
    print("Chatbot:", func(query))

# Quick tests:
print("=== Neural Network Based Response ===")
display_result("How to prevent High Blood Pressure ?", response_nn)
display_result("What is the difference between append and extend in python", response_nn)

print("\n=== Pattern-Based Matching Response ===")
display_result("How to prevent High Blood Pressure ?", response_pattern)
display_result("What is the difference between append and extend in python", response_pattern)





def response(text):
    # Try pattern-based matching first
    pattern_resp = response_pattern(text)

    if pattern_resp != "I didn't understand that.":
        return pattern_resp
    else:
        # Fall back to NN-based prediction if pattern matching doesn't yield a valid response
        nn_resp = response_nn(text)

        if nn_resp != "I didn't understand that.":
            return nn_resp
        else:
            print("DEBUG: NN and pattern-based responses failed. Calling googleSearch()...")
            # If both pattern matching and NN predictions fail, perform a web search
            web_resp = googleSearch(text)
            print("DEBUG: Web search result:", web_resp)  # Debugging line
            if web_resp:
                return web_resp
            else:
                return "I couldn't find an answer to that. Would you like to try again?"

while True:
    x = input("You: ")
    print("Chatbot:", response(x))
    if x.lower() in ['bye', 'goodbye', 'exit', 'see you']:
        break