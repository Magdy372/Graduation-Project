################################################ Import Libraries  ##########################################
import cv2
import sys
import os
import numpy as np
from collections import Counter
import face_recognition
from flask import Flask, Response, render_template, jsonify, request
import threading
import time
import json
import datetime
from flask_cors import CORS
import requests
import socket

from object_detection import yoloV3Detect
from face_detection import get_face_detector, find_faces

################################################ Setup  ######################################################

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Eureka Configuration
EUREKA_SERVER = "http://localhost:8761/eureka"  # Eureka Server URL
SERVICE_NAME = "proctoring-service"  # Name to register in Eureka
SERVICE_PORT = 5000  # Flask default port

# face recognition
l = os.listdir('student_db')
known_face_encodings = []
known_face_names = []

for image in l:
    student_image = face_recognition.load_image_file('student_db/' + image)
    student_face_encoding = face_recognition.face_encodings(student_image)[0]
    known_face_encodings.append(student_face_encoding)
    known_face_names.append(image.split('.')[0])

# face detection model
face_model = get_face_detector()

# Global variables for video processing
alert_logs = []
video_capture = None
process_this_frame = False
no_of_frames_0 = 0
no_of_frames_1 = 0
no_of_frames_2 = 0
font = cv2.FONT_HERSHEY_PLAIN
flag = True
current_user_id = None
current_quiz_id = None
proctoring_active = False

# Violation trackers
violation_state = {
    "camera_hidden": {"active": False, "start_time": None},
    "banned_objects": {"active": False, "start_time": None},
    "face_recognition": {"active": False, "start_time": None},
    "tab_switching": {"active": False, "start_time": None},  # New violation type
}

def log_violation_duration(alert_type, start_time):
    end_time = datetime.datetime.now()
    duration = (end_time - start_time).total_seconds()
    violation_data = {
        "userId": current_user_id,
        "quizId": current_quiz_id,
        "violation": alert_type,
        "startTime": start_time.isoformat(),
        "endTime": end_time.isoformat(),
        "duration": duration
    }
    try:
        requests.post("http://localhost:8089/api/violations", json=violation_data)
        alert_logs.append(violation_data)
    except Exception as e:
        print("Failed to send violation to Spring Boot:", e)

def handle_violation_state(condition, alert_type, threshold_seconds=5):
    state = violation_state[alert_type]
    now = datetime.datetime.now()

    if condition:
        if not state["active"]:
            state["active"] = True
            state["start_time"] = now
        # Do not log here — wait for violation to end
    else:
        if state["active"] and state["start_time"]:
            duration = (now - state["start_time"]).total_seconds()
            if duration >= threshold_seconds:
                log_violation_duration(alert_type, state["start_time"])
            # Reset after condition ends
            state["active"] = False
            state["start_time"] = None


def generate_frames():
    global process_this_frame, no_of_frames_0, no_of_frames_1, no_of_frames_2, flag, video_capture

    if not video_capture:
        return

    while proctoring_active:
        process_this_frame = not process_this_frame

        ret, frame = video_capture.read()
        if not ret:
            break

        frame2 = frame.copy()
        frame3 = frame.copy()

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        if process_this_frame:
            try:
                ##### Object Detection #####
                try:
                    fboxes, fclasses = yoloV3Detect(small_frame)
                    to_detect = ['person', 'laptop', 'cell phone', 'book', 'tv']
                    temp2 = [fclasses[i] for i in range(len(fclasses)) if fclasses[i] in to_detect]
                    count_items = Counter(temp2)
                except Exception as e:
                    count_items = {'person': 0, 'laptop': 0, 'cell phone': 0, 'book': 0, 'tv': 0}
                    print(e)

                # Multiple Person Detection
                handle_violation_state(count_items['person'] != 1, "multiple_people")

                # Banned Object Detection
                banned_condition = (
                    count_items['laptop'] >= 1 or
                    count_items['cell phone'] >= 1 or
                    count_items['book'] >= 1 or
                    count_items['tv'] >= 1
                )
                handle_violation_state(banned_condition, "banned_objects")

                if count_items['person'] == 1:
                    #### Face Detection ####
                    faces = find_faces(small_frame, face_model)
                    if len(faces) > 0:
                        face = faces[0]
                        left, top, right, bottom = face
                    else:
                        handle_violation_state(True, "face_recognition")
                        continue

                    if flag:
                        #### Face Recognition ####
                        face_locations = [[top, right, bottom, left]]
                        rgb_small_frame = small_frame[:, :, ::-1]
                        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                        if len(face_encodings) > 0:
                            face_encoding = face_encodings[0]
                            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                            best_match_index = np.argmin(face_distances)
                            if matches[best_match_index]:
                                name = known_face_names[best_match_index]
                            else:
                                name = "Unknown"
                        else:
                            name = "Unknown"

                        flag = False

                    handle_violation_state(name == "Unknown", "face_recognition")
                else:
                    flag = True

            except Exception as e:
                print("Error in frame processing:", e)

@app.route('/get_alerts_log', methods=['GET'])
def get_alerts_log():
    return jsonify(alert_logs)

@app.route('/start_proctoring', methods=['POST'])
def start_proctoring():
    global video_capture, proctoring_active, current_user_id, current_quiz_id

    try:
        data = request.get_json()
        user_id = data.get('user_id')
        quiz_id = data.get('quiz_id')

        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        current_user_id = user_id
        current_quiz_id = quiz_id

        if not video_capture:
            video_capture = cv2.VideoCapture(0)
            if not video_capture.isOpened():
                return jsonify({'error': 'Failed to open camera'}), 500

        proctoring_active = True
        threading.Thread(target=generate_frames, daemon=True).start()

        return jsonify({'status': 'success', 'message': 'Proctoring started'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stop_proctoring', methods=['POST'])
def stop_proctoring():
    global video_capture, proctoring_active, current_user_id, current_quiz_id

    try:
        proctoring_active = False
        current_user_id = None
        current_quiz_id = None

        for alert_type, state in violation_state.items():
            if state['active']:
                log_violation_duration(alert_type, state['start_time'])
                state['active'] = False
                state['start_time'] = None

        if video_capture:
            video_capture.release()
            video_capture = None

        return jsonify({'status': 'success', 'message': 'Proctoring stopped'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_status')
def get_status():
    try:
        camera_status = 'open' if video_capture and video_capture.isOpened() else 'closed'
        return jsonify({
            'status': 'active' if proctoring_active else 'inactive',
            'camera_status': camera_status
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a route to track tab switching events
@app.route('/tab_switched', methods=['POST'])
def tab_switched():
    global current_user_id, current_quiz_id
    
    try:
        data = request.get_json()
        is_hidden = data.get('is_hidden', False)
        
        if not current_user_id or not current_quiz_id:
            return jsonify({'error': 'No active proctoring session'}), 400
            
        # Track tab switching as a violation
        handle_violation_state(is_hidden, "tab_switching")
        
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------- EUREKA REGISTRATION FUNCTION --------
def register_with_eureka():
    """Registers Flask proctoring service with Eureka."""
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

if __name__ == '__main__':
    time.sleep(5)  # Wait to ensure Eureka Server starts
    register_with_eureka()
    app.run(host='0.0.0.0', port=SERVICE_PORT, debug=True)
