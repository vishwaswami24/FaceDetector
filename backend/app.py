from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import mediapipe as mp
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.core.base_options import BaseOptions
import os

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe Face Landmarker
# Use local model file
model_path = os.path.join(os.path.dirname(__file__), 'face_landmarker.task')

# Create FaceLandmarker options
base_options = BaseOptions(model_asset_path=model_path)

options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.IMAGE,
    num_faces=10,
    min_face_detection_confidence=0.5,
    min_face_presence_confidence=0.5,
    min_tracking_confidence=0.5,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False
)

# Create the landmarker
face_landmarker = vision.FaceLandmarker.create_from_options(options)

# Face contour - simple oval that doesn't cross through eyes
# Using only outer perimeter landmarks
FACE_OVAL_CONNECTIONS = [
    # Left side of face (from chin up to temple)
    (127, 162), (162, 21), (21, 54), (54, 103), (103, 67), (67, 109), (109, 10),
    # Left temple to top of head
    (10, 338),
    # Top of head across forehead
    (338, 297), (297, 332), (332, 284), (284, 251), (251, 389), 
    (389, 356), (356, 454), (454, 323), (323, 361), (361, 288), (288, 397),
    (397, 365), (365, 379), (379, 378), (378, 400), (400, 377), (377, 152),
    # Right side down to chin
    (152, 148), (148, 176), (176, 149), (149, 150), (150, 136), (136, 172),
    (172, 58), (58, 132), (132, 93), (93, 234), (234, 127)
]

# Minimal forehead - only top point, no lines near eyes
FOREHEAD_CONNECTIONS = [
    # Just connect top of face oval to highest point
    (10, 8), (8, 338)
]

def draw_face_mesh(image, face_landmarks, width, height):
    """Draw only face outline with dots - no internal lines."""
    landmarks = []
    for landmark in face_landmarks:
        x = int(landmark.x * width)
        y = int(landmark.y * height)
        landmarks.append((x, y))
    
    if len(landmarks) == 0:
        return
    
    # Network graph colors (BGR format for OpenCV)
    NETWORK_BLUE = (220, 170, 150)
    
    # Draw only face outer contour
    oval_points = []
    for start_idx, end_idx in FACE_OVAL_CONNECTIONS:
        if start_idx < len(landmarks):
            oval_points.append(landmarks[start_idx])
    
    if len(oval_points) > 1:
        oval_points = np.array(oval_points, dtype=np.int32)
        cv2.polylines(image, [oval_points], True, NETWORK_BLUE, 2)
    
    # Draw forehead top connection
    for start_idx, end_idx in FOREHEAD_CONNECTIONS:
        if start_idx < len(landmarks) and end_idx < len(landmarks):
            pt1 = landmarks[start_idx]
            pt2 = landmarks[end_idx]
            cv2.line(image, pt1, pt2, NETWORK_BLUE, 1)
    
    # Eye landmarks to exclude from dot drawing
    LEFT_EYE_INDICES = {33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7}
    RIGHT_EYE_INDICES = {362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382}
    EYE_INDICES = LEFT_EYE_INDICES.union(RIGHT_EYE_INDICES)
    
    # Draw all landmarks as dots ONLY - no connecting lines in middle
    for i, (x, y) in enumerate(landmarks):
        # Skip eye landmarks to avoid dots on eyes
        if i not in EYE_INDICES:
            cv2.circle(image, (x, y), 2, NETWORK_BLUE, -1)

def detect_faces_in_image(image):
    """Detect faces using MediaPipe and draw face mesh."""
    height, width = image.shape[:2]
    
    # Convert BGR to RGB for MediaPipe
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Create MediaPipe Image
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_image)
    
    # Detect face landmarks
    detection_result = face_landmarker.detect(mp_image)
    
    face_count = 0
    if detection_result.face_landmarks:
        face_count = len(detection_result.face_landmarks)
        for face_landmarks in detection_result.face_landmarks:
            draw_face_mesh(image, face_landmarks, width, height)
    
    return image, face_count

def image_to_base64(image):
    """Convert OpenCV image to base64 string."""
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

def base64_to_image(base64_string):
    """Convert base64 string to OpenCV image."""
    # Remove data URL prefix if present
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    image_bytes = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_bytes))
    # Convert PIL image to OpenCV format (BGR)
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    return image

@app.route('/detect', methods=['POST'])
def detect_faces():
    """Endpoint to detect faces in an image."""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Convert base64 to image
        image = base64_to_image(image_data)
        
        # Detect faces
        processed_image, face_count = detect_faces_in_image(image)
        
        # Convert back to base64
        result_image = image_to_base64(processed_image)
        
        return jsonify({
            'success': True,
            'face_count': face_count,
            'image': f'data:image/jpeg;base64,{result_image}'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
