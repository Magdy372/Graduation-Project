################################################ Import Libraries  ##########################################
import cv2
import sys
import os
import numpy as np
from collections import Counter

from object_detection import yoloV3Detect
from face_detection import get_face_detector, find_faces

################################################ Setup  ######################################################

# face detection model
face_model = get_face_detector()

# Others
video_capture = cv2.VideoCapture(0)
process_this_frame = False
no_of_frames_0 = 0
no_of_frames_1 = 0
font = cv2.FONT_HERSHEY_PLAIN

#################################################### ALERT #####################################################
def alert(condition, no_of_frames):
    if(condition):
        no_of_frames = no_of_frames + 1
    else:
        no_of_frames = 0

    return no_of_frames

#################################################### MAIN #####################################################

while True:
    # frame skipping to save time
    process_this_frame = not process_this_frame 

    # Grab a single frame of video
    ret, frame = video_capture.read()

    frame2 = frame.copy()
    frame3 = frame.copy()
    report = np.zeros((frame3.shape[0], frame3.shape[1], 3), np.uint8)
  
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
                count_items = {}
                count_items['person'] = 0
                count_items['laptop'] = 0
                count_items['cell phone'] = 0
                count_items['book'] = 0
                count_items['tv'] = 0
                print(e)

            # Multiple Person Buffer
            condition = (count_items['person'] != 1)
            no_of_frames_0 = alert(condition, no_of_frames_0)

            y_pos = 20
            alert_pos = (120, 190)

            # Display
            cv2.putText(report, "Number of people detected: " + str(count_items['person']), (1, y_pos), font, 1.1, (0, 255, 0), 2)

            # Alert
            if(no_of_frames_0 > 10):
                cv2.putText(report, "Number of people detected: " + str(count_items['person']), (1, y_pos), font, 1.1, (0, 0, 255), 2)
                cv2.putText(report, "ALERT", alert_pos, font, 4, (0, 0, 255), 2)
            
            # Object Detection Buffer
            condition = (count_items['laptop'] >= 1 or 
                        count_items['cell phone'] >= 1 or 
                        count_items['book'] >= 1 or 
                        count_items['tv'] >= 1)
         
            no_of_frames_1 = alert(condition, no_of_frames_1)

            # Display
            cv2.putText(report, "Banned objects detected: " + str(condition), (1, y_pos + 20), font, 1.1, (0, 255, 0), 2)

            # Alert
            if(no_of_frames_1 > 10):
                cv2.putText(report, "Banned objects detected: " + str(condition), (1, y_pos + 20), font, 1.1, (0, 0, 255), 2)
                cv2.putText(report, "ALERT", alert_pos, font, 4, (0, 0, 255), 2)
                
            if(count_items['person'] == 1):
                #### face detection using OpenCV's DNN module with TensorFlow model ####
                
                # detect face
                faces = find_faces(small_frame, face_model)
                if len(faces) > 0:
                    face = faces[0]
                    # Display Face Detection
                    (left, top, right, bottom) = face
                    cv2.rectangle(frame3, (left*4, top*4), (right*4, bottom*4), (0, 0, 255), 2)
                else:
                    cv2.putText(report, "No face detected", (1, y_pos + 40), font, 1.1, (0, 0, 255), 2)
                    cv2.putText(report, "ALERT", alert_pos, font, 4, (0, 0, 255), 2)
            
            horizontalAppendedImg = np.hstack((frame3, report))
            cv2.imshow("Proctoring_Window", horizontalAppendedImg)

        except Exception as e:
            print(e) 
            report = np.zeros((frame3.shape[0], frame3.shape[1], 3), np.uint8)

            #final display frame
            horizontalAppendedImg = np.hstack((frame3, report))
            cv2.imshow("Proctoring_Window", horizontalAppendedImg)
            
    # Display the resulting image
    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("closing window...")
        break
    
# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()