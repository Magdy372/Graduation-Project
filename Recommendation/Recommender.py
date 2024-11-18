import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, precision_recall_curve, auc, roc_curve
import matplotlib.pyplot as plt
from tabulate import tabulate
import pickle
import spacy
import numpy as np


# Load the spaCy model
nlp = spacy.load("en_core_web_sm")


# Load datasets and combine them
datasets = ['coursera_courses.csv', 'Coursera.csv', 'edx.csv', 'Udemy.csv']
dfs = []



# Iterate through each dataset, clean, and display
for dataset in datasets:
    print(f"\nDataset: {dataset}")
    df = pd.read_csv(dataset).fillna('')

    # Display data structure
    info_df = pd.DataFrame({
        "Non-Null Count": df.notnull().sum(),
        "Data Type": df.dtypes
    })
    print(tabulate(info_df, headers="keys", tablefmt="pretty"))
    print("\nFirst Few Rows of Dataset:")
    print(tabulate(df.head(), headers="keys", tablefmt="pretty"))

    # Text preprocessing
    df['course_title'] = df['course_title'].str.lower().str.replace(r'[^a-z\s]', '', regex=True)
    df['course_skills'] = df['course_skills'].str.lower().str.replace(r'[^a-z\s]', '', regex=True)

    # Remove duplicates
    df = df.drop_duplicates(subset=['course_title', 'course_skills'])
    dfs.append(df)

# Concatenate all datasets and remove duplicates
df_combined = pd.concat(dfs, ignore_index=True).drop_duplicates()
df_combined = df_combined[['course_title', 'course_skills']]



# Define a function to expand abbreviations using NLP
def expand_abbreviation_nlp(text):
    doc = nlp(text)
    expanded_text = []
    for token in doc:
        expanded_text.append(token.text)
    return " ".join(expanded_text)

# Apply the NLP-based expansion to course_skills
df_combined['course_skills'] = df_combined['course_skills'].apply(expand_abbreviation_nlp)




# Vectorize text data
tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
tfidf_matrix = tfidf.fit_transform(df_combined['course_skills'])
with open('tfidf_vectorizer.pkl', 'wb') as f_vec:
    pickle.dump(tfidf, f_vec)


# Prepare data for model training
X = tfidf_matrix
y = df_combined['course_skills'].apply(lambda x: 1 if 'machine learning' in x else 0)



# Define models for training
models = {
    "Logistic Regression": LogisticRegression(),
    "Random Forest": RandomForestClassifier(),
    "SVM": SVC(probability=True),
    "Decision Tree": DecisionTreeClassifier(),
    "KNN": KNeighborsClassifier()
}


# Initialize a dictionary to store the metrics
model_metrics = {}



for model_name, model in models.items():
    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the model
    model.fit(X_train, y_train)

    # Make predictions and get predicted probabilities
    y_pred = model.predict(X_test)
    y_pred_prob = model.predict_proba(X_test)[:, 1]  # Get the probabilities for the positive class

    # Calculate Accuracy
    accuracy = accuracy_score(y_test, y_pred)

    # Calculate F1 Score
    f1 = f1_score(y_test, y_pred)

    # Calculate ROC-AUC
    roc_auc = roc_auc_score(y_test, y_pred_prob)

    # Calculate Precision-Recall AUC
    precision, recall, _ = precision_recall_curve(y_test, y_pred_prob)
    pr_auc = auc(recall, precision)

    # Store metrics for the model
    model_metrics[model_name] = {
        "Accuracy": accuracy,
        "F1 Score": f1,
        "ROC-AUC": roc_auc,
        "Precision-Recall AUC": pr_auc
    }

    # Save the trained model
    with open(f'{model_name.replace(" ", "_").lower()}_model.pkl', 'wb') as f:
        pickle.dump(model, f)


# Find the best model based on the average of all normalized metrics
best_model_name = max(
    model_metrics,
    key=lambda x: np.mean([model_metrics[x]["Accuracy"],
                           model_metrics[x]["F1 Score"],
                           model_metrics[x]["ROC-AUC"],
                           model_metrics[x]["Precision-Recall AUC"]])
)

print(f"\nBest Model: {best_model_name}")



# Display model accuracies
model_accuracies = [[name, f"{metrics['Accuracy']:.5f}"] for name, metrics in model_metrics.items()]
print("\nModel Accuracies:")
print(tabulate(model_accuracies, headers=["Model", "Accuracy"], tablefmt="fancy_grid"))



# Plot each evaluation metric individually for the best model
best_model_metrics = model_metrics[best_model_name]





# Plot ROC curve for the best model
fpr, tpr, _ = roc_curve(y_test, models[best_model_name].predict_proba(X_test)[:, 1])
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='b', label=f'ROC curve (AUC = {best_model_metrics["ROC-AUC"]:.4f})')
plt.plot([0, 1], [0, 1], color='gray', linestyle='--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title(f'ROC Curve for {best_model_name}')
plt.legend(loc="lower right")
plt.show()

# Plot Precision-Recall curve for the best model
precision, recall, _ = precision_recall_curve(y_test, models[best_model_name].predict_proba(X_test)[:, 1])
plt.figure(figsize=(8, 6))
plt.plot(recall, precision, color='b', label=f'PR curve (AUC = {best_model_metrics["Precision-Recall AUC"]:.4f})')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title(f'Precision-Recall Curve for {best_model_name}')
plt.legend(loc="lower left")
plt.show()




# Define the recommendation function
def recommend_courses_for_skill(user_skill, df, tfidf, threshold=0.1):
    user_skill_expanded = expand_abbreviation_nlp(user_skill)
    user_skill_vector = tfidf.transform([user_skill_expanded])
    cosine_sim = cosine_similarity(user_skill_vector, tfidf_matrix)
    sim_scores = sorted(enumerate(cosine_sim[0]), key=lambda x: x[1], reverse=True)
    matching_courses = [i[0] for i in sim_scores if i[1] > threshold]

    if not matching_courses:
        return "There are no courses matching this skill."

    # Select and format recommended courses
    recommended_courses = df.iloc[matching_courses][['course_title']]
    table_data = recommended_courses.values.tolist()
    return table_data


# User input for skill
user_skill = input("Enter your skill: ")
recommended_courses = recommend_courses_for_skill(user_skill, df_combined, tfidf)
print("\nRecommended Courses with Skills:")
# Check if recommendations exist and display them
if isinstance(recommended_courses, str):
    print(recommended_courses)
else:
    print(tabulate(recommended_courses, headers=["Course Title"], tablefmt="fancy_grid"))