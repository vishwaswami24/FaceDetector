# Face Detection App

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/OpenCV-27338e?style=for-the-badge&logo=OpenCV&logoColor=white" alt="OpenCV">
  <img src="https://img.shields.io/badge/MediaPipe-0099FF?style=for-the-badge&logo=google&logoColor=white" alt="MediaPipe">
</p>

<p align="center">
  <b>A full-stack face detection application with real-time camera and image upload support</b>
</p>

<p align="center">
  <img src="demo.png" alt="Face Detection Demo" width="600">
</p>

## Features

- **Camera Detection**: Use your webcam to detect faces in real-time
- **Image Upload**: Upload images for face detection
- **Face Mesh**: Displays a network-style mesh overlay on detected faces
- **Dark Theme**: Modern dark UI with animated network background
- **Multiple Faces**: Can detect up to 10 faces in a single image

## Tech Stack

### Frontend
- React 18
- Vite
- HTML5 Canvas (for network background animation)

### Backend
- Python 3.8+
- Flask
- MediaPipe Face Mesh
- OpenCV

## Project Structure

```
SketchArt/
├── backend/
│   ├── app.py              # Flask server
│   ├── requirements.txt    # Python dependencies
│   └── face_landmarker.task # MediaPipe model (downloaded automatically)
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── App.css         # Styles
│   │   └── components/     # React components
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will run on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5174

## Usage

1. Open http://localhost:5174 in your browser
2. Allow camera permissions when prompted (for camera mode)
3. Click "Start Camera" to detect faces in real-time
4. Or switch to "Upload Image" tab to detect faces in images
5. Click "Capture & Detect" or "Detect Faces" to process

## API Endpoints

- `POST /detect` - Detect faces in an image
  - Request: `{ "image": "base64_encoded_image" }`
  - Response: `{ "success": true, "face_count": 1, "image": "base64_result" }`

- `GET /health` - Health check

## License

MIT License - see LICENSE file for details
