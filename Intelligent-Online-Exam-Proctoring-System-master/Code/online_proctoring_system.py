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

from object_detection import yoloV3Detect
from face_detection import get_face_detector, find_faces

################################################ Setup  ######################################################

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# face recognition
l = os.listdir('student_db')
known_face_encodings = []
known_face_names = []
face_locations = []
face_encodings = []
face_names = []

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
current_alerts = {
    "multiple_people": False,
    "banned_objects": False,
    "face_recognition": False
}
proctoring_active = False
current_user_id = None

#################################################### ALERT #####################################################
def log_violation(alert_type):
    alert_logs.append({
        "timestamp": datetime.datetime.now().isoformat(),
        "user_id": current_user_id,
        "violation": alert_type
    })

def alert(condition, no_of_frames):
    if condition:
        no_of_frames += 1
    else:
        no_of_frames = 0
    return no_of_frames

def generate_frames():
    global process_this_frame, no_of_frames_0, no_of_frames_1, no_of_frames_2, flag, current_alerts, video_capture

    if not video_capture:
        return

    while proctoring_active:
        process_this_frame = not process_this_frame

        ret, frame = video_capture.read()
        if not ret:
            break

        frame2 = frame.copy()
        frame3 = frame.copy()
        report = np.zeros((frame3.shape[0], frame3.shape[1], 3), np.uint8)

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        if process_this_frame:
            try:
                ##### Object Detection #####
                try:
                    fboxes, fclasses = yoloV3Detect(small_frame)

                    to_detect = ['person', 'laptop', 'cell phone', 'book', 'tv']
                    temp1, temp2 = [], []

                    for i in range(len(fclasses)):
                        if fclasses[i] in to_detect:
                            temp1.append(fboxes[i])
                            temp2.append(fclasses[i])

                    count_items = Counter(temp2)
                except Exception as e:
                    count_items = {'person': 0, 'laptop': 0, 'cell phone': 0, 'book': 0, 'tv': 0}
                    print(e)

                # Multiple Person Detection (with repeated logging)
                condition = (count_items['person'] != 1)
                no_of_frames_0 = alert(condition, no_of_frames_0)
                if no_of_frames_0 > 10:
                    log_violation("multiple_people")
                    no_of_frames_0 = 0  # reset to allow re-logging

                # Banned Object Detection (with repeated logging)
                condition = (
                    count_items['laptop'] >= 1 or
                    count_items['cell phone'] >= 1 or
                    count_items['book'] >= 1 or
                    count_items['tv'] >= 1
                )
                no_of_frames_1 = alert(condition, no_of_frames_1)
                if no_of_frames_1 > 5:
                    log_violation("banned_objects")
                    no_of_frames_1 = 0  # reset to allow re-logging

                if count_items['person'] == 1:
                    #### Face Detection ####
                    faces = find_faces(small_frame, face_model)
                    if len(faces) > 0:
                        face = faces[0]
                        left, top, right, bottom = face
                    else:
                        condition = (len(faces) < 1)
                        no_of_frames_2 = alert(condition, no_of_frames_2)
                        if no_of_frames_2 > 10:
                            log_violation("face_recognition")
                            no_of_frames_2 = 0
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

                    condition = (name == "Unknown")
                    no_of_frames_2 = alert(condition, no_of_frames_2)
                    if no_of_frames_2 > 10:
                        log_violation("face_recognition")
                        no_of_frames_2 = 0  # reset
                else:
                    flag = True

            except Exception as e:
                print("Error in frame processing:", e)

@app.route('/get_alerts_log', methods=['GET'])
def get_alerts_log():
    return jsonify(alert_logs)

@app.route('/start_proctoring', methods=['POST'])
def start_proctoring():
    global video_capture, proctoring_active, current_user_id

    try:
        data = request.get_json()
        user_id = data.get('user_id')

        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        current_user_id = user_id

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
    global video_capture, proctoring_active, current_user_id

    try:
        proctoring_active = False
        current_user_id = None

        if video_capture:
            video_capture.release()
            video_capture = None

        return jsonify({'status': 'success', 'message': 'Proctoring stopped'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_status')
def get_status():
    global video_capture, proctoring_active

    try:
        camera_status = 'open' if video_capture and video_capture.isOpened() else 'closed'
        return jsonify({
            'status': 'active' if proctoring_active else 'inactive',
            'camera_status': camera_status,
            'alerts': current_alerts
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
