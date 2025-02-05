from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import pandas as pd
import neattext.functions as nfx
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask App
app = Flask(__name__)
CORS(app, resources={r"/recommend": {"origins": "*", "methods": ["POST"]}})  # Allow only POST for /recommend

# Database Connection Function
def read_data_from_db():
    """Fetch course titles from MySQL database."""
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='grad',
            cursorclass=pymysql.cursors.DictCursor
        )
        query = "SELECT name FROM course;"
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchall()
        connection.close()

        return pd.DataFrame(result)
    except Exception as e:
        print("Database connection error:", e)
        return pd.DataFrame(columns=['name'])

# Data Cleaning Function
def clean_title(df):
    """Remove stopwords and special characters from course titles."""
    df['Clean_name'] = df['name'].apply(nfx.remove_stopwords)
    df['Clean_name'] = df['Clean_name'].apply(nfx.remove_special_characters)
    return df

# Cosine Similarity Calculation
def get_cosine_matrix(query, df):
    """Compute cosine similarity between input title and stored course titles."""
    count_vect = CountVectorizer()
    all_titles = df['Clean_name'].tolist() + [query]
    matrix = count_vect.fit_transform(all_titles)
    cosine_sim = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
    return cosine_sim

# Recommendation Route
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    print("Received data:", data)
    """Handle course recommendation requests."""
    titlename = data.get('course', '').strip()

    if not titlename:
        return jsonify({"status": "error", "message": "Course title is required"}), 400

    try:
        df = read_data_from_db()
        if df.empty:
            return jsonify({"status": "error", "message": "No course data available"}), 404

        df = clean_title(df)
        cleaned_input = nfx.remove_special_characters(nfx.remove_stopwords(titlename))
        cosine_sim = get_cosine_matrix(cleaned_input, df)

        # Update the DataFrame with the similarity score
        df['Similarity'] = cosine_sim

        # Exclude the course currently being recommended (i.e., the input course)
        df = df[df['Clean_name'] != cleaned_input]

        # Sort by similarity and limit to top 4 recommendations
        result_df = df[df['Similarity'] > 0].sort_values(by='Similarity', ascending=False)

        top_4_recommendations = result_df.head(4)

        recommendations = [
            {"title": row["name"], "score": row["Similarity"]} 
            for _, row in top_4_recommendations.iterrows()
        ]

        return jsonify({"status": "success", "recommendations": recommendations})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Run Flask App
if __name__ == '__main__':
    app.run(debug=True)
