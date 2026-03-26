import { useState, useRef } from 'react'

function ImageUpload({ onUpload, loading }) {
  const [preview, setPreview] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDetect = () => {
    if (preview) {
      onUpload(preview)
    }
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="upload-container">
      {!preview ? (
        <>
          <div
            className={`upload-area ${isDragOver ? 'dragover' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">📷</div>
            <p className="upload-text">
              <span>Click to upload</span> or drag and drop<br />
              an image here
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
        </>
      ) : (
        <>
          <img 
            src={preview} 
            alt="Preview" 
            className="preview-image"
          />
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleDetect}
              disabled={loading}
            >
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  Processing...
                </div>
              ) : (
                'Detect Faces'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ImageUpload
