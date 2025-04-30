from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import cv2
import numpy as np
import face_recognition
import json
from datetime import datetime
import logging
import os
from object_detection import yoloV3Detect
from face_detection import get_face_detector, find_faces
from collections import Counter
import threading
import time

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global variables
face_model = None
known_face_encodings = []
known_face_names = []
violations = []
camera = None
camera_lock = threading.Lock()
is_proctoring_active = False
current_user_id = None

def initialize_face_recognition():
    global face_model, known_face_encodings, known_face_names
    try:
        # Load face detection model
        face_model = get_face_detector()
        logger.info("Face detection model loaded successfully")

        # Load known faces
        if os.path.exists('student_db'):
            for image in os.listdir('student_db'):
                student_image = face_recognition.load_image_file('student_db/'+image)
                student_face_encoding = face_recognition.face_encodings(student_image)[0]
                known_face_encodings.append(student_face_encoding)
                known_face_names.append(image.split('.')[0])
            logger.info(f"Loaded {len(known_face_names)} known faces")
    except Exception as e:
        logger.error(f"Error initializing face recognition: {e}")

def process_frame(frame, user_id):
    global violations
    
    # Resize frame for faster processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    
    # Object detection
    try:
        fboxes, fclasses = yoloV3Detect(small_frame)
        to_detect = ['person', 'laptop', 'cell phone', 'book', 'tv']
        detected_objects = [fclasses[i] for i in range(len(fclasses)) if fclasses[i] in to_detect]
        count_items = Counter(detected_objects)
    except Exception as e:
        logger.error(f"Error in object detection: {e}")
        count_items = {}
    
    # Face detection and recognition
    face_violation = False
    if face_model and count_items.get('person', 0) == 1:
        faces = find_faces(small_frame, face_model)
        if len(faces) > 0:
            face = faces[0]
            # Face recognition
            rgb_small_frame = small_frame[:, :, ::-1]
            face_encodings = face_recognition.face_encodings(rgb_small_frame, [face])
            if face_encodings:
                matches = face_recognition.compare_faces(known_face_encodings, face_encodings[0])
                if not any(matches):
                    face_violation = True
        else:
            face_violation = True
    
    # Check for violations
    violations_detected = {
        'multiple_people': count_items.get('person', 0) != 1,
        'prohibited_objects': any(obj in count_items for obj in ['cell phone', 'book']),
        'face_violation': face_violation
    }
    
    # Log violations
    for violation_type, detected in violations_detected.items():
        if detected:
            violation = {
                'type': violation_type,
                'timestamp': datetime.now().isoformat(),
                'user_id': user_id
            }
            violations.append(violation)
            logger.warning(f"Violation detected: {violation_type} for user {user_id}")
    
    return violations_detected

def start_camera():
    global camera
    with camera_lock:
        if camera is None or not camera.isOpened():
            camera = cv2.VideoCapture(0)
            if not camera.isOpened():
                logger.error("Failed to open camera")
                return False
            logger.info("Camera opened successfully")
    return True

def stop_camera():
    global camera
    with camera_lock:
        if camera is not None:
            camera.release()
            camera = None
            logger.info("Camera released")

def proctoring_loop():
    global is_proctoring_active, current_user_id
    while is_proctoring_active:
        with camera_lock:
            if camera is None or not camera.isOpened():
                time.sleep(1)
                continue
            
            ret, frame = camera.read()
            if not ret:
                logger.warning("Failed to grab frame from camera")
                time.sleep(1)
                continue
        
        process_frame(frame, current_user_id)
        time.sleep(0.1)  # Process at ~10 FPS

@app.route('/start_proctoring', methods=['POST'])
def start_proctoring():
    global is_proctoring_active, current_user_id
    if not request.json or 'user_id' not in request.json:
        return jsonify({'error': 'User ID is required'}), 400
    
    if not start_camera():
        return jsonify({'error': 'Camera could not be opened'}), 500
    
    current_user_id = request.json['user_id']
    is_proctoring_active = True
    threading.Thread(target=proctoring_loop, daemon=True).start()
    
    return jsonify({
        'message': 'Proctoring started',
        'status': 'active'
    }), 200

@app.route('/stop_proctoring', methods=['POST'])
def stop_proctoring():
    global is_proctoring_active, current_user_id, violations
    try:
        is_proctoring_active = False
        current_user_id = None
        stop_camera()
        
        # Clear violations for this session
        violations = []
        
        return jsonify({
            'message': 'Proctoring stopped',
            'status': 'inactive'
        }), 200
    except Exception as e:
        logger.error(f"Error stopping proctoring: {e}")
        return jsonify({
            'error': 'Failed to stop proctoring',
            'status': 'error'
        }), 500

@app.route('/get_violations', methods=['GET'])
def get_violations():
    return jsonify({'violations': violations}), 200

@app.route('/get_status', methods=['GET'])
def get_status():
    return jsonify({
        'status': 'active' if is_proctoring_active else 'inactive',
        'camera_status': 'open' if camera is not None and camera.isOpened() else 'closed'
    }), 200

if __name__ == '__main__':
    initialize_face_recognition()
    app.run(debug=True)
