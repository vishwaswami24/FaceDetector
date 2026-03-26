import { useState, useRef, useEffect } from 'react'

function Camera({ onCapture, loading }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for the video to be ready before showing it
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setIsCameraActive(true)
          setError(null)
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      let errorMessage = 'Could not access camera. '
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings.'
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please connect a camera device.'
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.'
      } else {
        errorMessage += 'Please make sure you have granted camera permissions.'
      }
      
      setError(errorMessage)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.9)
      onCapture(imageData)
    }
  }

  return (
    <div className="camera-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />
        {!isCameraActive && (
          <div className="video-placeholder">
            {error || 'Camera is off'}
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {error && (
        <div style={{ color: '#e74c3c', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '15px' }}>
        {!isCameraActive ? (
          <button 
            className="btn btn-primary" 
            onClick={startCamera}
            disabled={loading}
          >
            Start Camera
          </button>
        ) : (
          <>
            <button 
              className="btn btn-secondary" 
              onClick={stopCamera}
              disabled={loading}
            >
              Stop Camera
            </button>
            <button 
              className="btn btn-primary" 
              onClick={captureImage}
              disabled={loading}
            >
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  Processing...
                </div>
              ) : (
                'Capture & Detect'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Camera
