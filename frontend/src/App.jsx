import { useState, useRef } from 'react'

const ACCEPTED_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/webm',
  'audio/ogg',
  'audio/flac',
  'audio/mp4',
  'audio/m4a',
  'video/mp4',
  'video/webm',
]

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function App() {
  const [file, setFile] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  function handleFileSelect(selected) {
    setError('')
    setTranscript('')

    if (!selected) {
      setFile(null)
      return
    }

    if (selected.size > 25 * 1024 * 1024) {
      setError('File must be 25 MB or smaller (Groq free tier limit).')
      setFile(null)
      return
    }

    setFile(selected)
  }

  async function transcribe() {
    if (!file) return

    setLoading(true)
    setError('')
    setTranscript('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const message = response.status === 400
          ? 'Invalid audio file. Please upload a supported format under 25 MB.'
          : 'Transcription failed. Check that the backend is running and your Groq API key is set.'
        throw new Error(message)
      }

      const data = await response.json()
      setTranscript(data.text || '')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copyTranscript() {
    if (transcript) {
      navigator.clipboard.writeText(transcript)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Audio Transcriber</h1>
        <p>Upload an audio file and get a text transcript using Spring AI + Groq Whisper (free tier).</p>
      </header>

      <main className="main">
        <section
          className={`dropzone ${dragOver ? 'dropzone-active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFileSelect(e.dataTransfer.files?.[0] ?? null)
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            hidden
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
          <div className="dropzone-content">
            <span className="dropzone-icon">🎙️</span>
            <p className="dropzone-title">
              {file ? file.name : 'Drop an audio file here or click to browse'}
            </p>
            {file && (
              <p className="dropzone-meta">{formatFileSize(file.size)}</p>
            )}
            <p className="dropzone-hint">MP3, WAV, FLAC, M4A, WebM — max 25 MB</p>
          </div>
        </section>

        <div className="actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!file || loading}
            onClick={transcribe}
          >
            {loading ? 'Transcribing…' : 'Transcribe'}
          </button>
          {file && !loading && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleFileSelect(null)}
            >
              Clear
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>Processing audio with Whisper…</p>
          </div>
        )}

        {transcript && (
          <section className="result">
            <div className="result-header">
              <h2>Transcript</h2>
              <button type="button" className="btn btn-secondary" onClick={copyTranscript}>
                Copy
              </button>
            </div>
            <pre className="transcript">{transcript}</pre>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Powered by{' '}
          <a href="https://spring.io/projects/spring-ai" target="_blank" rel="noreferrer">
            Spring AI
          </a>{' '}
          and{' '}
          <a href="https://console.groq.com" target="_blank" rel="noreferrer">
            Groq Whisper
          </a>
        </p>
      </footer>
    </div>
  )
}
