################################################ Import Libraries  ##########################################
import cv2
import sys
import os
import numpy as np
from collections import Counter
import face_recognition
import json
from datetime import datetime
import logging
import time

from object_detection import yoloV3Detect
from face_detection import get_face_detector, find_faces

################################################ Setup  ######################################################

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def show_disclaimer():
    disclaimer_text = """
    ============================================
    ONLINE EXAM PROCTORING SYSTEM DISCLAIMER
    ============================================
    
    This exam is being proctored using an AI-powered system that:
    1. Monitors your presence through your camera
    2. Detects prohibited objects (phones, books, etc.)
    3. Verifies your identity through face recognition
    
    By continuing, you agree to:
    - Allow camera access for the duration of the exam
    - Maintain a clear view of your face
    - Not use any prohibited objects
    - Not switch tabs or windows
    - Not have multiple exam sessions open
    
    Violations may result in:
    - Warnings
    - Automatic exam submission
    - Disqualification from the exam
    
    The system will start in 10 seconds...
    """
    print(disclaimer_text)
    time.sleep(10)  # Give user time to read the disclaimer

# Get user ID from command line arguments
user_id = "default_user"
if len(sys.argv) > 1:
    user_id = sys.argv[1]
logger.info(f"Starting proctoring for user: {user_id}")

# Show disclaimer
show_disclaimer()

# Initialize violation log
violations = []

def signal_handler(signum, frame):
    """Handle termination signal"""
    logger.info("Received termination signal")
    raise KeyboardInterrupt

# Register signal handler
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# face recognition
try:
    l = os.listdir('student_db')
    known_face_encodings = []
    known_face_names = []
    face_locations = []
    face_encodings = []
    face_names = []

    for image in l:
        student_image = face_recognition.load_image_file('student_db/'+image)
        student_face_encoding = face_recognition.face_encodings(student_image)[0]

        known_face_encodings.append(student_face_encoding)
        known_face_names.append(image.split('.')[0])
    
    logger.info(f"Loaded {len(known_face_names)} known faces")
except Exception as e:
    logger.error(f"Error loading face database: {e}")
    known_face_encodings = []
    known_face_names = []

# face detection model
try:
    face_model = get_face_detector()
    logger.info("Face detection model loaded successfully")
except Exception as e:
    logger.error(f"Error loading face detection model: {e}")
    face_model = None

# Others
try:
    video_capture = cv2.VideoCapture(0)
    if not video_capture.isOpened():
        logger.error("Failed to open camera")
        sys.exit(1)
    logger.info("Camera opened successfully")
except Exception as e:
    logger.error(f"Error opening camera: {e}")
    sys.exit(1)

process_this_frame = False
no_of_frames_0 = 0
no_of_frames_1 = 0
no_of_frames_2 = 0
font = cv2.FONT_HERSHEY_PLAIN
flag = True

#################################################### ALERT #####################################################
def alert(condition, no_of_frames, violation_type):
    if(condition):
        no_of_frames = no_of_frames + 1
        if no_of_frames == 1:  # Log only the first occurrence of each violation
            violation = {
                'type': violation_type,
                'timestamp': datetime.now().isoformat(),
                'user_id': user_id
            }
            violations.append(violation)
            logger.warning(f"Violation detected: {violation_type} for user {user_id}")
            
            # Save violation immediately
            try:
                if not os.path.exists('violations'):
                    os.makedirs('violations')
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f'violations/proctoring_violations_{timestamp}.json'
                with open(filename, 'w') as f:
                    json.dump(violation, f, indent=2)
                logger.info(f"Violation saved to {filename}")
            except Exception as e:
                logger.error(f"Error saving violation: {e}")
    else:
        no_of_frames = 0

    return no_of_frames

#################################################### MAIN #####################################################

try:
    logger.info("Starting proctoring loop")
    while True:
        # frame skipping to save time
        process_this_frame = not process_this_frame 

        # Grab a single frame of video
        ret, frame = video_capture.read()
        if not ret:
            logger.warning("Failed to grab frame from camera")
            continue

        # Resize frame of video to 1/4 size for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Functionalities
        if process_this_frame:
            try:
                ##### Object Detection #####
                try:
                    fboxes, fclasses = yoloV3Detect(small_frame)
                    
                    to_detect = ['person', 'laptop', 'cell phone', 'book', 'tv']

                    temp1, temp2 = [], []

                    for i in range(len(fclasses)):
                        if(fclasses[i] in to_detect):
                            temp1.append(fboxes[i])
                            temp2.append(fclasses[i])
                 
                    # Counter
                    count_items = Counter(temp2)
                except Exception as e:
                    logger.error(f"Error in object detection: {e}")
                    count_items = {}
                    count_items['person'] = 0
                    count_items['laptop'] = 0
                    count_items['cell phone'] = 0
                    count_items['book'] = 0
                    count_items['tv'] = 0

                # Multiple Person Buffer
                condition = (count_items['person'] != 1)
                no_of_frames_0 = alert(condition, no_of_frames_0, 'multiple_people')

                if(count_items['person'] == 1):
                    #### face detection using OpenCV's DNN module with TensorFlow model ####
                    
                    # detect face
                    if face_model:
                        faces = find_faces(small_frame, face_model)
                        if len(faces) > 0:
                            face = faces[0]
                        else:
                            condition = (len(faces) < 1)
                            no_of_frames_2 = alert(condition, no_of_frames_2, 'no_face')
                            continue
                    else:
                        logger.warning("Face model not available, skipping face detection")
                        continue
                    
                    if(flag == True):
                        #### face verification using face_recognition library ####
                        
                        # modifying order
                        face_locations = [[top, right, bottom, left]]
                       
                        # Convert BGR image to RGB image (which face_recognition uses)
                        rgb_small_frame = small_frame[:, :, ::-1]

                        # get CNN feature vector
                        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                        # get similarity
                        face_encoding = face_encodings[0]
                        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = known_face_names[best_match_index]
                        else:
                            name = "Unknown"
                        flag = False
                    
                    # Buffer
                    condition = (name == 'Unknown')  
                    no_of_frames_2 = alert(condition, no_of_frames_2, 'unknown_face')

                else:
                    flag = True

            except Exception as e:
                logger.error(f"Error in main processing loop: {e}")

except KeyboardInterrupt:
    logger.info("\nStopping proctoring system...")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
finally:
    # Release handle to the webcam
    video_capture.release()
    logger.info("Camera released")
    
    # Save final violation record
    try:
        if not os.path.exists('violations'):
            os.makedirs('violations')
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'violations/proctoring_violations_{timestamp}.json'
        final_violation = {
            'type': 'exam_completion',
            'timestamp': datetime.now().isoformat(),
            'user_id': user_id,
            'details': 'Exam completed or proctoring stopped'
        }
        with open(filename, 'w') as f:
            json.dump(final_violation, f, indent=2)
        logger.info(f"Final violation record saved to {filename}")
    except Exception as e:
        logger.error(f"Error saving final violation record: {e}")
    
    logger.info("Proctoring system stopped")