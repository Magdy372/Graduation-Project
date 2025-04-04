import socket
from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import json
import pickle
import numpy as np
import random
from tensorflow.keras.models import load_model
from nltk.stem import WordNetLemmatizer
from bs4 import BeautifulSoup
import requests
import re
from googlesearch import search
import requests
from googlesearch import search
from bs4 import BeautifulSoup
import urllib.request
import time

# Initialize the Flask app
app = Flask(__name__)
# Eureka Configuration
EUREKA_SERVER = "http://localhost:8761/eureka"  # Eureka Server URL
SERVICE_NAME = "Chatbot-Service"  # Name to register in Eureka
SERVICE_PORT = 8099  # Flask runs on port 8099

CORS(app)  # Enable CORS for cross-origin requests from React

# Import chatbot logic (from your existing chatbot code)
lemmatizer = WordNetLemmatizer()

# Load the enhanced model and associated data
model = load_model('./mymodel_enhanced.h5')

with open('./intents.json', 'r') as file:
    intents = json.load(file)
words = pickle.load(open('./words.pkl', 'rb'))
classes = pickle.load(open('./classes.pkl', 'rb'))

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
    predictions = [{'intent': classes[r[0]], 'prob': str(r[1])} for r in results]
    return predictions



import urllib.request

def googleSearch(query):
    """Perform a Google search and return scraped text from the first viable result."""
    print(f"DEBUG: Searching Google for '{query}'...")  # Debugging line

    try:
        # Get the first search result
        search_results = search(query, num_results=5, sleep_interval=2)
        print(f"DEBUG: Google search returned results: {search_results}")  # Debugging line
        if not search_results:
            print("DEBUG: No search results returned.")  # Debugging line
            return None

        for link in search_results:
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


def get_response_nn(return_list, intents_json, user_input):
    """Retrieve a response based on the NN-predicted intent or search online if no answer is found."""
    
    if len(return_list) == 0:
        return googleSearch(user_input)  # Ensure this is correctly called!

    tag = return_list[0]['intent']
    
    # If the highest intent is a greeting, but the input is a full question, search online
    if tag in ["greeting", "hello", "hi"] and len(user_input.split()) > 2:
        return googleSearch(user_input)

    for i in intents_json['intents']:
        if tag == i['tag']:
            return random.choice(i['responses'])
    
    return googleSearch(user_input)  # Fallback if no intent matches



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
    
def response_nn(text):
    """Get response using the neural network prediction."""
    return_list = predict_class(text, model)
    res = get_response_nn(return_list, intents, text)  # Fixed line
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

def response(text):
    # Try pattern-based matching first
    pattern_resp = response_pattern(text)
    print(f"DEBUG: Pattern response: {pattern_resp}")  # Debugging line

    if pattern_resp != "I didn't understand that.":
        return pattern_resp
    else:
        # Fall back to NN-based prediction if pattern matching doesn't yield a valid response
        nn_resp = response_nn(text)
        print(f"DEBUG: NN response: {nn_resp}")  # Debugging line

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


# Define a route to handle incoming POST requests from React
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')
    print(f"DEBUG: User message: {user_message}")  # Debugging line
    bot_response = response(user_message)
    return jsonify({'response': bot_response})


# -------- EUREKA REGISTRATION FUNCTION --------
def register_with_eureka():
    """Registers Flask AI service with Eureka."""
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)

    registration_data = {
        "instance": {
            "hostName": hostname,
            "app": SERVICE_NAME.upper(),
            "ipAddr": ip_address,
            "vipAddress": SERVICE_NAME,
            "secureVipAddress": SERVICE_NAME,
            "status": "UP",
            "port": {"$": SERVICE_PORT, "@enabled": "true"},
            "dataCenterInfo": {
                "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                "name": "MyOwn"
            }
        }
    }

    headers = {"Content-Type": "application/json"}
    eureka_url = f"{EUREKA_SERVER}/apps/{SERVICE_NAME}"

    try:
        response = requests.post(eureka_url, data=json.dumps(registration_data), headers=headers)
        if response.status_code in [200, 204]:
            print(f"Successfully registered {SERVICE_NAME} with Eureka!")
        else:
            print(f"Failed to register with Eureka. Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Eureka registration error: {e}")

# -------- RUN FLASK APP & REGISTER WITH EUREKA --------
if __name__ == '__main__':
    time.sleep(5)  # Wait to ensure Eureka Server starts
    register_with_eureka()
    app.run(host='0.0.0.0', port=SERVICE_PORT, threaded=True)
