function ResultDisplay({ image, faceCount, onClear }) {
  return (
    <div className="result-container">
      <h2>Detection Result</h2>
      <div className="face-count">
        {faceCount === 0 
          ? 'No faces detected' 
          : faceCount === 1 
            ? '1 face detected' 
            : `${faceCount} faces detected`
        }
      </div>
      <img 
        src={image} 
        alt="Detection result" 
        className="result-image"
      />
      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-secondary" onClick={onClear}>
          Detect Another
        </button>
      </div>
    </div>
  )
}

export default ResultDisplay
