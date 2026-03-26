import { useState, useRef, useEffect } from 'react'
import Camera from './components/Camera'
import ImageUpload from './components/ImageUpload'
import ResultDisplay from './components/ResultDisplay'
import NetworkBackground from './components/NetworkBackground'
import './App.css'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('camera') // 'camera' or 'upload'

  const handleImageCapture = async (imageData) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })

      const data = await response.json()
      if (data.success) {
        setResult(data)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to detect faces. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NetworkBackground />
      <div className="app">
        <header className="app-header">
          <h1>Face Detection App</h1>
          <p>Detect faces using your camera or upload an image</p>
        </header>

        <main className="app-main">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'camera' ? 'active' : ''}`}
              onClick={() => setActiveTab('camera')}
            >
              Camera
            </button>
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload Image
            </button>
          </div>

          <div className="content">
            {activeTab === 'camera' ? (
              <Camera onCapture={handleImageCapture} loading={loading} />
            ) : (
              <ImageUpload onUpload={handleImageCapture} loading={loading} />
            )}
          </div>

          {result && (
            <ResultDisplay 
              image={result.image} 
              faceCount={result.face_count}
              onClear={() => setResult(null)}
            />
          )}
        </main>
      </div>
    </>
  )
}

export default App
