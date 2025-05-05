import cv2  # Import OpenCV for image processing and deep learning model execution
import numpy as np  # Import NumPy for numerical operations and handling image arrays

def get_face_detector(modelFile=None, configFile=None):
    """
    Loads a face detection model using OpenCV's DNN module with TensorFlow model.
    
    Parameters:
    modelFile : str, optional
        Path to the model file (.pb). If None, defaults are used.
    configFile : str, optional
        Path to the configuration file (.pbtxt). If None, defaults are used.
    
    Returns:
    model : cv2.dnn_Net
        The loaded face detection model.
    """
    # Use TensorFlow-based model
    if modelFile is None:
        modelFile = "models/opencv_face_detector_uint8.pb"
    if configFile is None:
        configFile = "models/opencv_face_detector.pbtxt"
    model = cv2.dnn.readNetFromTensorflow(modelFile, configFile)
    
    return model  # Return the loaded model

def find_faces(img, model):
    """
    Detects faces in the given image using the provided face detection model.
    
    Parameters:
    img : np.ndarray
        The input image in which faces need to be detected.
    model : cv2.dnn_Net
        The face detection model loaded by get_face_detector().
    
    Returns:
    faces : list
        A list of bounding box coordinates for detected faces.
    """
    h, w = img.shape[:2]  # Get the height and width of the image
    
    # Preprocess the image: resize to 300x300, normalize, and convert to a blob
    blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0, 
                                 (300, 300), (104.0, 177.0, 123.0))
    
    model.setInput(blob)  # Set the preprocessed image as input to the model
    res = model.forward()  # Perform forward pass to get face detection results
    
    faces = []  # Initialize an empty list to store detected face coordinates
    
    # Loop through all detected objects
    for i in range(res.shape[2]):
        confidence = res[0, 0, i, 2]  # Extract confidence score for the detection
        if confidence > 0.9:  # Consider detection valid if confidence > 50%
            # Extract bounding box coordinates, scale them back to original image size
            box = res[0, 0, i, 3:7] * np.array([w, h, w, h])
            (x, y, x1, y1) = box.astype("int")  # Convert coordinates to integers
            faces.append([x, y, x1, y1])  # Append face coordinates to the list
    
    return faces  # Return the list of detected faces

def draw_faces(img, faces):
    """
    Draws bounding boxes around detected faces on the given image.
    
    Parameters:
    img : np.ndarray
        The image on which faces should be highlighted.
    faces : list
        List of bounding box coordinates for detected faces.
    
    Returns:
    None
    """
    for x, y, x1, y1 in faces:  # Loop through all detected face coordinates
        cv2.rectangle(img, (x, y), (x1, y1), (0, 0, 255), 3)  # Draw red rectangle