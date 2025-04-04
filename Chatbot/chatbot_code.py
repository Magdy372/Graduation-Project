import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import tensorflow as tf
import numpy as np
import random
import json
import pickle
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, LearningRateScheduler
from sklearn.model_selection import train_test_split

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

# Download necessary NLTK data
nltk.download('omw-1.4')
nltk.download('wordnet')
nltk.download('punkt')

# Tokenization and Lemmatization Function
def preprocess_text(text):
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(word.lower()) for word in tokens]
    return tokens

# Load intents from the JSON file
data_file = open('./intents.json').read()
intents = json.loads(data_file)

# Create word and class lists
words = []
classes = []
documents = []
ignore = ['?', '!', ',', "'s"]

for intent in intents['intents']:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize words and remove duplicates
words = [lemmatizer.lemmatize(word.lower()) for word in words if word not in ignore]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

# Save words and classes to pickle files
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

# Create training data (Bag of Words & One-hot encoding)
training = []
output_empty = [0] * len(classes)

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

# Split into input (X) and output (y)
X_train = np.array(list(training[:, 0]))
y_train = np.array(list(training[:, 1]))

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_train, y_train, test_size=0.2, random_state=42)

# Define the optimizer
optimizer = Adam(learning_rate=0.001)

# Build the neural network model
model = Sequential()
model.add(Dense(512, activation='relu', input_shape=(len(X_train[0]),)))
model.add(BatchNormalization())
model.add(Dropout(0.4))  # Increased dropout to reduce overfitting
model.add(Dense(256, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.4))
model.add(Dense(128, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.4))
# Set the output layer size to match the number of classes
model.add(Dense(len(classes), activation='softmax'))

# Compile the model
model.compile(loss='categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

# Learning Rate Scheduler function
def lr_scheduler(epoch, lr):
    if epoch % 10 == 0 and epoch > 0:
        lr = lr * 0.7  # Reduce learning rate by 30% every 10 epochs
    return lr

# Callbacks: EarlyStopping, ModelCheckpoint, and Learning Rate Scheduler
early_stop = EarlyStopping(monitor='val_accuracy', patience=10, restore_best_weights=True, verbose=1)
checkpoint = ModelCheckpoint('best_model.h5', monitor='val_accuracy', save_best_only=True, verbose=1)
lr_callback = LearningRateScheduler(lr_scheduler)

# Fit the model
history = model.fit(X_train, y_train, epochs=19, batch_size=8, validation_split=0.2,
                    callbacks=[early_stop, checkpoint, lr_callback], verbose=1)

# Save the trained model
model.save('mymodel_no_glove.h5')

# Evaluate the model on the test set
test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {test_accuracy * 100:.2f}%")

# Load the intents file and pickle files for words and classes
with open('intents.json', 'r') as file:
    intents = json.load(file)
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
