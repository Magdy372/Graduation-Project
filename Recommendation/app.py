from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import pandas as pd
import neattext.functions as nfx
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import socket
import json
import requests
import time

# Initialize Flask App
app = Flask(__name__)
CORS(app, resources={r"/recommend": {"origins": "*", "methods": ["POST"]}})  # Allow only POST for /recommend

# Eureka Configuration
EUREKA_SERVER = "http://localhost:8761/eureka"  # Eureka Server URL
SERVICE_NAME = "recommendation-service"  # Name to register in Eureka
SERVICE_PORT = 5001  # Flask runs on port 5001

# -------- EUREKA REGISTRATION FUNCTION --------
def register_with_eureka():
    """Registers Flask recommendation service with Eureka."""
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

# Database Connection Function
def read_data_from_db():
    """Fetch course names and descriptions from MySQL database."""
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='grad',
            cursorclass=pymysql.cursors.DictCursor
        )
        query = "SELECT * FROM course;"
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchall()
        connection.close()

        return pd.DataFrame(result)
    except Exception as e:
        print("Database connection error:", e)
        return pd.DataFrame(columns=['name', 'description','image_url'])

# Data Cleaning Function
def clean_description(df):
    """Remove stopwords and special characters from course descriptions."""
    df['Clean_description'] = df['description'].astype(str).apply(nfx.remove_stopwords)
    df['Clean_description'] = df['Clean_description'].apply(nfx.remove_special_characters)
    return df

# Cosine Similarity Calculation
def get_cosine_matrix(query, df):
    """Compute cosine similarity between input description and stored course descriptions."""
    count_vect = CountVectorizer()
    all_descriptions = df['Clean_description'].tolist() + [query]
    matrix = count_vect.fit_transform(all_descriptions)
    cosine_sim = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
    return cosine_sim

@app.route('/recommend', methods=['POST'])
def recommend():
    """Handle course recommendation requests based on description similarity."""
    data = request.get_json()
    print("Received data:", data)

    description_input = data.get('course', '').strip()

    if not description_input:
        return jsonify({"status": "error", "message": "Course description is required"}), 400

    try:
        df = read_data_from_db()
        if df.empty:
            return jsonify({"status": "error", "message": "No course data available"}), 404

        df = clean_description(df)
        cleaned_input = nfx.remove_special_characters(nfx.remove_stopwords(description_input))
        cosine_sim = get_cosine_matrix(cleaned_input, df)

        # Add similarity scores to the DataFrame
        df['Similarity'] = cosine_sim

        # Exclude the course currently being recommended (i.e., the input course)
        df = df[df['Clean_description'] != cleaned_input]

        # Sort by similarity and limit to top 4 recommendations
        result_df = df[df['Similarity'] > 0].sort_values(by='Similarity', ascending=False)

        top_4_recommendations = result_df.head(4)

        recommendations = [
            {
                "name": row["name"], 
                "score": round(row["Similarity"], 4),
                "imageUrl": row["image_url"]  # Include image URL in response
            }
            for _, row in top_4_recommendations.iterrows()
        ]

        return jsonify({"status": "success", "recommendations": recommendations})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



# Run Flask App & Register with Eureka
if __name__ == '__main__':
    time.sleep(5)  # Wait to ensure Eureka Server starts
    register_with_eureka()
    app.run(host='0.0.0.0', port=SERVICE_PORT, debug=True)
